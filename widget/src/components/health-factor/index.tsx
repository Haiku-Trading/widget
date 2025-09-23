import { cn } from '../../utils'
import { Dialog } from '../dialog'
import React from 'react'

type segments = {
  color: string
  min: number
  max?: number
}
type HealthBarProps = {
  health: number
  max: number
  segments: segments[]
  showPercentage?: boolean
  text?: string
}
const HealthBar = (props: HealthBarProps) => {
  const { health, max, segments, showPercentage = false, text } = props
  const getTextColor = () => {
    const segment = segments.find(
      (seg) => health >= seg.min && (seg.max === undefined || health <= seg.max),
    )
    return segment ? segment.color : 'white'
  }

  const segmentWeights: Record<number, number> = {
    0: 15,
    1: 30,
    2: 45,
    3: 10,
  }

  // Normalize weights to percentage
  const totalWeight = Object.values(segmentWeights).reduce((sum, w) => sum + w, 0)

  const getMarkerPosition = (value: number) => {
    const segmentWeights = [15, 30, 45, 10] // Same weights used for segment widths
    const totalWeight = segmentWeights.reduce((sum, w) => sum + w, 0)

    let accumulatedWidth = 0
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const segmentWidth = (segmentWeights[i] / totalWeight) * 100

      if (value >= segment.min && (segment.max === undefined || value <= segment.max)) {
        // Get relative position within the current segment
        const segmentProgress = (value - segment.min) / ((segment.max ?? max) - segment.min)
        return accumulatedWidth + segmentProgress * segmentWidth
      }
      accumulatedWidth += segmentWidth
    }
    return accumulatedWidth // Default case (failsafe)
  }
  return (
    <div className="relative w-full">
      <div className="absolute right-0 -top-5">
        {text && <p className="text-xs text-foreground">{text}</p>}
      </div>
      <div className="relative w-full h-[5px] rounded-full bg-gray-700 overflow-hidden">
        <div className="absolute top-0 left-0 h-full flex w-full">
          {segments.map((segment, index) => {
            const width = (segmentWeights[index] / totalWeight) * 100
            return (
              <div
                key={index}
                className="h-full"
                style={{ backgroundColor: segment.color, width: `${width}%` }}
              />
            )
          })}
        </div>
      </div>

      <div
        className="absolute flex flex-col items-center -top-[22px] gap-1"
        style={{ left: `${getMarkerPosition(health)}%`, transform: 'translateX(-50%)' }}
      >
        <p className="text-xs px-1 rounded" style={{ color: getTextColor() }}>
          {showPercentage ? `${health}%` : health}
        </p>
        <div className="h-[9px] w-[2px] bg-white rounded" />
      </div>
    </div>
  )
}

const legend = [
  {
    value: '≤1.0',
    label: 'At risk',
  },
  {
    value: '1.1-1.5',
    label: 'Monitor',
  },
  {
    value: '1.5>',
    label: 'Healthy',
  },
  {
    value: '∞',
    label: 'No borrowed assets',
  },
]
type HealthFactorProps = {
  health: number
  maxLTV?: number
  currentLTV: number
}
export const HealthFactor = ({ health, maxLTV = 75, currentLTV }: HealthFactorProps) => {
  const segments = [
    { color: 'hsl(var(--failed))', min: 0.1, max: 1.0 },
    { color: 'hsl(var(--warning))', min: 1.1, max: 1.5 },
    { color: 'hsl(var(--success))', min: 1.5 },
    { color: 'hsl(var(--neutral))', min: 0, max: 0.5 },
  ]
  const markerPosition = Math.min((currentLTV / maxLTV) * maxLTV, maxLTV)
  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Input Health Factor</Dialog.Title>
        <Dialog.Description className="sr-only">
          View and understand your current health factor and liquidation risk.
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 rounded-xl text-white border w-full border-border flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Health Factor represents the risk of your collateral being liquidated. A Health Factor
              of 1.0 or below means liquidation is imminent. Maintaining a higher Health Factor
              reduces this risk.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <HealthBar health={health} max={5} segments={segments} />
              <div className="flex flex-col gap-1">
                {legend.map((item) => (
                  <div className="flex justify-between items-center text-xs" key={item.label}>
                    <p
                      className={cn('px-2 py-0.5 rounded-full', {
                        'text-failed bg-failed/10': item.label === 'At risk',
                        'text-warning-text bg-warning-bg/10': item.label === 'Monitor',
                        'text-success bg-success/10': item.label === 'Healthy',
                        'text-neutral bg-neutral/10': item.label === 'No borrowed assets',
                      })}
                    >
                      {item.value}
                    </p>
                    <p>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 border border-border rounded-xl flex flex-col gap-4 text-white mt-4">
            <div className="flex flex-col gap-1">
              <p className="font-medium">Current LTV</p>
              <p className="text-sm text-muted-foreground">
                Loan-to-Value (LTV) represents the proportion of your loan relative to your
                collateral’s value. The maximum LTV threshold varies by platform and may change over
                time. To avoid liquidation, regularly check and manage your positions.
              </p>
              <div className="mt-6 flex flex-col gap-2 relative">
                <div className="absolute right-0 -top-[18px]">
                  <p className="text-xs text-foreground">Max:{maxLTV}%</p>
                </div>
                <div className="relative overflow-hidden bg-bar w-full h-[5px] rounded-full">
                  <div
                    style={{ width: `${maxLTV}%` }}
                    className="absolute top-0 left-0 bg-success h-full rounded-full"
                  />
                </div>

                <div
                  className="absolute -top-[18px] flex flex-col items-center"
                  style={{
                    left: `${markerPosition}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <p className="text-xs">{currentLTV}%</p>
                  <div className="w-[2px] h-[10px] bg-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Body>
    </>
  )
}
