import { cn } from '../utils'
import { useControllableState } from '@radix-ui/react-use-controllable-state'
import { Slider } from 'radix-ui'
import { ComponentProps } from 'react'
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipArrow } from './tooltip/tooltip'

type SliderRootProps = ComponentProps<typeof Slider.Root>
type SliderRatingProps = SliderRootProps

export function SliderPercentage(props: SliderRatingProps) {
  const { className, value: valueProp, defaultValue, onValueChange, disabled, ...rootProps } = props

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  })

  return (
    <div>
      <Slider.Root
        className={cn('relative flex items-center select-none touch-none w-full', className)}
        {...rootProps}
        onValueChange={setValue}
        value={value}
      >
        <Slider.Track className="h-2 bg-[#B1B5C3] relative grow rounded-full">
          <Slider.Range className={cn('absolute bg-[#777E91] rounded-full h-full')} />
        </Slider.Track>
        <TooltipRoot delayDuration={0}>
          <TooltipTrigger asChild>
            <Slider.Thumb
              aria-label="Percentage"
              className={cn(
                'block size-4 bg-white rounded-full focus:outline-none cursor-grab active:cursor-grabbing border-4 border-[#777E91]',
                disabled && 'cursor-default active:cursor-default',
              )}
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={4}
            onPointerDownOutside={(event) => event.preventDefault()}
            className={cn(
              'py-1 px-[5px] bg-secondary border border-tertiary rounded-md text-sm font-medium text-muted-foreground',
              'data-[state=delayed-open]:data-[side=bottom]:animate-slide-from-top data-[state=delayed-open]:data-[side=left]:animate-slide-from-right data-[state=delayed-open]:data-[side=right]:animate-slide-from-left data-[state=delayed-open]:data-[side=top]:animate-slide-from-bottom',
            )}
          >
            {value && value[0]}%
            <TooltipArrow className="fill-tertiary" />
          </TooltipContent>
        </TooltipRoot>
      </Slider.Root>
      <div className="w-full flex items-center justify-between pt-2">
        {[0, 25, 50, 75, 100].map((percentage) => (
          <button
            key={percentage}
            className={cn('text-[10px] text-filled font-medium', disabled && 'cursor-default')}
            onClick={() => setValue([percentage])}
          >
            {percentage}%
          </button>
        ))}
      </div>
    </div>
  )
}
