import ChevronDownIcon from './../../icons/chevron-down.svg'
import { cn } from '../../utils'
import { useEffect, useRef, useState } from 'react'
import { useConfig } from 'wagmi'

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
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const nameChain = config.chains.find((val) => val.id.toString() === value)?.name

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
        className="w-max items-center justify-between p-2 flex gap-1 rounded-lg bg-bg-section text-sm outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg-surface duration-150"
      >
        <div className="flex items-center justify-center">
          {value === 'all-chains' ? (
            <div className="flex gap-2">
              <div className="grid grid-cols-2 gap-0 w-5 h-5">
                <img
                  src="/icons/networks/1.svg"
                  alt="Ethereum"
                  className="w-2.5 h-2.5 object-contain"
                />
                <img
                  src="/icons/networks/80094.svg"
                  alt="Bera"
                  className="w-2.5 h-2.5 object-contain"
                />
                <img
                  src="/icons/networks/56.svg"
                  alt="Bsc"
                  className="w-2.5 h-2.5 object-contain"
                />
                <img
                  src="/icons/networks/8453.svg"
                  alt="Base"
                  className="w-2.5 h-2.5 object-contain"
                />
              </div>
              All chain
            </div>
          ) : (
            <div className="flex gap-2">
              <img
                src={`/icons/networks/${value}.svg`}
                alt={value}
                className="w-5 h-5 object-contain"
              />
              <span className="text-sm">{nameChain}</span>
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
              'absolute right-0 top-full mt-6 z-50',
              'bg-bg-surface border border-stroke-grey-primary rounded-lg',
              'w-[200px]',
              'md:relative',
              // 'max-md:fixed max-md:inset-x-4 max-md:top-1/2 max-md:-translate-y-1/2',
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
                  'p-3 text-sm text-left rounded-lg transition-colors',
                  'hover:bg-bg-section active:bg-bg-section',
                  'min-h-[44px] flex gap-2 items-center',
                  value === 'all-chains' ? 'bg-bg-section' : '',
                )}
              >
                <div className="grid grid-cols-2 gap-0 w-5 h-5">
                  <img
                    src="/icons/networks/1.svg"
                    alt="Ethereum"
                    className="w-2.5 h-2.5 object-contain"
                  />
                  <img
                    src="/icons/networks/80094.svg"
                    alt="Bera"
                    className="w-2.5 h-2.5 object-contain"
                  />
                  <img
                    src="/icons/networks/56.svg"
                    alt="Bsc"
                    className="w-2.5 h-2.5 object-contain"
                  />
                  <img
                    src="/icons/networks/8453.svg"
                    alt="Base"
                    className="w-2.5 h-2.5 object-contain"
                  />
                </div>
                All Chains
              </button>

              {/* Chain Options */}
              {config.chains
                .toSorted((a, b) => a.name.localeCompare(b.name))
                .map((chain) => (
                  <button
                    key={chain.id}
                    type="button"
                    onClick={() => handleSelect(chain.id.toString())}
                    className={cn(
                      'p-3 text-sm text-left rounded-lg transition-colors',
                      'hover:bg-bg-section active:bg-bg-section',
                      'min-h-[44px] flex items-center gap-2',
                      value === chain.id.toString() ? 'bg-bg-section' : '',
                    )}
                  >
                    <img
                      src={`/icons/networks/${chain.id}.svg`}
                      alt={chain.name}
                      className="size-5 flex-shrink-0"
                    />
                    <span className="truncate">{chain.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
