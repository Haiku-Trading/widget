import { categoriesOrigNames } from '../../constants/constants'
import { cn } from '../../utils'
import { ChevronDownIcon } from '../icons'
import { useEffect, useRef, useState } from 'react'

type CategorySelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  availableCategories?: string[]
}

export function MobileCategorySelect({ value, onValueChange, availableCategories = [] }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get all available categories including pendle
  const allCategories = [
    ...availableCategories.filter((cat) => categoriesOrigNames[cat] && cat !== 'varDebt'),
    'pendle',
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSelect = (category: string) => {
    const isSelected = value.includes(category)
    if (category === 'all') {
      // If "all" is selected, clear everything else
      onValueChange(['all'])
    } else {
      // Remove "all" if it exists when selecting a specific category
      let newValue = value.filter((v) => v !== 'all')
      
      if (isSelected) {
        // Remove the category
        newValue = newValue.filter((v) => v !== category)
        // If nothing selected, default to "all"
        if (newValue.length === 0) {
          newValue = ['all']
        }
      } else {
        // Add the category
        newValue = [...newValue, category]
      }
      
      onValueChange(newValue)
    }
    setIsOpen(false)
  }

  const getDisplayText = () => {
    if (value.includes('all') || value.length === 0) {
      return 'All Primitives'
    }
    if (value.length === 1) {
      const category = value[0]
      if (category === 'pendle') return 'YT/PT'
      return categoriesOrigNames[category] || category
    }
    return `${value.length} selected`
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-max items-center justify-between p-2 flex gap-1 rounded-lg bg-bg-section text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-surface duration-150"
      >
        <div className="w-max flex gap-2 items-center justify-center">
          <span className="text-foreground">{getDisplayText()}</span>
          <div className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : '')}>
            <ChevronDownIcon />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'bg-bg-surface border border-stroke-grey-primary rounded-lg',
              'w-[200px]',
              'max-h-[300px]',
              'max-md:fixed max-md:inset-x-4 max-md:top-[45%] max-md:-translate-y-1/2',
              'max-md:max-h-[70vh]',
            )}
            style={{
              boxShadow: '0px 4px 20.6px 0px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              className={cn(
                'p-2 flex flex-col gap-1',
                'max-h-[300px] overflow-y-auto',
                'max-md:max-h-[60vh]',
              )}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              {/* All Primitives Option */}
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={cn(
                  'p-3 text-sm text-left rounded-lg transition-colors text-foreground',
                  'hover:bg-bg-section active:bg-bg-section',
                  'min-h-[44px] flex items-center gap-2',
                  value.includes('all') || value.length === 0 ? 'bg-bg-section' : '',
                )}
              >
                <span className="text-foreground">All Primitives</span>
                {(value.includes('all') || value.length === 0) && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>

              {/* Category Options */}
              {allCategories.map((category) => {
                const isSelected = value.includes(category)
                const displayName = category === 'pendle' ? 'YT/PT' : categoriesOrigNames[category] || category
                
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleSelect(category)}
                    className={cn(
                      'p-3 text-sm text-left rounded-lg transition-colors text-foreground',
                      'hover:bg-bg-section active:bg-bg-section',
                      'min-h-[44px] flex items-center gap-2',
                      isSelected ? 'bg-bg-section' : '',
                    )}
                  >
                    <span className="text-foreground capitalize">{displayName}</span>
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

