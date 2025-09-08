import React from 'react'

import { Slot, Slottable } from '@radix-ui/react-slot'
import { buttonStyles } from './variants'
import { VariantProps } from 'tailwind-variants'
import AlertIcon from '../../icons/alert.svg'
import { cn } from '../../utils'

/* -----------------------------------------------------------------------------
 * Button Types
 * ---------------------------------------------------------------------------*/

type ButtonElements = React.ElementRef<'button'>
type ButtonPrimitiveProps = React.ComponentPropsWithoutRef<'button'>
type ButtonVariants = VariantProps<typeof buttonStyles>

interface ButtonProps extends ButtonPrimitiveProps, ButtonVariants {
  asChild?: boolean
  alert?: boolean
}

/* ----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/

const Button = React.forwardRef<ButtonElements, ButtonProps>((props, ref) => {
  const {
    asChild = false,
    alert = false,
    variant,
    className,
    size,
    children,
    type = 'button',
    ...buttonProps
  } = props

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      type={type}
      className={buttonStyles({ variant, size, className })}
      ref={ref}
      {...buttonProps}
    >
      {alert && (
        <AlertIcon
          className={cn(
            'size-5',
            variant === 'failure'
              ? 'text-failed'
              : variant === 'warning'
                ? 'text-warning-text'
                : '',
          )}
        />
      )}
      <Slottable>{children}</Slottable>
    </Comp>
  )
})

Button.displayName = 'Button'

/* ----------------------------------------------------------------------------
 * Export
 * ---------------------------------------------------------------------------*/

export { Button }
