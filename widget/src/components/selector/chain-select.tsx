
import { TextField } from '../text-field'
import React from 'react'
import { useConfig } from 'wagmi'
import { cn } from '../../utils'
import { 
  MagniferIcon, 
  Chain1Icon, 
  Chain56Icon, 
  Chain8453Icon, 
  Chain80094Icon
} from '../icons'
import { getChainIcon } from '../../utils'
import { useConfig as useWidgetConfig } from '../../providers/config-provider'

type ChainSelectProps = {
  value: string
  onValueChange: (value: string) => void
  onValueProtocolChange: (value: string[]) => void
}

export function ChainSelect({ value, onValueChange, onValueProtocolChange }: ChainSelectProps) {
  const config = useConfig()
  const { config: widgetConfig } = useWidgetConfig()
  const [inputValue, setInputValue] = React.useState<string>('')

  const filteredChains = config.chains
    .filter((chain) => {
      // Filter out hidden chains
      if (widgetConfig.hiddenChains?.includes(chain.id)) {
        return false
      }
      return chain.name.toLowerCase().includes(inputValue.toLowerCase())
    })

  return (
    <div className="w-[190px] bg-bg-surface border border-stroke-grey-primary rounded-lg h-[677px] flex flex-col gap-1">
      {/* Search input */}
      <div className="w-[190px] p-4 pb-0">
        <TextField
          leftIcon={<MagniferIcon />}
          placeholder="Chain"
          containerClassName="w-full h-[36px] border-b border-border bg-transparent shrink-0"
          className="bg-transparent"
          onChange={(event) => setInputValue(event.target.value)}
          value={inputValue}
          autoFocus
        />
      </div>

      {/* Scrollable list */}
      <div className="overflow-auto flex-1 flex flex-col gap-[2px] p-4 pt-0">
        {/* All chains option */}
        <div
          className="p-2 mt-[2px] h-[38px] text-sm cursor-pointer rounded-lg flex items-center gap-1 hover:bg-bg-section text-foreground"
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
                className={cn(
                  "p-2 text-sm cursor-pointer rounded-lg hover:bg-bg-section flex items-center gap-1 border border-transparent text-foreground",
                  isSelected && "bg-primary/10 border-primary/70"
                )}
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
