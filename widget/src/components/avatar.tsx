import { cn } from '../utils'
import { Avatar as PrimitiveAvatar } from 'radix-ui'
import { forwardRef } from 'react'

type AvatarElement = React.ElementRef<'div'>
export type AvatarProps = {
  src?: string
  alt: string
  fallbackName?: string
  color?: string
  rootClassName?: string
}

export const Avatar = forwardRef<AvatarElement, AvatarProps>(
  ({ alt, src, color, fallbackName, rootClassName, ...props }, ref) => {
    return (
      <div className="flex gap-5" {...props} ref={ref}>
        <PrimitiveAvatar.Root
          className={cn(
            'inline-flex size-[38px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle',
            rootClassName,
          )}
        >
          <PrimitiveAvatar.Image
            className="size-full rounded-[inherit] object-cover"
            src={src}
            alt={alt}
          />
          <PrimitiveAvatar.Fallback
            className="bg-gray-200 leading-1 flex size-full items-center justify-center text-[9px] font-medium rounded-full"
            delayMs={600}
            style={{ backgroundColor: color }}
          >
            {fallbackName}
          </PrimitiveAvatar.Fallback>
        </PrimitiveAvatar.Root>
      </div>
    )
  },
)

Avatar.displayName = 'Avatar'
