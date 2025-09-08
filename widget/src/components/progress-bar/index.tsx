import { Avatar } from '../avatar'
import { AvatarTooltip } from '../avatar-tooltip'
import { Badge } from '../badge'

type ProgressBarProps = {
  icon: string
  percentage?: number
  color?: string
  fbName?: string
  chainId?: number
}

export const ProgressBar = ({ color, icon, percentage = 0, fbName, chainId }: ProgressBarProps) => {
  return (
    <div
      className="rounded-full h-14 bg-blue-500 flex justify-between items-center min-w-[150px] pr-2"
      style={{ width: `${percentage}%`, backgroundColor: color }}
    >
      <Badge className="bg-transparent flex-shrink-0">
        <AvatarTooltip
          src={icon || ''}
          alt={fbName || 'icon'}
          fallbackName={fbName}
          color={color}
          chainId={chainId}
          // protocol={coin.protocol}
          rootClassName="size-8"
          tooltipContent={
            <div className="flex items-center justify-center gap-1">
              <Avatar
                alt={fbName || 'icon'}
                src={icon || ''}
                fallbackName={fbName}
                color={color}
                rootClassName="size-10"
              />
              {/* <span className="text-muted-foreground">{coin.name}</span> */}
            </div>
          }
        />
      </Badge>

      <div className="text-lg font-medium text-white text-left ml-2">{percentage}%</div>
    </div>
  )
}
