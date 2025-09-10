
import React, { ReactNode, forwardRef } from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { cn } from '../../utils'

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>

type TooltipProps = {
  children: ReactNode
  content?: ReactNode
  delayDuration?: number
  asChild?: boolean
} & Omit<TooltipContentProps, 'children'>

export const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>((props, ref) => {
  const {
    children,
    content,
    delayDuration = 300,
    asChild = true,
    className,
    ...contentProps
  } = props

  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger ref={ref} asChild={asChild}>
        {children}
      </TooltipPrimitive.Trigger>

      {content && (
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            className={cn(
              'bg-section border border-border rounded-xl text-muted-foreground p-3 text-xs z-[100] max-w-[272px]',
              'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
              className,
            )}
            {...contentProps}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-section h-[6px] w-3" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      )}
    </TooltipPrimitive.Root>
  )
})

Tooltip.displayName = 'Tooltip'
