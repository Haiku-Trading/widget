import { tv } from 'tailwind-variants'

export const badgeStyles = tv({
  base: 'rounded-3xl w-max px-2 py-[3px] text-xs leading-none flex items-center justify-center',
  variants: {
    variant: {
      primary: 'bg-[#B1B5C3] text-white',
      success: 'bg-[#23BA9726] text-[#23BA97]',
      failed: 'bg-[#FB37481A] text-[#FB3748]',
      info: 'bg-bg-surface text-grey-primary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})
