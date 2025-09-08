import React from 'react'
import { BeautifulMentionsMenuProps } from 'lexical-beautiful-mentions'

// A completely static menu component that never re-renders
const StaticTaggingMenu: React.FC<BeautifulMentionsMenuProps> = React.memo(
  ({ ...data }) => {
    return (
      <ul
        style={{
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        className="w-[326px] max-h-[300px] absolute bottom-10 left-8 pl-[4px] rounded-[6px] bg-bg-surface border border-stroke-grey-primary"
        {...data}
        id="mentions-menu"
      />
    )
  },
  () => true, // Always return true to prevent re-renders
)

StaticTaggingMenu.displayName = 'StaticTaggingMenu'

export default StaticTaggingMenu
