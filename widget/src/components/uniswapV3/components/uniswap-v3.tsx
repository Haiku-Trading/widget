'use client'

import { useConcentratedPoolData } from '../../../queries/concentrated-pool-data'
import { MAX_TICK, MIN_TICK, nearestUsableTick } from '../../../utils/uniswapV3'
import { APIToken } from '../../../services/get-tokens'
import { Button } from '../../button/button'
import { cn } from '../../../utils'
import { Avatar, Clipboard } from '@ark-ui/react'
import { CopyIcon } from '@radix-ui/react-icons'
import { ToggleGroup } from 'radix-ui'
import { useEffect, useMemo, useState } from 'react'
import { useConfig } from 'wagmi'
import { ShareIcon } from '../../icons'
import UniswapChartContainer from './uniswap-chart-container'

const modes = [
  {
    type: 'fullRange',
    label: 'Full Range',
    disabled: false,
  },
  { type: 'customRange', label: 'Custom Range', disabled: false },
]

interface UniswapV3Props {
  tokenInfo: APIToken
  allTokens?: APIToken[]
  onSetTickRange?: (range: { lower: string; upper: string }) => void
  onSelect?: () => void
  onCancel?: () => void
}

const UniswapV3 = ({ tokenInfo, allTokens, onSetTickRange, onSelect, onCancel }: UniswapV3Props) => {
  const firstToken =
    useMemo(
      () => allTokens?.find((token) => token.iid === tokenInfo.underlying_iids[0]),
      [tokenInfo, allTokens],
    ) || []
  const secondToken = useMemo(
    () => allTokens?.find((token) => token.iid === tokenInfo.underlying_iids[1]),
    [tokenInfo, allTokens],
  )

  const [currMode, setCurrMode] = useState<string>('fullRange')

  const { data: concentratedPoolData } = useConcentratedPoolData({
    iid: tokenInfo.iid,
    enable: true,
  })

  useEffect(() => {
    if (currMode == 'fullRange' && onSetTickRange && concentratedPoolData) {
      const lowerTick = nearestUsableTick(MIN_TICK, concentratedPoolData.tickSpacing)
      const upperTick = nearestUsableTick(MAX_TICK, concentratedPoolData.tickSpacing)
      onSetTickRange({ lower: lowerTick.toString(), upper: upperTick.toString() })
    }
  }, [concentratedPoolData, onSetTickRange, currMode])

  const { chains } = useConfig()
  const chainUrl = useMemo(() => {
    return (
      chains.find((chain) => chain.id === tokenInfo?.network)?.blockExplorers?.default.url ??
      undefined
    )
  }, [tokenInfo, chains])

  return (
    <div className="w-[700px] flex rounded-lg  bg-bg-surface border border-stroke-grey-primary flex-col gap-5 p-6">
      <div className="w-full flex justify-between">
        <span className="text-[18px]">Set price change</span>
        <div className="w-max flex justify-end items-center gap-3">
          {chainUrl && (
            <a href={`${chainUrl}/address/${tokenInfo?.address}`} target="_blank">
              <ShareIcon />
            </a>
          )}
          {'url' in tokenInfo && tokenInfo?.url ? (
            <a href={typeof tokenInfo.url === 'string' ? tokenInfo.url : '#'} target="_blank">
              <Avatar.Root className="w-3.5 h-3.5 inline-block rounded-full overflow-hidden">
                <Avatar.Image
                  src={`/icons/protocols/${tokenInfo?.protocol}.svg`}
                  alt="Favicon"
                  className="rounded-full"
                />
              </Avatar.Root>
            </a>
          ) : (
            <></>
          )}
          {tokenInfo?.address.toString().toLowerCase() !==
            '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() && (
            <Clipboard.Root value={`${tokenInfo?.address.toLowerCase()}`} className="font-bold">
              <Clipboard.Control>
                <Clipboard.Trigger className="size-4 flex items-center justify-center cursor-pointer active:scale-95 text-icon-subtle">
                  <Clipboard.Indicator copied={<CopyIcon />}>
                    <CopyIcon />
                  </Clipboard.Indicator>
                </Clipboard.Trigger>
              </Clipboard.Control>
            </Clipboard.Root>
          )}
        </div>
      </div>
      <ToggleGroup.Root
        type="single"
        value={currMode}
        onValueChange={(value) => {
          setCurrMode(value)
        }}
        className={cn(
          'isolate relative inline-flex h-12 max-newmd:w-full max-md:h-10 shrink-0 cursor-pointer items-center rounded-full border border-border disabled:cursor-not-allowed disabled:opacity-50 bg-secondary px-1',
        )}
      >
        {modes.map((mode) => (
          // eslint-disable-next-line react/jsx-key
          <ToggleGroup.Item
            value={mode.type}
            disabled={mode.disabled}
            className={cn(
              'group relative flex-1 text-sm font-medium text-muted-foreground py-2 text-center rounded-full',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary',
              'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
              mode.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            {currMode === mode.type && !mode.disabled && (
              <div
                className="bg-primary rounded-full absolute inset-0"
              />
            )}

            <p
              className={cn(
                'relative z-10',
                currMode === mode.type && !mode.disabled ? 'text-white' : 'text-muted-foreground',
                mode.disabled && 'text-muted-foreground/50',
              )}
            >
              {mode.label}
            </p>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      <span className="text-14px-normal text-grey-medium dark:text-[#B2B2B2]">
        Providing full range liquidity ensures continuous market participation across all possible
        prices, offering simplicity but with potential for higher impermanent loss.
      </span>
      <UniswapChartContainer
        firstToken={firstToken as APIToken}
        secondToken={secondToken as APIToken}
        pool={tokenInfo}
        isFullRange={currMode === 'fullRange'}
        onSetTickRange={currMode === 'fullRange' ? undefined : onSetTickRange}
        concentratedPoolData={concentratedPoolData}
      />

      <div className="bg-bg-surface p-4 flex items-center gap-4 rounded-b-full">
        <Button
          className="flex-1 text-base text-grey-secondary"
          variant="outline"
          size="lg"
          onClick={() => {
            if (onSetTickRange && concentratedPoolData) {
              const lowerTick = nearestUsableTick(MIN_TICK, concentratedPoolData.tickSpacing)
              const upperTick = nearestUsableTick(MAX_TICK, concentratedPoolData.tickSpacing)
              onSetTickRange({ lower: lowerTick.toString(), upper: upperTick.toString() })
            }
            if (onCancel) {
              onCancel()
            }
          }}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 text-base disabled:grayscale disabled:opacity-30"
          size="lg"
          onClick={onSelect}
        >
          Add
        </Button>
      </div>
    </div>
  )
}

export default UniswapV3
