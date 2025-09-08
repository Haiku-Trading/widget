import { tv } from 'tailwind-variants'

export const iconButtonStyles = tv(
  {
    base: 'cursor-pointer flex flex-shrink-0 p-0.5 justify-center items-center duration-200 ease-out disabled:cursor-default disabled:opacity-50',
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:opacity-75',
        secondary: 'bg-secondary text-foreground border border-border hover:bg-background',
        outline: 'bg-transparent border border-border text-muted-foreground hover:bg-background',
      },
      size: {
        sm: 'h-7 w-7',
        md: 'h-9 w-9',
        lg: 'h-10 w-10',
      },
      shape: {
        square: 'rounded-lg',
        circle: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'square',
    },
  },
  { responsiveVariants: true },
)
