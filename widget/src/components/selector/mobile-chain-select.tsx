import { ChevronDownIcon } from '../icons'
import { cn } from '../../utils'
import { useEffect, useRef, useState } from 'react'
import { useConfig } from 'wagmi'
import { getChainIcon } from '../../utils/chain-utils'
import { useConfig as useWidgetConfig } from '../../providers/config-provider'

type ChainSelectProps = {
  value: string
  onValueChange: (value: string) => void
  onValueProtocolChange: (value: string[]) => void
}

export function MobileChainSelect({
  value,
  onValueChange,
  onValueProtocolChange,
}: ChainSelectProps) {
  const config = useConfig()
  const { config: widgetConfig } = useWidgetConfig()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const nameChain = config.chains.find((val) => val.id.toString() === value)?.name

  // Filter out hidden chains
  const filteredChains = config.chains.filter((chain) => {
    if (widgetConfig.hiddenChains?.includes(chain.id)) {
      return false
    }
    return true
  })

  // Закрытие по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Предотвращаем прокрутку страницы когда меню открыто на мобильных
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    onValueProtocolChange([''])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-max items-center justify-between p-2 flex gap-1 rounded-lg bg-bg-section text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-surface duration-150"
      >
        <div className="flex items-center justify-center">
          {value === 'all-chains' ? (
            <div className="flex gap-2">
              <div className="grid grid-cols-2 gap-0 w-5 h-5">
                {getChainIcon('1', 'w-2.5 h-2.5')}
                {getChainIcon('80094', 'w-2.5 h-2.5')}
                {getChainIcon('56', 'w-2.5 h-2.5')}
                {getChainIcon('8453', 'w-2.5 h-2.5')}
              </div>
              <span className="text-foreground">All chain</span>
            </div>
          ) : (
            <div className="flex gap-2">
              {getChainIcon(value, 'w-5 h-5')}
              <span className="text-sm text-foreground">{nameChain}</span>
            </div>
          )}
        </div>

        <div className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : '')}>
          <ChevronDownIcon />
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
              'absolute left-0 top-full mt-2 z-50',
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
              {/* All Chains Option */}
              <button
                type="button"
                onClick={() => handleSelect('all-chains')}
                className={cn(
                  'p-3 text-sm text-left rounded-lg transition-colors text-foreground',
                  'hover:bg-bg-section active:bg-bg-section',
                  'min-h-[44px] flex gap-2 items-center',
                  value === 'all-chains' ? 'bg-bg-section' : '',
                )}
              >
                <div className="grid grid-cols-2 gap-0 w-5 h-5">
                  {getChainIcon('1', 'w-2.5 h-2.5')}
                  {getChainIcon('80094', 'w-2.5 h-2.5')}
                  {getChainIcon('56', 'w-2.5 h-2.5')}
                  {getChainIcon('8453', 'w-2.5 h-2.5')}
                </div>
                <span className="text-foreground">All Chains</span>
              </button>

              {/* Chain Options */}
              {filteredChains
                .toSorted((a, b) => a.name.localeCompare(b.name))
                .map((chain) => (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => handleSelect(chain.id.toString())}
                    className={cn(
                      'p-3 text-sm text-left rounded-lg transition-colors text-foreground',
                      'hover:bg-bg-section active:bg-bg-section',
                      'min-h-[44px] flex items-center gap-2',
                      value === chain.id.toString() ? 'bg-bg-section' : '',
                    )}
                  >
                    {getChainIcon(chain.id.toString(), 'size-5 flex-shrink-0')}
                    <span className="truncate text-foreground">{chain.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
