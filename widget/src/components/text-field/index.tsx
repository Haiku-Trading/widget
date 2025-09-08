import { forwardRef } from 'react'
import { cn } from '../../utils'

interface TextFieldProps extends React.ComponentPropsWithoutRef<'input'> {
  containerClassName?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  leftIconAction?: () => void
  rightIconAction?: () => void
  feedback?: 'warning' | 'success' | 'error' | 'info' | 'default'
  feedbackMessage?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const {
    type = 'text',
    feedback = 'default',
    feedbackMessage,
    leftIcon,
    leftIconAction,
    rightIcon,
    rightIconAction,
    containerClassName,
    className,
    ...inputProps
  } = props
  return (
    <>
      <div
        className={cn(
          'border border-border bg-white rounded-lg overflow-hidden w-auto flex items-center',
          containerClassName,
          feedback === 'error' && 'border-failed',
          feedback === 'success' && 'border-success',
          feedback === 'info' && 'border-info',
          feedback === 'warning' && 'border-warning-text',
        )}
      >
        {leftIcon && (
          <button onClick={leftIconAction} className="pl-2">
            {leftIcon}
          </button>
        )}
        <input
          className={cn(
            'p-2 m-0 placeholder:text-grey-secondary outline-none w-full text-foreground text-sm',
            className,
          )}
          ref={ref}
          type={type}
          {...inputProps}
        />
        {rightIcon && (
          <button onClick={rightIconAction} className="pr-2">
            {rightIcon}
          </button>
        )}
      </div>
      {feedbackMessage && (
        <span
          className={cn(
            'text-xs text-muted-foreground',
            feedback === 'error' && 'text-failed',
            feedback === 'success' && 'text-success',
            feedback === 'info' && 'text-info',
            feedback === 'warning' && 'text-warning-text',
          )}
        >
          {feedbackMessage}
        </span>
      )}
    </>
  )
})

TextField.displayName = 'TextField'
