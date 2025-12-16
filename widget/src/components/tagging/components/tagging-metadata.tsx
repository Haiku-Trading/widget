import { BeautifulMentionComponentProps } from 'lexical-beautiful-mentions'
import { HoverCard } from 'radix-ui'
import React, { forwardRef, useEffect, useMemo, useRef } from 'react'
import { useTheme } from '../../../providers/theme-provider'
import { applyThemeToElement } from '../../../utils/theme-utils'
import TaggingMetadataContent from './tagging-metadata-content'

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

const TaggingMetadata = forwardRef<HTMLSpanElement, BeautifulMentionComponentProps<{ id: string }>>(
  ({ value, data, ...other }, ref) => {
    const images = [
      {
        src: data?.imageUrl || '',
        symbol: value,
        color: undefined,
      },
    ]
    const branches = JSON.parse(data.branches ?? '[]')

    return (
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <span
            {...other}
            ref={ref}
            className="p-[2px] bg-[#CFCFCF] dark:bg-[#4F4F4F] rounded-[4px]"
          >
            {value}
          </span>
        </HoverCard.Trigger>
        <HoverCardWithTheme>
          <HoverCard.Content className="z-50" side={'right'} align="start" sideOffset={0}>
            <TaggingMetadataContent
              value={value}
              images={images}
              branches={branches}
              type={data.type}
              metadata={JSON.parse(data.metadata) || '{}'}
            />
            <HoverCard.Arrow className="fill-section h-[6px] w-3" />
          </HoverCard.Content>
        </HoverCardWithTheme>
      </HoverCard.Root>
    )
  },
)

TaggingMetadata.displayName = 'TaggingMetadata'

export default TaggingMetadata
