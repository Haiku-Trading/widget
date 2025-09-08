import React, { ComponentProps, ComponentRef } from 'react'
import { Accordion as RadixAccordion } from 'radix-ui'
import ChevronDown from '../../icons/chevron-down.svg'
import { cn } from '../../utils'

/* -----------------------------------------------------------------------------
 * AccordionItem
 * ----------------------------------------------------------------------------*/

type AccordionItemElement = ComponentRef<typeof RadixAccordion.Item>
type AccordionItemProps = ComponentProps<typeof RadixAccordion.Item>

export const AccordionItem = React.forwardRef<AccordionItemElement, AccordionItemProps>(
  ({ children, className, disabled, ...props }, ref) => (
    <RadixAccordion.Item
      className={cn(
        'bg-secondary border border-border rounded-2xl',
        disabled && 'bg-hover border-[#D6DBDC] text-muted',
        className,
      )}
      disabled={disabled}
      {...props}
      ref={ref}
    >
      {children}
    </RadixAccordion.Item>
  ),
)

AccordionItem.displayName = 'AccordionItem'

/* -----------------------------------------------------------------------------
 * AccordionTrigger
 * ----------------------------------------------------------------------------*/

type AccordionTriggerElement = ComponentRef<typeof RadixAccordion.Trigger>
type AccordionTriggerProps = ComponentProps<typeof RadixAccordion.Trigger>

export const AccordionTrigger = React.forwardRef<AccordionTriggerElement, AccordionTriggerProps>(
  ({ children, className, ...props }, ref) => (
    <RadixAccordion.Header className="flex p-4">
      <RadixAccordion.Trigger
        className={cn('group font-medium flex justify-between w-full', className)}
        {...props}
        ref={ref}
      >
        <div className="flex gap-2 items-center">{children}</div>
        <span className="size-6 group-data-[disabled]:hidden">
          <ChevronDown />
        </span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  ),
)

AccordionTrigger.displayName = 'AccordionTrigger'

/* -----------------------------------------------------------------------------
 * AccordionContent
 * ----------------------------------------------------------------------------*/

type AccordionContentElement = ComponentRef<typeof RadixAccordion.Content>
type AccordionContentProps = ComponentProps<typeof RadixAccordion.Content>

export const AccordionContent = React.forwardRef<AccordionContentElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => (
    <RadixAccordion.Content
      className={cn(
        'overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up',
      )}
      {...props}
      ref={ref}
    >
      <div className={cn('p-4', className)}>{children}</div>
    </RadixAccordion.Content>
  ),
)

AccordionContent.displayName = 'AccordionContent'

const AccordionRoot = RadixAccordion.Root

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}
