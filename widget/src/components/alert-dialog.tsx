
import { ComponentProps, ComponentPropsWithoutRef, ElementRef, ReactNode, forwardRef, useEffect, useMemo, useRef } from 'react'
import { Dialog as AlertDialogPrimitive } from 'radix-ui'
import { Drawer } from 'vaul'
import { useMediaQuery } from '@uidotdev/usehooks'
import { cn } from '../utils'
import { InfoOutlineIcon } from './icons'
import { useTheme } from '../providers/theme-provider'
import { applyThemeToElement } from '../utils/theme-utils'


/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type RootProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> & {
  nested?: boolean
}

export const Root = (props: RootProps) => {
  const { nested = false, ...rootProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const DrawerRoot = nested ? Drawer.NestedRoot : Drawer.Root
  const RootWrapper = isMobile ? DrawerRoot : AlertDialogPrimitive.Root
  return <RootWrapper {...rootProps} />
}

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof AlertDialogPrimitive.Trigger>
type TriggerProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>

export const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { asChild = true, ...triggerProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const TriggerWrapper = isMobile ? Drawer.Trigger : AlertDialogPrimitive.Trigger
  return <TriggerWrapper asChild={asChild} {...triggerProps} ref={ref} />
})

Trigger.displayName = 'AlertTrigger'

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof AlertDialogPrimitive.Content>
type ContentProps = Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
  'onAnimationEnd'
> & {
  container?: ComponentProps<typeof AlertDialogPrimitive.Portal>['container']
  position?: 'absolute' | 'fixed'
}

export const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const isMobile = useMediaQuery('(max-width: 440px)')
  return isMobile ? (
    <DrawerContent {...props} ref={ref} />
  ) : (
    <AlertDialogContent {...props} ref={ref} />
  )
})

Content.displayName = 'AlertDialogContent'

// Theme wrapper component for portaled content
const AlertThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const setRef = (node: HTMLDivElement | null) => {
    wrapperRef.current = node
    // Apply theme immediately when ref is set
    if (node && theme) {
      applyThemeToElement(node, theme)
    }
  }

  // Apply theme to the wrapper when theme changes
  useEffect(() => {
    if (wrapperRef.current && theme) {
      applyThemeToElement(wrapperRef.current, theme)
    }
  }, [theme])

  return (
    <div ref={setRef} className="haiku-widget-theme-container">
      {children}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Portal
 * -----------------------------------------------------------------------------------------------*/

type PortalProps = {
  children: React.ReactNode
  container?: ComponentProps<typeof AlertDialogPrimitive.Portal>['container']
  position?: 'absolute' | 'fixed'
}

function AlertPortal({ children, position, container }: PortalProps) {
  if (position === 'fixed') {
    // Get the theme container to use as portal container
    // This ensures the portaled content stays within the theme context
    // Use a function to find the container at render time, not just once
    const getThemeContainer = () => {
      if (typeof document === 'undefined') return null
      // Find the root theme container (the one created by ThemeProvider)
      // We want the first one that's not inside another theme container
      const containers = document.querySelectorAll('.haiku-widget-theme-container')
      // Return the outermost container (usually the first one)
      return containers.length > 0 ? (containers[0] as HTMLElement) : null
    }
    
    const themeContainer = useMemo(() => getThemeContainer(), [])
    
    // Use the theme container if available, otherwise fall back to document.body
    const portalContainer = container || themeContainer || (typeof document !== 'undefined' ? document.body : null)
    
    return (
      <AlertDialogPrimitive.Portal container={portalContainer}>
        <AlertThemeWrapper>{children}</AlertThemeWrapper>
      </AlertDialogPrimitive.Portal>
    )
  }
  return children
}

const AlertDialogContent = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { className, position, container, ...contentProps } = props
  return (
    <AlertPortal container={container} position={position}>
      <AlertDialogPrimitive.Overlay
        className={cn(
          'inset-x-0 bottom-0 flex items-center justify-center',
          'data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide',
          position === 'fixed' ? 'fixed' : 'absolute',
        )}
      >
        <AlertDialogPrimitive.Content
          className={cn(
            'bg-bg-primary border border-border rounded-2xl max-h-[95vh] flex flex-col',
            'data-[state=open]:animate-dialogShow data-[state=closed]:animate-dialogHide',
            className,
          )}
          {...contentProps}
          ref={ref}
        />
      </AlertDialogPrimitive.Overlay>
    </AlertPortal>
  )
})

AlertDialogContent.displayName = 'AlertContent'

type DrawerContentElement = ElementRef<typeof Drawer.Content>
type DrawerContentProps = ComponentPropsWithoutRef<typeof Drawer.Content>

const DrawerContent = forwardRef<DrawerContentElement, DrawerContentProps>((props, ref) => {
  const { className, ...contentProps } = props
  
  // Get the theme container to use as portal container
  // This ensures the portaled content stays within the theme context
  // Use a function to find the container at render time
  const getThemeContainer = () => {
    if (typeof document === 'undefined') return null
    // Find the root theme container (the one created by ThemeProvider)
    const containers = document.querySelectorAll('.haiku-widget-theme-container')
    // Return the outermost container (usually the first one)
    return containers.length > 0 ? (containers[0] as HTMLElement) : null
  }
  
  const themeContainer = useMemo(() => getThemeContainer(), [])
  
  // Use the theme container if available, otherwise fall back to document.body
  const portalContainer = themeContainer || (typeof document !== 'undefined' ? document.body : null)
  
  return (
    <Drawer.Portal container={portalContainer}>
      <AlertThemeWrapper>
        <Drawer.Overlay className="fixed inset-0 bg-black/80" />
        <Drawer.Content
          className={cn(
            'bg-bg-primary flex flex-col rounded-t-[20px] h-[96%] fixed bottom-0 left-0 right-0 border border-border',
            className,
          )}
          {...contentProps}
          ref={ref}
        />
      </AlertThemeWrapper>
    </Drawer.Portal>
  )
})

