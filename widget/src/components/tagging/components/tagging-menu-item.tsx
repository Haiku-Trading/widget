/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo, useMemo, useEffect, useRef } from 'react'
import { BeautifulMentionsMenuItemProps } from 'lexical-beautiful-mentions'
import { forwardRef } from 'react'
import { Avatar } from 'radix-ui'

import { cn } from '../../../utils'
import { getInitials } from '../../../utils/get-initials'
import { HoverCard } from 'radix-ui'
import { useTheme } from '../../../providers/theme-provider'
import { applyThemeToElement } from '../../../utils/theme-utils'
import TaggingMetadataContent from './tagging-metadata-content'
import { getChainIcon } from '../../../utils/chain-utils'
import { getProtocolIcon } from '../../../utils/protocol-utils'

// Theme wrapper component for HoverCard portaled content
const HoverCardWithTheme = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const themeContainer = useMemo(() => {
    return typeof document !== 'undefined' 
      ? document.querySelector('.haiku-widget-theme-container') as HTMLElement
      : null
  }, [])

  // Use callback ref to set both refs and apply theme
  const setRef = (node: HTMLDivElement | null) => {
    wrapperRef.current = node
    if (node) {
      applyThemeToElement(node, theme)
    }
  }

  // Apply theme to the wrapper when theme changes
  useEffect(() => {
    if (wrapperRef.current) {
      applyThemeToElement(wrapperRef.current, theme)
    }
  }, [theme])

  return (
    <HoverCard.Portal container={themeContainer}>
      <div ref={setRef} className="haiku-widget-theme-container">
        {children}
      </div>
    </HoverCard.Portal>
  )
}
// import TaggingMetadataContentComponent from '../metadata/TaggingMetadataContentComponent'

/* ----------------------------------------------------------------------------
 * ImageGroup
 * ---------------------------------------------------------------------------*/

type ImageGroupProps = {
  images: ImageObject[]
  branches: ImageObject[]
}

type ImageObject = {
  src?: string
  symbol: string
  color?: string
}

const ImageGroup = memo(({ branches, images }: ImageGroupProps) => {
  // Pre-filter valid branches to avoid runtime checks
  const validBranches = branches.slice(0, 2)

  return (
    <div className="bg-bg-surface border border-stroke-grey-primary rounded-full">
      {images.map((image, index) => {
        const isLastItem = index === images.length - 1
        const zIndex = images.length - index

        return (
          <Avatar.Root
            key={`${image.symbol}-${index}`}
            className="block relative size-8 rounded-full"
            style={{
              zIndex,
              backgroundColor: image.color ?? 'hsl(var(--bg-section) / 0.24)',
            }}
          >
            <Avatar.Image src={image.src} alt={image.symbol} className="rounded-full" />
            <Avatar.Fallback className="text-sm text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {getInitials(image.symbol)}
            </Avatar.Fallback>

            {/* Only render branches on last item and if branches exist */}
            {isLastItem &&
              validBranches.map((branch, branchIndex) => (
                <ImageBranch
                  key={`${branch.symbol}-${branchIndex}`}
                  index={branchIndex}
                  branch={branch}
                />
              ))}
          </Avatar.Root>
        )
      })}
    </div>
  )
})

ImageGroup.displayName = 'ImageGroup'

/* ----------------------------------------------------------------------------
 * ImageBranch
 * ---------------------------------------------------------------------------*/

type ImageBranchProps = {
  index: number
  branch: ImageObject
}

const ImageBranch = memo(({ index, branch }: ImageBranchProps) => {
  // Pre-calculate position to avoid runtime conditionals
  const position = index === 0 ? '-bottom-1.5 -right-1.5' : '-top-1.5 -right-1.5'

  // Determine if this is a chain or protocol icon based on the symbol
  const isChainIcon = !isNaN(Number(branch.symbol))

  return (
    <div
      className={cn('absolute block text-[0.625rem] size-5 rounded-full bg-secondary flex items-center justify-center', position)}
    >
      {isChainIcon ? (
        getChainIcon(branch.symbol, 'w-full h-full', 20) || (
          <div className="w-full h-full flex items-center justify-center text-[8px]">
            {getInitials(branch.symbol)}
          </div>
        )
      ) : (
        getProtocolIcon(branch.symbol, 'w-full h-full', 20) || (
          <div className="w-full h-full flex items-center justify-center text-[8px]">
            {getInitials(branch.symbol)}
          </div>
        )
      )}
    </div>
  )
})

ImageBranch.displayName = 'ImageBranch'

const TaggingMenuItem = memo(
  forwardRef<HTMLLIElement, BeautifulMentionsMenuItemProps>(
    ({ selected, item, itemValue, ...props }, ref) => {
      // Memoize expensive data parsing and creation before early return
      const imageData = useMemo(
        () => ({
          images: [
            {
              src: item?.data?.imageUrl || '',
              symbol: itemValue,
              color: undefined,
            },
          ],
          branches: JSON.parse(item?.data?.branches ?? '[]'),
        }),
        [item?.data?.imageUrl, item?.data?.branches, itemValue],
      )

      // Early return if no item
      if (!item) {
        return null
      }
      const { data } = item
      const displayText = itemValue.length > 20 ? `${itemValue.slice(0, 20)}...` : itemValue

      return (
        <li
          ref={ref}
          {...props}
          className="w-full px-1 relative flex flex-col cursor-pointer justify-center items-start bg-bg-surface"
        >
          <HoverCard.Root>
            <HoverCard.Trigger className="w-full">
              {data?.isFirst && (
                <div className="w-full text-xs py-2 opacity-50 flex justify-start items-center">
                  {data.type}
                </div>
              )}

              {/* Menu item content */}
              <div
                className={cn(
                  'w-full relative flex cursor-pointer justify-center items-start bg-bg-surface rounded-md px-2 py-2',
                  selected && 'bg-background border border-stroke-grey-primary',
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <ImageGroup images={imageData.images} branches={imageData.branches} />
                  <div className="flex-1 flex flex-col">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-sm truncate">{displayText}</span>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCard.Trigger>
            <HoverCardWithTheme>
              <HoverCard.Content className="z-50" side={'right'} align="start" sideOffset={0}>
                <TaggingMetadataContent
                  value={displayText}
                  images={imageData.images}
                  branches={imageData.branches}
                  type={data.type}
                  metadata={JSON.parse(data.metadata) || '{}'}
                />
                <HoverCard.Arrow className="fill-section h-[6px] w-3" />
              </HoverCard.Content>
            </HoverCardWithTheme>
          </HoverCard.Root>
        </li>
      )
    },
  ),
)

TaggingMenuItem.displayName = 'TaggingMenuItem'

export default TaggingMenuItem
