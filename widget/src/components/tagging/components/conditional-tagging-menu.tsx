import React, { useState, useEffect } from 'react'
import { BeautifulMentionsMenuProps } from 'lexical-beautiful-mentions'

// A conditional menu component that only renders when needed
const ConditionalTaggingMenu: React.FC<BeautifulMentionsMenuProps> = React.memo(
  ({ children, ...data }) => {
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
      // Only render if there are actually children (menu items) to show
      const hasChildren = React.Children.count(children) > 0
      if (hasChildren !== shouldRender) {
        setShouldRender(hasChildren)
      }
    }, [children, shouldRender])

    // Don't render the menu container if there are no items
    if (!shouldRender) {
      return null
    }

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
      >
        {children}
      </ul>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if children count changes
    const prevChildrenCount = React.Children.count(prevProps.children)
    const nextChildrenCount = React.Children.count(nextProps.children)

    return prevChildrenCount === nextChildrenCount
  },
)

ConditionalTaggingMenu.displayName = 'ConditionalTaggingMenu'

export default ConditionalTaggingMenu
