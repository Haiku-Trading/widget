import { tv } from 'tailwind-variants'

export const cardStyles = tv({
  base: 'p-3 rounded-xl',
  variants: {
    variant: {
      primary: 'border border-border bg-background',
      secondary: 'border border-border bg-bg-surface',
    },
  },
  defaultVariants: {
    variant: 'primary'
  },
})
