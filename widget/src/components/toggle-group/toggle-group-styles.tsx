import { tv } from 'tailwind-variants'

export const toggleItemStyles = tv(
  {
    base: 'cursor-pointer rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed',
    variants: {
      variant: {
        filled:
          'bg-filled hover:bg-filled/75 p-2 font-medium data-[state=on]:bg-primary min-w-8 text-xs font-medium h-7 data-[state=on]:hover:bg-primary/75 text-foreground data-[state=on]:text-primary-foreground',
        outlined:
          'ring-1 border border-transparent ring-stroke-grey-primary data-[state=on]:border data-[state=on]:border-warning px-3 w-fit bg-bg-section data-[state=on]:bg-warning-bg rounded-lg data-[state=on]:ring-0 text-foreground',
      },
      size: {
        sm: 'text-sm',
        xs: 'text-xs',
      },
    },
    defaultVariants: {
      variant: 'outlined',
      size: 'sm',
    },
  },
  { responsiveVariants: true },
)
