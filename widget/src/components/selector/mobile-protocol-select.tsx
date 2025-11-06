import { protocolsConfig } from '../../constants/constants'
import { cn } from '../../utils'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getProtocolIcon } from '../../utils/protocol-utils'
import { useConfig as useWidgetConfig } from '../../providers/config-provider'

type ProtocolSelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  chain: string
  isSimpleMode?: boolean
}

export function MobileProtocolSelect({ value, onValueChange, chain, isSimpleMode = false }: ProtocolSelectProps) {
  const { config: widgetConfig } = useWidgetConfig()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function formatProtocolName(name: string) {
    if (!name) return ''
    const [first, ...rest] = Array.from(name.toLowerCase())
    return first.toUpperCase() + rest.join('')
  }

  const filterByChainProtocol =
    chain === 'all-chains'
      ? Object.values(protocolsConfig)
      : Object.values(protocolsConfig).filter((item) =>
          item.supportedChains.includes(Number(chain)),
        )

  // Filter out excluded protocols in production
  const filterByEnvironment =
    process.env.VERCEL_ENV === 'production'
      ? filterByChainProtocol.filter((protocol) => {
          // In production, exclude these protocols
          const excludedProtocols = ['PENDLE'] // pendle
          return !excludedProtocols.includes(protocol.symbol)
        })
      : filterByChainProtocol

  // Filter out hidden protocols from config
  const filterByHiddenProtocols = filterByEnvironment.filter((protocol) => {
    if (widgetConfig.hiddenProtocols?.includes(protocol.symbol)) {
      return false
    }
    return true
  })

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

  const handleSelect = (protocol: string | null) => {
    if (protocol === null) {
      // Select "All Protocols"
      onValueChange([''])
      setIsOpen(false)
      return
    }
    
    const isSelected = value.includes(protocol)
    if (isSelected) {
      const newValue = value.filter((v) => v !== protocol)
      // If nothing selected, default to "all protocols"
      if (newValue.length === 0) {
        onValueChange([''])
      } else {
        onValueChange(newValue)
      }
    } else {
      // Remove empty string if it exists (means "all protocols" was selected)
      const newValue = value.filter((v) => v !== '')
      onValueChange([...newValue, protocol])
    }
    setIsOpen(false)
  }

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onValueChange([''])
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
          {value.length === 0 || (value.length === 1 && value[0] === '') ? (
            <span className="text-foreground">All Protocols</span>
          ) : value.length === 1 ? (
            <div className="flex gap-2">
              {getProtocolIcon(value[0], 'w-5 h-5')}
              <span className="text-foreground">{formatProtocolName(value[0])}</span>
            </div>
          ) : (
            <span className="text-foreground">{value.length} selected</span>
          )}
          {/* {value.length > 1 && (
            <button
              className="w-[20px] h-[20px] rounded flex items-center justify-center z-10 hover:bg-bg-section"
              onClick={handleClearClick}
              type="button"
            >
              <XIcon />
            </button>
          )} */}
          <div className={cn('transition-transform duration-200', isOpen ? 'rotate-180' : '')}>
            <ChevronDownIcon />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed  inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div
            className={cn(
              'absolute left-0 top-full mt-2 z-50',
              'bg-bg-surface border border-stroke-grey-primary rounded-lg',
              'w-[200px]',
              isSimpleMode ? 'max-h-[440px]' : 'max-h-[300px]',
              'max-md:fixed max-md:inset-x-4 max-md:top-[45%] max-md:left-[50%] max-md:-translate-y-1/2',
              'max-md:max-h-[70vh]',
            )}
            style={{
              boxShadow: '0px 4px 20.6px 0px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              className={cn(
                'p-2 flex flex-col gap-1',
                isSimpleMode ? 'max-h-[440px]' : 'max-h-[300px]',
                'overflow-y-auto',
                'max-md:max-h-[60vh]',
              )}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              {/* All Protocols Option */}
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className={cn(
                  'p-3 text-sm text-left rounded-lg transition-colors text-foreground',
                  'hover:bg-bg-section active:bg-bg-section',
                  'min-h-[44px] flex items-center justify-start gap-2 w-full',
                  value.length === 0 || (value.length === 1 && value[0] === '') ? 'bg-bg-section' : '',
                )}
              >
                <span className="text-foreground text-left">All Protocols</span>
                {(value.length === 0 || (value.length === 1 && value[0] === '')) && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>

              {/* Protocol Options */}
              {filterByHiddenProtocols.map((protocol) => {
                const isSelected = value.includes(protocol.symbol)
                return (
                  <button
                    key={protocol.name}
                    type="button"
                    onClick={() => handleSelect(protocol.symbol)}
                    className={cn(
                      'p-3 text-sm text-left rounded-lg transition-colors text-foreground',
                      'hover:bg-bg-section active:bg-bg-section',
                      'min-h-[44px] flex items-center justify-start gap-2 w-full',
                      isSelected ? 'bg-bg-section' : '',
                    )}
                  >
                    <div className="flex-shrink-0">
                      {getProtocolIcon(protocol.symbol, 'size-5')}
                    </div>
                    <span className="truncate text-foreground text-left flex-1">{protocol.name}</span>
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
