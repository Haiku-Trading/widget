import React, { ReactNode } from 'react'
import { PopoverRoot, Content as PopoverContent, Trigger as PopoverTrigger } from './popover/index'

type PopupProps = {
  content: ReactNode
  children: ReactNode
}
export function Popup({ content, children }: PopupProps) {
  return (
    <PopoverRoot>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="max-w-[272px] bg-section rounded-xl text-muted-foreground p-3 text-xs z-[100]">
        {content}
      </PopoverContent>
    </PopoverRoot>
  )
}
