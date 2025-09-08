import { ToggleGroup as Toggle } from 'radix-ui'
import { cn } from '../../utils'
import { ComponentProps, ElementRef, forwardRef } from 'react'
import { toggleItemStyles } from './toggle-group-styles'
import { type VariantProps } from 'tailwind-variants'

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type RootElement = ElementRef<typeof Toggle.Root>
type RootProps = ComponentProps<typeof Toggle.Root>

export const Root = forwardRef<RootElement, RootProps>((props, ref) => {
  const { children, className, ...rootProps } = props
  return (
    <Toggle.Root
      className={cn('flex w-full min-h-16 items-center gap-2', className)}
      {...rootProps}
      ref={ref}
    >
      {children}
    </Toggle.Root>
  )
})

Root.displayName = 'ToggleGroupRoot'

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

type ItemVariants = VariantProps<typeof toggleItemStyles>

type ItemElement = ElementRef<typeof Toggle.Item>
type ItemProps = ComponentProps<typeof Toggle.Item> & {
  variant?: ItemVariants['variant']
  size?: ItemVariants['size']
}

export const Item = forwardRef<ItemElement, ItemProps>((props, ref) => {
  const { variant, size, className, children, ...itemProps } = props

  return (
    <Toggle.Item
      className={toggleItemStyles({ variant, size, className })}
      {...itemProps}
      ref={ref}
    >
      {children}
    </Toggle.Item>
  )
})

Item.displayName = 'ToggleGroupItem'

export const ToggleGroup = {
  Root,
  Item,
}
