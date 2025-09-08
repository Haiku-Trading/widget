import MagniferIcon from './../../icons/magnifer.svg'
import { TextField } from '../text-field'
import React from 'react'
import { useConfig } from 'wagmi'

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
            <img src="/icons/networks/56.svg" alt="Bsc" className="w-2.5 h-2.5 object-contain" />
            <img src="/icons/networks/8453.svg" alt="Base" className="w-2.5 h-2.5 object-contain" />
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
                <img src={`/icons/networks/${chain.id}.svg`} className="size-5" />
                {chain.name}
              </div>
            )
          })}
      </div>
    </div>
  )
}
