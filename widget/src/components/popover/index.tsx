import { ComponentPropsWithoutRef, ElementRef, forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '../../utils'
import { useTheme } from '../../providers/theme-provider'
import { applyThemeToElement } from '../../utils/theme-utils'

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

// Theme wrapper for popover content - applies theme without interfering with Radix positioning
// Must use forwardRef because Radix UI passes refs to child components
const PopoverThemeWrapper = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const { theme } = useTheme()
    const internalRef = useRef<HTMLDivElement>(null)

    // Callback ref to handle both forwarded ref and internal ref
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        // Set the forwarded ref if provided
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
        // Set the internal ref
        internalRef.current = node

        // Apply theme immediately when element is mounted
        if (node) {
          applyThemeToElement(node, theme)
        }
      },
      [ref, theme],
    )

    // Apply theme when theme changes (for updates after mount)
    useEffect(() => {
      const element = internalRef.current
      if (element) {
        applyThemeToElement(element, theme)
      }
    }, [theme])

    return (
      <div ref={setRefs} className="haiku-widget-theme-container">
        {children}
      </div>
    )
  },
)

PopoverThemeWrapper.displayName = 'PopoverThemeWrapper'

export const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { className, ...contentProps } = props
  
  // Get the theme container to use as portal container
  // Find it dynamically to ensure it's available
  const getThemeContainer = useCallback(() => {
    if (typeof document === 'undefined') return null
    // Try to find the main theme container (not nested ones from dialogs)
    const containers = document.querySelectorAll('.haiku-widget-theme-container')
    // Return the first one (main container) or null to let Radix use default
    return containers.length > 0 ? (containers[0] as HTMLElement) : null
  }, [])

  const themeContainer = useMemo(() => getThemeContainer(), [getThemeContainer])
  
  return (
    <PopoverPrimitive.Portal container={themeContainer || undefined}>
      <PopoverThemeWrapper>
        <PopoverPrimitive.Content
          ref={ref}
          className={cn(
            'font-sans border-[0.7px] border-border rounded-xl bg-bg-primary text-muted-foreground shadow-[0px_2px_9.9px_0px_#19191D0D]',
            'origin-[--radix-popover-content-transform-origin]',
            // Animation enter
            'data-[state=open]:data-[side=top]:animate-slide-from-top data-[state=open]:data-[side=bottom]:animate-slide-from-bottom data-[state=open]:data-[side=left]:animate-slide-from-left data-[state=open]:data-[side=right]:animate-slide-from-right',
            // Animation out
            'data-[state=closed]:data-[side=top]:animate-slide-to-top data-[state=closed]:data-[side=bottom]:animate-slide-to-bottom data-[state=closed]:data-[side=left]:animate-slide-to-left data-[state=closed]:data-[side=right]:animate-slide-to-right',
            className,
          )}
          {...contentProps}
        />
      </PopoverThemeWrapper>
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
