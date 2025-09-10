import { protocolsConfig } from '../../constants/constants'
import { cn } from '../../utils'
import { ChevronDownIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type ProtocolSelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  chain: string
}

export function MobileProtocolSelect({ value, onValueChange, chain }: ProtocolSelectProps) {
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

  const handleSelect = (protocol: string) => {
    const isSelected = value.includes(protocol)
    if (isSelected) {
      onValueChange(value.filter((v) => v !== protocol))
    } else {
      onValueChange([...value, protocol])
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
        className="w-max items-center justify-between p-2 flex gap-1 rounded-lg bg-bg-section text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-surface duration-150"
      >
        <div className="w-max flex gap-2 items-center justify-center">
          {value.length === 1 ? (
            <span>Protocol {'(opt)'}</span>
          ) : (
            <div className="flex gap-2">
              <img
                src={`/icons/protocols/${value[1]}.svg`}
                alt={value[0]}
                className="w-5 h-5 object-contain"
              />
              <span>{formatProtocolName(value[1])}</span>
            </div>
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
              'absolute right-0 top-full mt-6 z-50 max-h-[60vh]',
              'bg-bg-surface border border-stroke-grey-primary rounded-lg',
              'w-[200px]',
              'md:relative',
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
                'min-h-[60vh] overflow-y-auto',
                'max-md:max-h-[60vh]',
              )}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                touchAction: 'pan-y',
              }}
            >
              {filterByEnvironment.map((protocol) => {
                const isSelected = value.includes(protocol.symbol)
                return (
                  <button
                    key={protocol.name}
                    type="button"
                    onClick={() => handleSelect(protocol.symbol)}
                    className={cn(
                      'p-3 text-sm text-left rounded-lg transition-colors',
                      'hover:bg-bg-section active:bg-bg-section',
                      'min-h-[44px] flex items-center gap-2',
                      isSelected ? 'bg-bg-section' : '',
                    )}
                  >
                    <img
                      src={`/icons/protocols/${protocol.symbol}.svg`}
                      alt={protocol.name}
                      className="size-5 flex-shrink-0"
                    />
                    <span className="truncate">{protocol.name}</span>
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
