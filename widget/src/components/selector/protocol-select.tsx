
import { protocolsConfig } from '../../constants/constants'
import { TextField } from '../text-field'
import { SearchX } from 'lucide-react'
import React from 'react'
import { MagniferIcon } from '../icons'
import { getProtocolIcon } from '../../utils'
import { useConfig as useWidgetConfig } from '../../providers/config-provider'

type ProtocolSelectProps = {
  value: string[]
  onValueChange: (value: string[]) => void
  chain: string
}

export function ProtocolSelect({ value, onValueChange, chain }: ProtocolSelectProps) {
  const { config: widgetConfig } = useWidgetConfig()
  const [inputValue, setInputValue] = React.useState<string>('')
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
          const excludedProtocols = ['PENDLE']
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

  const filteredProtocols = filterByHiddenProtocols.filter(
    (protocol) =>
      protocol.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      protocol.symbol.toLowerCase().includes(inputValue.toLowerCase()),
  )

  const handleClearClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onValueChange([''])
  }

  return (
    <div
      style={{
        boxShadow: '0px 4px 20.6px 0px rgba(0, 0, 0, 0.15)',
      }}
      className="bg-bg-surface border border-stroke-grey-primary rounded-lg flex flex-col gap-1 w-[190px] h-[677px]"
    >
      <div className="w-[190px] p-4 pb-0">
        <TextField
          leftIcon={<MagniferIcon />}
          placeholder="Protocol"
          containerClassName="w-full h-[36px] border-b border-border bg-transparent shrink-0"
          className="bg-transparent"
          onChange={(event) => {
            setInputValue(event.target.value)
          }}
          value={inputValue}
          autoFocus
        />
      </div>
      <div className="overflow-auto flex-1 flex flex-col gap-[2px] p-4 pt-0">
        {filteredProtocols.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <SearchX className="w-5 h-5" />
            <span className="text-xs">No protocols available</span>
          </div>
        ) : (
          filteredProtocols.map((protocol) => {
            // const isSelected = value === protocol.symbol
            const isSelected = value.includes(protocol.symbol)

            return (
              <div
                key={protocol.symbol}
                onClick={() => {
                  if (isSelected) {
                    onValueChange(value.filter((v) => v !== protocol.symbol))
                  } else {
                    onValueChange([...value, protocol.symbol])
                  }
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
                {getProtocolIcon(protocol.symbol)}
                {protocol.name}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
