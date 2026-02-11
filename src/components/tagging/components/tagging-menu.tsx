import React from 'react'
import { BeautifulMentionsMenuProps } from 'lexical-beautiful-mentions'

const TaggingMenu: React.FC<BeautifulMentionsMenuProps> = React.memo(
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
  (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    // Only re-render if specific props that affect the UI have changed
    const keysToCompare = ['children', 'className', 'style']

    for (const key of keysToCompare) {
      if (
        prevProps[key as keyof BeautifulMentionsMenuProps] !==
        nextProps[key as keyof BeautifulMentionsMenuProps]
      ) {
        return false
      }
    }

    // If children arrays are different lengths, re-render
    if (React.Children.count(prevProps.children) !== React.Children.count(nextProps.children)) {
      return false
    }

    return true // Don't re-render
  },
)

TaggingMenu.displayName = 'TaggingMenu'

export default TaggingMenu
