
import { TextField } from '../text-field'
import React from 'react'
import { useConfig } from 'wagmi'
import { 
  MagniferIcon, 
  Chain1Icon, 
  Chain56Icon, 
  Chain8453Icon, 
  Chain80094Icon,
  Chain10Icon,
  Chain100Icon,
  Chain130Icon,
  Chain1329Icon,
  Chain137Icon,
  Chain146Icon,
  Chain33139Icon,
  Chain42161Icon,
  Chain43114Icon,
  Chain480Icon,
  Chain534352Icon,
  Chain747474Icon,
  Chain999Icon
} from '../icons'

type ChainSelectProps = {
  value: string
  onValueChange: (value: string) => void
  onValueProtocolChange: (value: string[]) => void
}

export function ChainSelect({ value, onValueChange, onValueProtocolChange }: ChainSelectProps) {
  const config = useConfig()
  const [inputValue, setInputValue] = React.useState<string>('')

  const filteredChains = config.chains.filter((chain) =>
    chain.name.toLowerCase().includes(inputValue.toLowerCase()),
  )

  // Helper function to get the appropriate chain icon component
  const getChainIcon = (chainId: string) => {
    const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
      '1': Chain1Icon,
      '10': Chain10Icon,
      '56': Chain56Icon,
      '100': Chain100Icon,
      '130': Chain130Icon,
      '137': Chain137Icon,
      '146': Chain146Icon,
      '42161': Chain42161Icon,
      '43114': Chain43114Icon,
      '480': Chain480Icon,
      '8453': Chain8453Icon,
      '80094': Chain80094Icon,
      '999': Chain999Icon,
      '1329': Chain1329Icon,
      '33139': Chain33139Icon,
      '534352': Chain534352Icon,
      '747474': Chain747474Icon,
    }
    
    const IconComponent = iconMap[chainId]
    return IconComponent ? <IconComponent className="size-5" /> : null
  }

  return (
    <div className="w-[190px] bg-bg-surface border border-stroke-grey-primary rounded-lg h-[677px] flex flex-col gap-1">
      {/* Search input */}
      <div className="w-[190px] p-4 pb-0">
        <TextField
          leftIcon={<MagniferIcon />}
          placeholder="Chain"
          containerClassName="w-full h-[36px] border-b border-border bg-transparent shrink-0"
          className="bg-transparent shrink-0"
          onChange={(event) => setInputValue(event.target.value)}
          value={inputValue}
          autoFocus
        />
      </div>

      {/* Scrollable list */}
      <div className="overflow-auto flex-1 flex flex-col gap-[2px] p-4 pt-0">
        {/* All chains option */}
        <div
          className="p-2 mt-[2px] h-[38px] text-sm cursor-pointer rounded-lg flex items-center gap-1 hover:bg-bg-section"
          onClick={() => {
            onValueChange('all-chains')
            onValueProtocolChange([''])
          }}
        >
          <div className="grid grid-cols-2 gap-0 w-5 h-5">
            <Chain1Icon className="w-2.5 h-2.5" />
            <Chain80094Icon className="w-2.5 h-2.5" />
            <Chain56Icon className="w-2.5 h-2.5" />
            <Chain8453Icon className="w-2.5 h-2.5" />
          </div>
          All Chains
        </div>

        {/* Chains list */}
        {filteredChains
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((chain) => {
            const isSelected = value === chain.id.toString()

            return (
              <div
                key={chain.id}
                onClick={() => {
                  onValueChange(chain.id.toString())
                  onValueProtocolChange([''])
                }}
                className="p-2 text-sm cursor-pointer rounded-lg hover:bg-bg-section flex items-center gap-1 border border-transparent"
                style={
                  isSelected
                    ? {
                        background: 'rgba(112, 69, 54, 0.1)',
                        borderColor: 'rgba(112, 69, 54, 0.7)',
                      }
                    : undefined
                }
              >
                {getChainIcon(chain.id.toString())}
                {chain.name}
              </div>
            )
          })}
      </div>
    </div>
  )
}
