import React, { useEffect, useRef, useState } from 'react'

interface ICustomSlider {
  value: number
  onChange: (value: number) => void
}

const SLIDER_WIDTH_PX = 1000

const CustomSlider: React.FC<ICustomSlider> = ({ value = 50, onChange }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState(406)
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [initialOffset, setInitialOffset] = useState(0)

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const maxOffset = SLIDER_WIDTH_PX - containerWidth / 2

  useEffect(() => {
    if (!isDragging) {
      let newOffset = (value / 100) * SLIDER_WIDTH_PX - containerWidth / 2

      if (newOffset < -178) newOffset = -178
      if (newOffset > maxOffset) newOffset = maxOffset

      if (Math.round(newOffset) !== Math.round(offset)) {
        setOffset(newOffset)
      }
    }
  }, [value, isDragging, containerWidth, maxOffset])

  const handleStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartX(getEventX(e))
    setInitialOffset(offset)
  }

  // const handleMouseMove = (e: MouseEvent) => {
  //   if (!isDragging) return

  //   const deltaX = e.clientX - dragStartX
  //   let newOffset = initialOffset - deltaX

  //   if (newOffset < -178) newOffset = -178
  //   if (newOffset > maxOffset) newOffset = maxOffset

  //   setOffset(newOffset)

  //   const centerPosition = newOffset + containerWidth / 2
  //   let newValue = (centerPosition / SLIDER_WIDTH_PX) * 100

  //   if (newValue < 0) newValue = 0
  //   if (newValue > 100) newValue = 100

  //   const roundedValue = Math.round(newValue)
  //   if (roundedValue !== value) {
  //     onChange(roundedValue)
  //   }
  // }

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return

    const deltaX = getEventX(e) - dragStartX
    let newOffset = initialOffset - deltaX

    if (newOffset < -178) newOffset = -178
    if (newOffset > maxOffset) newOffset = maxOffset

    setOffset(newOffset)

    const centerPosition = newOffset + containerWidth / 2
    let newValue = (centerPosition / SLIDER_WIDTH_PX) * 100

    if (newValue < 0) newValue = 0
    if (newValue > 100) newValue = 100

    const roundedValue = Math.round(newValue)
    if (roundedValue !== value) {
      onChange(roundedValue)
    }
  }

  const getEventX = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): number => {
    if ('touches' in e) {
      return e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0
    }
    return (e as MouseEvent).clientX
  }

  const handleEnd = () => {
    setIsDragging(false)
  }
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)

      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)

      return () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging, dragStartX, initialOffset, containerWidth, maxOffset, value, onChange])

  const clampedValue = Math.round(((offset + containerWidth / 2) / SLIDER_WIDTH_PX) * 100)

  return (
    <div className="mx-auto p-4 w-full" style={{ maxWidth: '100%' }}>
      <div className="relative overflow-hidden select-none">
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '10px solid #C2410C',
            }}
          />
        </div>

        <div
          ref={containerRef}
          className="relative h-12 overflow-hidden"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{ width: '100%', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          <div
            className="relative h-full"
            style={{
              width: SLIDER_WIDTH_PX,
              // marginLeft: offset === 0 ? 143 : -offset,
              marginLeft: -offset,
              // paddingLeft: containerWidth / 2,
              // paddingRight: containerWidth / 2,
              userSelect: 'none',
            }}
          >
            {Array.from({ length: 101 }, (_, i) => {
              let height = 13
              if (i % 10 === 0) height = 20
              else if (i % 10 === 5) height = 16

              return (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: i * 10, transform: 'translateX(-50%)' }}
                >
                  <div
                    className="w-0.5 mx-auto"
                    style={{
                      height,
                      backgroundColor: i % 10 === 0 ? '#C2410C' : '#FF6D33',
                    }}
                  />
                  {i % 10 === 0 && (
                    <div
                      className="text-xs mt-1 text-center whitespace-nowrap"
                      style={{ color: '#C2410C' }}
                    >
                      {i}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center mt-2 select-none">
          <span className="text-sm font-medium">{clampedValue}</span>
        </div>
      </div>
    </div>
  )
}

export default CustomSlider
