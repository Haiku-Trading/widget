import { Avatar, AvatarProps } from './avatar'
import { ReactNode } from 'react'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent, TooltipArrow } from './tooltip/tooltip'

type AvatarTooltipProps = {
  tooltipContent: ReactNode
  chainId?: number
  protocol?: string
} & AvatarProps

export function AvatarTooltip({ tooltipContent, chainId, protocol, ...props }: AvatarTooltipProps) {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>
          <div className="relative">
            <Avatar {...props} />
            {chainId && (
              <img
                src={`/icons/networks/${chainId}.svg`}
                alt="Chain logo"
                className="size-3.5 absolute -bottom-1 -right-1 rounded-full"
              />
            )}
            {protocol && (
              <img
                src={`/icons/protocols/${protocol}.svg`}
                alt={`Protocol ${protocol} logo`}
                className="size-3.5 absolute -bottom-1 -right-1 rounded-full"
              />
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent
          className="bg-bg-primary p-2 border-stroke-grey-primary border rounded-lg text-grey-primary text-xs font-medium"
          side="top"
        >
          {tooltipContent}
          <TooltipArrow className="fill-border" />
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  )
}