DrawerContent.displayName = 'AlertContent'

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

type BodyElement = ElementRef<'div'>
type BodyProps = ComponentPropsWithoutRef<'div'>

export const Body = forwardRef<BodyElement, BodyProps>((props, ref) => {
  const { className, ...bodyProps } = props
  return <div className={cn('p-4 pb-0 flex flex-col gap-4', className)} {...bodyProps} ref={ref} />
})

Body.displayName = 'AlertBody'

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

type HeaderElement = ElementRef<'div'>
type HeaderProps = ComponentPropsWithoutRef<'div'> & {
  icon?: ReactNode
}

export const Header = forwardRef<HeaderElement, HeaderProps>((props, ref) => {
  const { className, children, ...headerProps } = props
  return (
    <div
      className={cn('p-4 border-b border-border flex flex-col', className)}
      {...headerProps}
      ref={ref}
    >
      {children}
    </div>
  )
})

Header.displayName = 'AlertHeader'

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

type FooterElement = ElementRef<'div'>
type FooterProps = ComponentPropsWithoutRef<'div'>

export const Footer = forwardRef<FooterElement, FooterProps>((props, ref) => {
  const { className, ...footerProps } = props
  return (
    <div
      className={cn('py-4 px-6 border-t border-border flex gap-3 [&>*]:flex-1', className)}
      {...footerProps}
      ref={ref}
    />
  )
})

Footer.displayName = 'AlertFooter'

/* -------------------------------------------------------------------------------------------------
 * Title
 * -----------------------------------------------------------------------------------------------*/

type TitleElement = ElementRef<typeof AlertDialogPrimitive.Title>
type TitleProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>

export const Title = forwardRef<TitleElement, TitleProps>((props, ref) => {
  const { className, ...titleProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const TitleWrapper = isMobile ? Drawer.Title : AlertDialogPrimitive.Title
  return (
    <TitleWrapper
      className={cn('text-foreground font-medium font-sans text-xl/6', className)}
      {...titleProps}
      ref={ref}
    />
  )
})

Title.displayName = 'AlertTitle'

/* -------------------------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------------------*/

type DescriptionElement = ElementRef<typeof AlertDialogPrimitive.Description>
type DescriptionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>

export const Description = forwardRef<DescriptionElement, DescriptionProps>((props, ref) => {
  const { className, ...descriptionProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const DescriptionWrapper = isMobile ? Drawer.Description : AlertDialogPrimitive.Description
  return (
    <DescriptionWrapper
      className={cn('text-muted-foreground text-xs', className)}
      {...descriptionProps}
      ref={ref}
    />
  )
})

Description.displayName = 'AlertDescription'

/* -------------------------------------------------------------------------------------------------
 * Cancel
 * -----------------------------------------------------------------------------------------------*/

type CancelElement = ElementRef<typeof AlertDialogPrimitive.Close>
type CancelProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close>

export const Cancel = forwardRef<CancelElement, CancelProps>((props, ref) => {
  const { asChild = true, ...cancelProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const CancelWrapper = isMobile ? Drawer.Close : AlertDialogPrimitive.Close
  return <CancelWrapper asChild={asChild} {...cancelProps} ref={ref} />
})

Cancel.displayName = 'AlertCancel'

/* -------------------------------------------------------------------------------------------------
 * Action
 * -----------------------------------------------------------------------------------------------*/

type ActionElement = ElementRef<typeof AlertDialogPrimitive.Close>
type ActionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Close>

export const Action = forwardRef<ActionElement, ActionProps>((props, ref) => {
  const { asChild = true, ...actionProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const ActionWrapper = isMobile ? Drawer.Close : AlertDialogPrimitive.Close
  return <ActionWrapper asChild={asChild} {...actionProps} ref={ref} />
})

Action.displayName = 'AlertAction'

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

type WarningElement = ElementRef<'div'>
type WarningProps = ComponentPropsWithoutRef<'div'> & {
  errorText?: boolean
  children: ReactNode
}

export const Warning = forwardRef<WarningElement, WarningProps>((props, ref) => {
  const { className, errorText, children, ...bodyProps } = props
  return (
    <div className={cn('flex-1', className)} {...bodyProps} ref={ref}>
      {errorText ? (
        <div className="flex flex-col items-center gap-2 bg-failed/10 rounded-xl p-3 text-failed">
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 bg-warning-bg/10 rounded-xl p-3 text-warning-text">
          <div className="flex items-center justify-start w-full gap-1">
            <InfoOutlineIcon className="w-5 cursor-pointer text-warning" />
            <span>Collateral Warning</span>
          </div>
          {children}
        </div>
      )}
    </div>
  )
})

Warning.displayName = 'Warning'

export const Error = forwardRef<WarningElement, WarningProps>((props, ref) => {
  const { className, errorText, children, ...bodyProps } = props
  return (
    <div className={cn('flex-1', className)} {...bodyProps} ref={ref}>
      {errorText ? (
        <div className="flex flex-col items-center gap-2 bg-failed/10 rounded-xl p-3 text-failed">
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 bg-failed/10 rounded-xl p-3 text-failed">
          {children}
        </div>
      )}
    </div>
  )
})

Error.displayName = 'Error'

export const AlertDialog = {
  Root,
  Trigger,
  Content,
  Header,
  Body,
  Footer,
  Title,
  Description,
  Action,
  Cancel,
  Warning,
  Error,
}
