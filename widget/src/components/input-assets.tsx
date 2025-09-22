import { useEffect, useRef, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useTradeStore } from '../providers'
import { AssetCard } from './token-card'
import { useConfig as useWidgetConfig } from '../providers/config-provider'

import { Dialog } from './dialog'
import { Avatar } from './avatar'
import { ClientOnly } from './client-only'
import { usdFormatter } from '../utils'
import { Address } from 'viem'
import { AnyAPIToken, APIToken } from '../services/get-tokens'
import { ChosenTokenDialogContent, useIsShortScreen } from './dialog/chosen-token'

type InputAssetsProps = {
  onInsufficientBalance: (insufficientBalance: boolean, symbol: string) => void
  onSelectTokens?: (tokens: APIToken[]) => void
}

export function InputAssets({ onInsufficientBalance, onSelectTokens }: InputAssetsProps) {
  const isShortScreen = useIsShortScreen()
  const { config: widgetConfig } = useWidgetConfig()
  const { inputTokens, inputPositions, removeInputToken, setTokenValue } = useTradeStore(
    useShallow((state) => ({
      inputTokens: state.inputTokens,
      inputPositions: state.inputPositions,
      removeInputToken: state.removeInputToken,
      setTokenValue: state.setTokenValue,
    })),
  )
  const [open, setOpen] = useState(false)
  const usdInputTotal = useTradeStore((state) => state.usdInputTotal)
  const clearSlider = useTradeStore((state) => state.clearSlider)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        clearSlider('input')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, clearSlider])

  return (
    <div className="bg-bg-section rounded-[32px] relative" ref={ref}>
      <div className="overflow-hidden p-4 flex flex-col gap-2">
        {/* <LayoutGroup>
          <AnimatePresence mode="popLayout"> */}
        {inputTokens.map((token, index) => {
          const isLast = inputTokens.length - 1 === index
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
              type="input"
              iid={token.iid}
              tokenDecimal={token.decimals}
              address={token.address as Address}
              chainId={token.network}
              usdPrice={token.priceUSD}
              tokenValue={inputPositions[token.iid]}
              onDismiss={() => removeInputToken(token)}
              onValueChange={(value) => setTokenValue(token, value)}
              onInsufficientBalance={onInsufficientBalance}
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
              setOpen={setOpen}
              isLast={isLast}
              showSlider={token.showSlider}
              minApr={'minApr' in token ? token.minApr : undefined}
              maxApr={'maxApr' in token ? token.maxApr : undefined}
              showAddButton={widgetConfig.multiInput}
            />
          )
        })}
        {/* </AnimatePresence> */}

        <CollapsedTokensList
          tokens={inputTokens}
          usdTotal={usdInputTotal}
          label="Input total"
          type="input"
          // onSelectTokens={handleAddInputToken}
        />
        {/* </LayoutGroup> */}
      </div>

      <ClientOnly>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          {/* <Dialog.Trigger>
            <button className="size-[30px] rounded-full flex items-center justify-center bg-bg-surface border border-stroke-grey-secondary absolute bottom-[-15px] left-1/2 -translate-x-1/2">
              <RiAddLine size={14} />
            </button>
          </Dialog.Trigger> */}
          <ChosenTokenDialogContent
            type="input"
            isOpen={open}
            onSelectTokens={(tokens) => {
              setOpen(false)
              // In single-token mode, replace the current token instead of adding
              if (!widgetConfig.multiInput && tokens.length > 0) {
                // Remove all current input tokens and add the new one
                const currentTokens = inputTokens
                currentTokens.forEach(token => removeInputToken(token))
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

type CollapsedTokensListProps = {
  tokens: AnyAPIToken[]
  usdTotal: string | number
  label: string
  type: 'input' | 'output'
  onSelectTokens?: (tokens: AnyAPIToken[]) => void
}

export function CollapsedTokensList({
  tokens,
  usdTotal,
  label,
  type,
  onSelectTokens,
}: CollapsedTokensListProps) {
  const [open, setOpen] = useState(false)
  const slicedInputTokens = tokens.slice(0, 2)

  return (
    <div className="mt-2 rounded-[32px] flex justify-between items-center relative">
      <div className="flex flex-col gap-2">
        {/* <p className="font-medium text-sm text-grey-secondary">{tokens.length} tokens selected</p> */}
        <ul className="flex items-center [&>li+li]:translate-x-[calc(4px*var(--index)*-1)]">
          {tokens.map((token, index) => (
            <li key={token.iid} style={{ ['--index' as string]: (index + 1).toString() }}>
              <Avatar
                src={'logoURI' in token ? token.logoURI : ''}
                alt={token.symbol}
                fallbackName={token.symbol}
                // rootClassName="ring-[6px] ring-bg-section"
                color={token.primaryColor}
              />
            </li>
          ))}
          {/* {tokens.length > 2 && (
            <li
              className="size-[32px] rounded-full bg-bg-surface flex items-center justify-center"
              style={{ ['--index' as string]: '3' }}
            >
              +{tokens.length - 2}
            </li>
          )} */}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-right">
        <p className="text-16px-normal ">Total</p>
        <p className="text-24px-normal ">
          {Number.isNaN(Number(usdTotal)) ? '$0' : usdFormatter.fullValue.format(usdTotal)}
        </p>
      </div>
    </div>
  )
}
