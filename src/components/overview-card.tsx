import { cn } from '../utils'
import { Card } from './card'

type OverviewCardProps = {
  overview: Array<{ label: string; value: string }>
  className?: string
}

export function OverviewCard(props: OverviewCardProps) {
  const { overview, className } = props

  return (
    <Card className={cn('flex flex-col gap-2 w-full', className)}>
      {overview.map((item, i) => (
        <div key={i} className="flex justify-between">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-xs text-foreground">{item.value}</p>
        </div>
      ))}
    </Card>
  )
}
