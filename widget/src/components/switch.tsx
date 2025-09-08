import { ComponentRef, forwardRef } from 'react'
import { Switch as RadixSwitch } from 'radix-ui'
import { cn } from '../utils'

type SwitchElement = ComponentRef<typeof RadixSwitch.Root>
type SwitchSize = 'small' | 'medium'
type SwitchProps = RadixSwitch.SwitchProps & {
  size?: SwitchSize
}

const switchSizeMap = {
  small: {
    width: '19.6px',
    height: '11.2px',
    thumbSize: 'size-[8.4px]',
    checkedTranslateX: 'data-[state=checked]:translate-x-[10px]',
  },
  medium: {
    width: '39.2px',
    height: '22.4px',
    thumbSize: 'size-[16.8px]',
    checkedTranslateX: 'data-[state=checked]:translate-x-[20px]',
  },
}

export const Switch = forwardRef<SwitchElement, SwitchProps>((props, ref) => {
  const { className, size = 'small', ...rootProps } = props

  return (
    <RadixSwitch.Root
      ref={ref}
      {...rootProps}
      className={cn(
        'relative cursor-pointer rounded-full bg-bg-section data-[state=checked]:bg-primary outline-none',
        className,
      )}
      style={{
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        ...rootProps.style,
        ...switchSizeMap[size],
      }}
    >
      <RadixSwitch.Thumb
        className={cn(
          'block translate-x-0.5 rounded-full border-[3px] border-white transition-transform duration-100 will-change-transform bg-white',
          switchSizeMap[size].checkedTranslateX,
          switchSizeMap[size].thumbSize,
        )}
      />
    </RadixSwitch.Root>
  )
})

Switch.displayName = 'Switch'
