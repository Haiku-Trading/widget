import * as React from 'react'
import { VariantProps } from 'tailwind-variants'
import { cardStyles } from './card-styles'
import { Slot } from '@radix-ui/react-slot'

type CardVariants = VariantProps<typeof cardStyles>

type CardElement = React.ElementRef<'div'>
type CardProps = React.ComponentPropsWithoutRef<'div'> & {
  variant?: CardVariants['variant']
  asChild?: boolean
}

export const Card = React.forwardRef<CardElement, CardProps>((props, ref) => {
  const { variant, asChild, className, ...cardProps } = props
  const Comp = asChild ? Slot : 'div'

  return <Comp className={cardStyles({ className, variant })} ref={ref} {...cardProps} />
})

Card.displayName = 'Card'
