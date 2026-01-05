import { useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useTradeStore } from '../providers'
import { useConfig as useWidgetConfig } from '../providers/config-provider'
import { useStableCallback } from '../utils/react-19-compat'
import { AssetCard } from './token-card'

import { RiArrowDownSLine } from '@remixicon/react'
import { Accordion } from 'radix-ui'
import { Address } from 'viem'
import { useSwapOutputTotal } from '../hooks'
import { useClassicSolveIntentQuery } from '../queries/use-solve-intent-query'
import { APIToken } from '../services/get-tokens'
import { TokenType } from '../enums/token-type'
import { usdFormatter } from '../utils'
import { ClientOnly } from './client-only'
import { Dialog } from './dialog'
import { ChosenTokenDialogContent, useIsShortScreen } from './dialog/chosen-token'
import { CollapsedTokensList } from './input-assets'
import { TransactionOverview } from './transaction-overview'

type OutputAssetsProps = {
  isShowMinDebt?: boolean
  onSelectTokens: (tokens: APIToken[]) => void
}

export function OutputAssets({ isShowMinDebt, onSelectTokens }: OutputAssetsProps) {
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

  const clearSlider = useTradeStore((state) => state.clearSlider)

  // Create stable callbacks to prevent React 19 re-render issues
  const stableRemoveOutputToken = useStableCallback(removeOutputToken)
  const stableSetTokenValue = useStableCallback(setTokenValue)

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

  const tokenBalances = useMemo(() => {
    if (!solveIntentQuery.data?.balances) return new Map()

    const balanceMap = new Map()
    solveIntentQuery.data.balances.forEach((balance) => {
      let key = `${balance.token.chainId}:${balance.token.address.toLowerCase()}`

      const token = outputTokens.find((t) => {
        const [iid, tickRange] = t.iid.split('::')
        const tokenKey = `${iid.split(':')[1]}::${tickRange || ''}`
        const balanceTokenKey = (balance.token as any).tokenKey
        return (
          balanceTokenKey &&
          tokenKey.toLowerCase() === balanceTokenKey.toLowerCase()
        )
      })

      if (token && token.type === TokenType.ConcentratedLiquidity) {
        key = `${token.iid}`
      }

      balanceMap.set(key, balance)
    })
    return balanceMap
  }, [solveIntentQuery.data?.balances, outputTokens])

  const tokenData = useMemo(() => {
    return outputTokens.map((token, index) => {
      const isLast = outputTokens.length - 1 === index
      let balanceKey = `${token.network}:${token.address.toLowerCase()}`
      if (token.type === TokenType.ConcentratedLiquidity) {
        balanceKey = token.iid
      }
      const balance = tokenBalances.get(balanceKey)
      // Calculate priceUSD from balance if available
      const priceUSD = balance && balance.amount && Number(balance.amount) > 0
        ? String(Number(balance.amountUSD) / Number(balance.amount))
        : '1'
      const tokenValue = balance?.amount || '0.00'

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

      return {
        token,
        index,
        isLast,
        balance,
        priceUSD,
        tokenValue,
        images,
        branches,
      }
    })
  }, [outputTokens, tokenBalances])

  const minDebtToken = useMemo(
    () => outputTokens.find((token) => token.type === TokenType.VarDebt),
    [outputTokens],
  )

  return (
    <div className="h-full bg-bg-section rounded-[32px] relative" ref={ref}>
      <div className="h-full p-4 flex flex-col gap-2 overflow-hidden justify-between">
        {/* Token cards */}
        <div className="flex flex-col gap-2">
          {tokenData.map(({ token, isLast, priceUSD, tokenValue, images, branches }) => (
            <AssetCard
              images={images}
              branches={branches}
              key={token.iid}
              type="output"
              iid={token.iid}
              tokenDecimal={token.decimals}
              address={token.address as Address}
              chainId={token.network}
              usdPrice={priceUSD}
              tokenValue={tokenValue}
              onDismiss={() => stableRemoveOutputToken(token)}
              onValueChange={(value, balance) => stableSetTokenValue(token, value, balance)}
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
          ))}

          <div className="flex space-x-2 mb-2">
            {outputTokens.map((token) => (
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
        </div>

        {isShowMinDebt && (
          <div className="w-full flex justify-between items-center text-14px-medium">
            <span>Min Debt </span>
            <span>10 {minDebtToken?.symbol}</span>
          </div>
        )}
        {/* Progress bar */}
        <div className="flex flex-col">
          <CollapsedTokensList
            tokens={outputTokens}
            usdTotal={usdOutputTotal}
            label="Input total"
            type="output"
          />

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
      </div>

      <ClientOnly>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <ChosenTokenDialogContent
            type="output"
            onSelectTokens={(tokens) => {
              setOpen(false)
              onSelectTokens?.(tokens)
            }}
          />
        </Dialog.Root>
      </ClientOnly>
    </div>
  )
}
