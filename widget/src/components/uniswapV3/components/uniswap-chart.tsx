/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAX_TICK, MIN_TICK, priceToTick } from '@/modules/agent/utils/uniswapV3'
import {
  LineSeries,
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
} from 'lightweight-charts'
import React, { useEffect, useRef, useState } from 'react'
import { nearestUsableTick } from '@/modules/agent/utils/uniswapV3'

type UniswapChartProps = {
  data: {
    time: number
    value: number
  }[] // [timestamp in seconds, value]
  isFullRange: boolean
  timeframe?: 'day' | 'hour' | 'minute'
  inverted?: boolean // Whether the chart is showing inverted price
  colors?: {
    backgroundColor?: string
    lineColor?: string
    areaTopColor?: string
    areaBottomColor?: string
  }
  setMinMaxRange: (range: { minRange: number; maxRange: number }) => void
  concentratedPoolData?: {
    currentPrice: string
    currentTick: string
    liquidity: string
    liquidityRaw: string
    sqrtPriceX96: string
    tickSpacing: number
    token0: any
    token1: any
    token0PriceUSD: string
    token1PriceUSD: string
  }
  onSetTickRange?: (range: { lower: string; upper: string }) => void
}

const UniswapChart: React.FC<UniswapChartProps> = ({
  data,
  colors,
  isFullRange,
  timeframe = 'day',
  inverted = false,
  concentratedPoolData,
  onSetTickRange,
  setMinMaxRange,
}) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seriesRef = useRef<(ISeriesApi<'Line'> & { _lastPriceLine?: any }) | null>(null)

  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [maxPrice, setMaxPrice] = useState<number>(0)
  const [minPrice, setMinPrice] = useState<number>(0)

  // default ranges
  const [rangeTop, setRangeTop] = useState<number>(isFullRange ? 0 : 35)
  const [rangeBottom, setRangeBottom] = useState<number>(isFullRange ? 100 : 65)

  const [isDragging, setIsDragging] = useState<'top' | 'bottom' | 'middle' | null>(null)
  const [dragStartY, setDragStartY] = useState<number>(0)
  const [dragStartTop, setDragStartTop] = useState<number>(0)
  const [dragStartBottom, setDragStartBottom] = useState<number>(0)

  // chart setup
  useEffect(() => {
    if (!chartContainerRef.current) return
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: colors?.backgroundColor || '#f974151A' },
        textColor: '#888',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      leftPriceScale: { visible: false },
      rightPriceScale: { visible: true, borderVisible: false, invertScale: inverted },
      timeScale: { 
        visible: true, 
        borderVisible: false, 
        timeVisible: timeframe === 'hour' || timeframe === 'minute',
        secondsVisible: timeframe === 'minute',
      },
      crosshair: { 
        vertLine: { visible: true, labelVisible: false }, 
        horzLine: { visible: true, labelVisible: false } 
      },
    })

    chartRef.current = chart

    // Transform data from [timestamp, value] to {time, value} format
    const transformedData: LineData[] = data.map(({time, value}) => ({
      time: time as any, // timestamp in seconds
      value,
    }))

    const newSeries = chart.addSeries(LineSeries, {
      color: colors?.lineColor || '#f97415',
      lineWidth: 3,
      priceLineVisible: false,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
    })

    newSeries.setData(transformedData)
    seriesRef.current = newSeries
    // chart.timeScale().fitContent()

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, inverted])

  // update data and current price
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || data.length === 0) return

    const series = seriesRef.current
    const chart = chartRef.current

    // Transform data from [timestamp, value] to {time, value} format
    const transformedData: LineData[] = data.map(({time, value}) => ({
      time: time as any, // timestamp in seconds
      value,
    }))

    series.setData(transformedData)

    const lastValue = data[data.length - 1]?.value ?? 0
    const prices = data.map((d) => d.value)
    const minP = Math.min(...prices)
    const maxP = Math.max(...prices)

    setCurrentPrice(lastValue)
    setMinPrice(minP)
    setMaxPrice(maxP)

    // Better autoscale based on actual data range
    const padding = (maxP - minP) * 0.1 // 10% padding
    const minValue = minP - padding
    const maxValue = maxP + padding

    if (isFinite(minValue) && isFinite(maxValue) && minValue < maxValue) {
      series.applyOptions({
        autoscaleInfoProvider: () => ({
          priceRange: {
            minValue: minValue,
            maxValue: maxValue,
          },
        }),
      })
    }

    chart.timeScale().fitContent()

    if (series._lastPriceLine) series.removePriceLine(series._lastPriceLine)
    series._lastPriceLine = series.createPriceLine({
      price: lastValue,
      color: '#9ca3af',
      lineWidth: 1,
      lineStyle: 3,
      axisLabelVisible: false,
      title: '',
    })
  }, [data])

  // dragging
  const handleMouseDown = (e: React.MouseEvent, type: 'top' | 'bottom' | 'middle') => {
    e.preventDefault()
    setIsDragging(type)
    setDragStartY(e.clientY)
    setDragStartTop(rangeTop)
    setDragStartBottom(rangeBottom)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !chartContainerRef.current) return
    const rect = chartContainerRef.current.getBoundingClientRect()
    const deltaY = ((e.clientY - dragStartY) / rect.height) * 100

    if (isDragging === 'top') {
      const newTop = Math.max(0, Math.min(dragStartTop + deltaY, rangeBottom - 1))
      setRangeTop(newTop)
    } else if (isDragging === 'bottom') {
      const newBottom = Math.max(rangeTop + 1, Math.min(dragStartBottom + deltaY, 100))
      setRangeBottom(newBottom)
    } else if (isDragging === 'middle') {
      const rangeHeight = rangeBottom - rangeTop
      let newTop = dragStartTop + deltaY
      let newBottom = dragStartBottom + deltaY
      if (newTop < 0) {
        newTop = 0
        newBottom = rangeHeight
      } else if (newBottom > 100) {
        newBottom = 100
        newTop = 100 - rangeHeight
      }
      setRangeTop(newTop)
      setRangeBottom(newBottom)
    }
  }

  const handleMouseUp = () => setIsDragging(null)

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStartY, dragStartTop, dragStartBottom, rangeTop, rangeBottom])

  // percent-to-pixel helper
  const pixelYForPercent = (percent: number) => {
    const container = chartContainerRef.current
    if (!container) return 0
    return (percent / 100) * container.clientHeight
  }

  const priceAtPercent = (percent: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seriesAny = seriesRef.current as any
    const container = chartContainerRef.current
    if (!container) return null
    const y = pixelYForPercent(percent)
    if (seriesAny && typeof seriesAny.coordinateToPrice === 'function') {
      const p = seriesAny.coordinateToPrice(y)
      if (p != null) return p
    }
    if (maxPrice === minPrice) return maxPrice
    return maxPrice - ((maxPrice - minPrice) * percent) / 100
  }

  const formatPercentLabel = (val: number) => {
    if (!isFinite(val) || Math.abs(val) < 0.0005) return '0.00%'
    const sign = val > 0 ? '+' : ''
    return `${sign}${val.toFixed(2)}%`
  }

  const topPrice = priceAtPercent(rangeTop) ?? currentPrice
  const bottomPrice = priceAtPercent(rangeBottom) ?? currentPrice
  const topDiff = currentPrice ? ((topPrice - currentPrice) / currentPrice) * 100 : 0
  const bottomDiff = currentPrice ? ((bottomPrice - currentPrice) / currentPrice) * 100 : 0

  useEffect(() => {
    if (!currentPrice || !topPrice || !bottomPrice) return

    // When inverted, we need to convert prices back to original (non-inverted) values
    // But keep the SAME tick order (lower and upper should stay the same)
    
    let priceForUpperTick: number
    let priceForLowerTick: number
    const decimal0 = concentratedPoolData?.token0.decimals || 0
    const decimal1 = concentratedPoolData?.token1.decimals || 0

    if (inverted) {
      // Chart is showing inverted prices (token1/token0 instead of token0/token1)
      // We need to convert back to token0/token1 for tick calculation
      // topPrice in UI (smaller when inverted) = 1/actualLowerPrice -> actualLowerPrice = 1/topPrice
      // bottomPrice in UI (larger when inverted) = 1/actualUpperPrice -> actualUpperPrice = 1/bottomPrice
      priceForLowerTick = topPrice !== 0 ? 1 / topPrice : 0
      priceForUpperTick = bottomPrice !== 0 ? 1 / bottomPrice : 0
    } else {
      // Normal case: topPrice -> upper tick, bottomPrice -> lower tick
      priceForUpperTick = topPrice
      priceForLowerTick = bottomPrice
    }

    let upper = priceToTick(priceForUpperTick, decimal0, decimal1)
    let lower = priceToTick(priceForLowerTick, decimal0, decimal1)


    upper = upper > MAX_TICK ? MAX_TICK : upper < MIN_TICK ? MIN_TICK : upper
    lower = lower < MIN_TICK ? MIN_TICK : lower > MAX_TICK ? MAX_TICK : lower

    if (onSetTickRange) {
      onSetTickRange({
        lower: nearestUsableTick(lower, concentratedPoolData?.tickSpacing ?? 0).toString(),
        upper: nearestUsableTick(upper, concentratedPoolData?.tickSpacing ?? 0).toString(),
      })
    }

    setMinMaxRange({ minRange: bottomPrice, maxRange: topPrice })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topPrice, bottomPrice, currentPrice, inverted])

  const bubbleStyleBase: React.CSSProperties = {
    position: 'absolute',
    left: 10,
    transform: 'translateY(-50%)',
    padding: '6px 10px',
    borderRadius: 12,
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 6px 18px rgba(16,24,40,0.06)',
    fontSize: 13,
    fontWeight: 600,
    color: '#f97415',
    zIndex: 11,
    lineHeight: 1,
    minWidth: 56,
    textAlign: 'center',
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div ref={chartContainerRef} style={{ width: '100%', height: '300px', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: `${rangeTop}%`,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#9ca3af',
            cursor: 'ns-resize',
            zIndex: 10,
            display: isFullRange ? 'none' : '',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'top')}
        >
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '10px',
              backgroundColor: '#9ca3af',
              borderRadius: '2px',
            }}
          />
          <div style={{ ...bubbleStyleBase, top: '50%' }}>{formatPercentLabel(topDiff)}</div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: `${rangeTop}%`,
            left: 0,
            right: 0,
            height: `${rangeBottom - rangeTop}%`,
            backgroundColor: 'rgba(156, 163, 175, 0.08)',
            border: '1px dashed #9ca3af',
            borderTop: 'none',
            borderBottom: 'none',
            cursor: 'move',
            zIndex: 9,
            display: isFullRange ? 'none' : '',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'middle')}
        />

        <div
          style={{
            position: 'absolute',
            top: `${rangeBottom}%`,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#9ca3af',
            cursor: 'ns-resize',
            zIndex: 10,
            display: isFullRange ? 'none' : '',
          }}
          onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        >
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '40px',
              height: '10px',
              backgroundColor: '#9ca3af',
              borderRadius: '2px',
            }}
          />
          <div style={{ ...bubbleStyleBase, top: '50%' }}>{formatPercentLabel(bottomDiff)}</div>
        </div>
      </div>
    </div>
  )
}

export default UniswapChart
