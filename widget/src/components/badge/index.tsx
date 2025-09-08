import * as React from 'react'
import { VariantProps } from 'tailwind-variants'
import { badgeStyles } from './badge-styles'
import { cn } from '../../utils'

type BadgeVariants = VariantProps<typeof badgeStyles>

type BadgeElement = React.ElementRef<'div'>
type BadgeProps = React.ComponentPropsWithoutRef<'div'> & {
  variant?: BadgeVariants['variant']
  disabled?: boolean
}

const Badge = React.forwardRef<BadgeElement, BadgeProps>((props, ref) => {
  const { className, variant, disabled = false, ...badgeProps } = props

  return (
    <div
      className={cn(badgeStyles({ className, variant }), {
        'opacity-55 pointer-events-none': disabled,
      })}
      ref={ref}
      {...badgeProps}
    />
  )
})

Badge.displayName = 'Badge'

export { Badge }
