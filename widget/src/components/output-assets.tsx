import { useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useTradeStore } from '../providers'
import { AssetCard } from './token-card'
import { useConfig as useWidgetConfig } from '../providers/config-provider'

import { ClientOnly } from './client-only'
import { Dialog } from './dialog'
import { usdFormatter } from '../utils'
import { RiArrowDownSLine } from '@remixicon/react'
import { Accordion } from 'radix-ui'
import { Address } from 'viem'
import { useSwapOutputTotal } from '../hooks'
import { useClassicSolveIntentQuery } from '../queries/use-solve-intent-query'
import { APIToken } from '../services/get-tokens'
import { ChosenTokenDialogContent, useIsShortScreen } from './dialog/chosen-token'
import { CollapsedTokensList } from './input-assets'
import { TransactionOverview } from './transaction-overview'

type OutputAssetsProps = {
  onSelectTokens: (tokens: APIToken[]) => void
}

export function OutputAssets({ onSelectTokens }: OutputAssetsProps) {
  const isShortScreen = useIsShortScreen()
  const { config: widgetConfig } = useWidgetConfig()
  const { outputTokens, removeOutputToken, setTokenValue } = useTradeStore(
    useShallow((state) => ({
      outputTokens: state.outputTokens,
      removeOutputToken: state.removeOutputToken,
      setTokenValue: state.setTokenValue,
    })),
  )
  const solveIntentQuery = useClassicSolveIntentQuery()
  const [open, setOpen] = useState(false)
  const [openItem, setOpenItem] = useState<string>('')

  const isOpen = openItem === 'item-1'
  const usdOutputTotal = useSwapOutputTotal()

  const [resetTransactionData, setResetTransactionData] = useState(false)

  useEffect(() => {
    if (outputTokens.length === 0) {
      setResetTransactionData(true)
    } else {
      setResetTransactionData(false)
    }
  }, [outputTokens])

  const clearSlider = useTradeStore((state) => state.clearSlider)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        clearSlider('output')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, clearSlider])

  return (
    <div className="bg-bg-section rounded-[32px] relative" ref={ref}>
      <div className="p-4 flex flex-col gap-2 overflow-hidden">
        {/* <LayoutGroup> */}
        <div className="flex space-x-2 mb-4">
          {outputTokens.map((token, index) => (
            <div
              key={token.iid}
              className="h-6 bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: token.primaryColor,
                width: `${token.percentage}%`,
              }}
            />
          ))}
        </div>
        {/* <AnimatePresence mode="popLayout"> */}
        {outputTokens.map((token, index) => {
          const isLast = outputTokens.length - 1 === index
          const balance = solveIntentQuery.data?.balances.find((balance) => {
            return (
              `${token.network}:${token.address.toLowerCase()}` ===
              `${balance.token.chainId}:${balance.token.address.toLowerCase()}`
            )
          })
          const outputToken = solveIntentQuery.data?.outputTokenUsdPrices.find(
            (ot) => ot.iid === token.iid,
          )
          const tokenValue = balance?.amount ? balance.amount : '0.00'

          const images = [
            {
              src: 'logoURI' in token ? token.logoURI : '',
              symbol: token.symbol,
              color: undefined,
            },
          ]

          const branches = [
            {
              symbol: token.network.toString(),
            },
          ]

          if ('protocol' in token) {
            branches.push({
              symbol: token.protocol as string,
            })
          }
          return (
            <AssetCard
              images={images}
              branches={branches}
              key={token.iid}
              type="output"
              iid={token.iid}
              tokenDecimal={token.decimals}
              address={token.address as Address}
              chainId={token.network}
              usdPrice={outputToken?.priceUSD || '1'}
              tokenValue={tokenValue}
              onDismiss={() => removeOutputToken(token)}
              onValueChange={(value) => setTokenValue(token, value)}
              name={token.name ?? token.symbol}
              symbol={token.symbol}
              logoURL={'logoURI' in token ? token.logoURI : ''}
              tokenCategory={token.type}
              network={token.network}
              // TODO: fix this any
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              protocol={(token as any).protocol}
              color={token.primaryColor}
              onOpenChosenTokens={() => setOpen(true)}
              isLast={isLast}
              setOpen={setOpen}
              percentage={token.percentage}
              locked={token.locked}
              showSlider={token.showSlider}
              minApr={'minApr' in token ? token.minApr : undefined}
              maxApr={'maxApr' in token ? token.maxApr : undefined}
              showAddButton={widgetConfig.multiOutput}
              isLocked={widgetConfig.lockedOutputs}
            />
          )
        })}
        {/* </AnimatePresence> */}

        <CollapsedTokensList
          tokens={outputTokens}
          usdTotal={usdOutputTotal}
          label="Input total"
          type="input"
          // onSelectTokens={handleAddInputToken}
        />
        {/* </LayoutGroup> */}

        <Accordion.Root
          className="w-full"
          type="single"
          value={openItem}
          onValueChange={(value) => setOpenItem(value)}
          collapsible
        >
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger className="w-full">
                <div className="flex mt-3 w-full justify-between">
                  <span className=" text-14px-medium text-foreground">Minimum received</span>
                  <div className="flex items-center gap-[5px]">
                    <span className=" text-14px-medium text-foreground">
                      {usdFormatter.fullValue.format(usdOutputTotal)}
                    </span>
                    <RiArrowDownSLine
                      size={16}
                      className={`transition-transform duration-200 text-foreground ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    />
                  </div>
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div className="w-full">
                <TransactionOverview isClassicModal={false} />
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>

      <ClientOnly>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          {/* <Dialog.Trigger>
            <button className="size-[30px] rounded-full flex items-center justify-center bg-bg-surface border border-stroke-grey-secondary absolute bottom-[-15px] left-1/2 -translate-x-1/2">
              <RiAddLine size={14} className="text-foreground" />
            </button>
          </Dialog.Trigger> */}
          <ChosenTokenDialogContent
            type="output"
            isOpen={open}
            onSelectTokens={(tokens) => {
              setOpen(false)
              // In single-token mode, replace the current token instead of adding
              if (!widgetConfig.multiOutput && tokens.length > 0) {
                // Remove all current output tokens and add the new one
                const currentTokens = outputTokens
                currentTokens.forEach(token => removeOutputToken(token))
                onSelectTokens?.(tokens)
              } else {
                onSelectTokens?.(tokens)
              }
            }}
          />
        </Dialog.Root>
      </ClientOnly>
    </div>
  )
}
