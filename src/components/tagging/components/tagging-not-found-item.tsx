import React from 'react'
import { cn } from '../../../utils'

const NotFoundItemComponent = React.memo(() => {
  return (
    <div className="w-[326px] h-max absolute top-0 left-8 p-[8px] rounded-[6px] bg-bg-surface border border-stroke-grey-primary">
      <div
        className={cn(
          'w-full relative cursor-pointer flex justify-start items-center gap-1 rounded-[6px] p-[8px] bg-background border border-stroke-grey-primary',
        )}
      >
        No results found <span className="opacity-55">Dismiss</span>
      </div>
    </div>
  )
})

NotFoundItemComponent.displayName = 'NotFoundItemComponent'

export default NotFoundItemComponent
