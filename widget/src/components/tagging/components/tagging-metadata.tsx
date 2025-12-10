import { BeautifulMentionComponentProps } from 'lexical-beautiful-mentions'
import { HoverCard } from 'radix-ui'
import { forwardRef, useEffect, useRef } from 'react'
import { useTheme } from '../../../providers/theme-provider'
import { applyThemeToElement } from '../../../utils/theme-utils'
import TaggingMetadataContent from './tagging-metadata-content'

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
        <HoverCard.Portal>
          <HoverCardContentWithTheme>
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
          </HoverCardContentWithTheme>
        </HoverCard.Portal>
      </HoverCard.Root>
    )
  },
)

TaggingMetadata.displayName = 'TaggingMetadata'

// Theme wrapper for HoverCard content to apply theme styles
const HoverCardContentWithTheme = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Apply theme to wrapper when theme changes or on mount
  useEffect(() => {
    const element = wrapperRef.current
    if (element) {
      applyThemeToElement(element, theme)
    }
  }, [theme])

  return (
    <div ref={wrapperRef} className="haiku-widget-theme-container">
      {children}
    </div>
  )
}

export default TaggingMetadata
