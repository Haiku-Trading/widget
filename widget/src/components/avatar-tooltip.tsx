import { Avatar, AvatarProps } from './avatar'
import { ReactNode } from 'react'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent, TooltipArrow } from './tooltip/tooltip'
import { getChainIcon } from '../utils/chain-utils'
import { getProtocolIcon } from '../utils/protocol-utils'

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
              <div className="size-3.5 absolute -bottom-1 -right-1 rounded-full">
                {getChainIcon(chainId.toString(), "size-3.5")}
              </div>
            )}
            {protocol && (
              <div className="size-3.5 absolute -bottom-1 -right-1 rounded-full">
                {getProtocolIcon(protocol, "size-3.5")}
              </div>
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
