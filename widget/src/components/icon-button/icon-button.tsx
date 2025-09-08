import React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { iconButtonStyles } from './variants'
import { VariantProps } from 'tailwind-variants'

/* -----------------------------------------------------------------------------
 * IconButton Types
 * ---------------------------------------------------------------------------*/

type IconButtonElements = React.ElementRef<'button'>
type IconButtonPrimitiveProps = React.ComponentPropsWithoutRef<'button'>
type IconButtonVariants = VariantProps<typeof iconButtonStyles>

interface IconButtonProps extends IconButtonPrimitiveProps, IconButtonVariants {
  asChild?: boolean
}

/* ----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/

const IconButton = React.forwardRef<IconButtonElements, IconButtonProps>((props, ref) => {
  const { asChild = false, variant, className, size, shape, ...iconButtonProps } = props

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      className={iconButtonStyles({ variant, size, shape, className })}
      ref={ref}
      {...iconButtonProps}
    />
  )
})

IconButton.displayName = 'IconButton'

/* ----------------------------------------------------------------------------
 * Export
 * ---------------------------------------------------------------------------*/

export { IconButton }
