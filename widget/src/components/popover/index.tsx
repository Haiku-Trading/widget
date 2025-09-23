import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '../../utils'
import { useTheme } from '../../providers/theme-provider'

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof PopoverPrimitive.Trigger>
type TriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>

export const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { asChild = true, ...triggerProps } = props
  return <PopoverPrimitive.Trigger asChild={asChild} {...triggerProps} ref={ref} />
})

Trigger.displayName = 'PopoverTrigger'

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof PopoverPrimitive.Content>
type ContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>

export const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { className, ...contentProps } = props
  
  // Get the theme container to use as portal container
  const { theme } = useTheme()
  const themeContainer = typeof document !== 'undefined' 
    ? document.querySelector('.haiku-widget-theme-container') as HTMLElement
    : null
  
  return (
    <PopoverPrimitive.Portal container={themeContainer}>
      <PopoverPrimitive.Content
        className={cn(
          'font-sans border-[0.7px] border-border rounded-xl bg-secondary text-muted-foreground shadow-[0px_2px_9.9px_0px_#19191D0D]',
          'origin-[--radix-popover-content-transform-origin]',
          // Animation enter
          'data-[state=open]:data-[side=top]:animate-slide-from-top data-[state=open]:data-[side=bottom]:animate-slide-from-bottom data-[state=open]:data-[side=left]:animate-slide-from-left data-[state=open]:data-[side=right]:animate-slide-from-right',
          // Animation out
          'data-[state=closed]:data-[side=top]:animate-slide-to-top data-[state=closed]:data-[side=bottom]:animate-slide-to-bottom data-[state=closed]:data-[side=left]:animate-slide-to-left data-[state=closed]:data-[side=right]:animate-slide-to-right',
          className,
        )}
        {...contentProps}
        ref={ref}
      />
    </PopoverPrimitive.Portal>
  )
})

Content.displayName = 'PopoverContent'

export const PopoverRoot = PopoverPrimitive.Root
export const PopoverAnchor = PopoverPrimitive.Anchor
export const PopoverArrow = PopoverPrimitive.Arrow
export const PopoverClose = PopoverPrimitive.Close

export const Popover = {
  Root: PopoverRoot,
  Trigger,
  Anchor: PopoverAnchor,
  Content,
  Arrow: PopoverArrow,
  Close: PopoverClose,
}
