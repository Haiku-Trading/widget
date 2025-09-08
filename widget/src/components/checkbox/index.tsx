import { Checkbox as CheckboxRadix } from 'radix-ui'
import { forwardRef, useId } from 'react'
import { cn } from '../../utils'
import CheckIcon from './../../icons/check.svg'
import DividerIcon from './../../icons/divider.svg'

type CheckboxRef = React.ElementRef<typeof CheckboxRadix.Root>
type CheckboxElement = React.ComponentPropsWithoutRef<typeof CheckboxRadix.Root>

type CheckboxProps = CheckboxElement & {
  label: JSX.Element | string | null
  labelClassName?: string
}

const ROOT_NAME = 'Checkbox'

const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(
  ({ className, id: idProps, label, labelClassName, checked, ...props }, ref) => {
    const id = useId()

    return (
      <div className="flex items-center justify-between gap-3 p-2 ">
        <label
          htmlFor={id ?? idProps}
          className={cn(
            'text-xs text-grey-primary font-medium leading-none cursor-pointer',
            labelClassName,
          )}
        >
          {label}
        </label>
        <CheckboxRadix.Root
          ref={ref}
          className={cn(
            'flex size-3 appearance-none items-center justify-center rounded bg-bg-section outline-none focus-visible:outline-none',
            'border border-stroke-grey-secondary',
            'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
            'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
            className,
          )}
          id={id ?? idProps}
          checked={checked}
          {...props}
        >
          <CheckboxRadix.Indicator>
            {checked === 'indeterminate' && <DividerIcon className="text-white" />}
            {checked === true && <CheckIcon className="size-2 text-white" />}
          </CheckboxRadix.Indicator>
        </CheckboxRadix.Root>
      </div>
    )
  },
)

Checkbox.displayName = ROOT_NAME

export { Checkbox }
