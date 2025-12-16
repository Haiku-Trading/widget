/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { memo, useEffect, useMemo, useState } from 'react'


import { getInitials } from '../../../utils/get-initials'
import { cn } from '../../../utils'
import { Avatar, Clipboard } from '@ark-ui/react'
import { CopyIcon, TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons'
import millify from 'millify'
import { useConfig } from 'wagmi'
import { Badge } from '../../badge'
import { formatWithZeroCountSubscript } from '../../../utils/numberFormatting'
import { ShareIcon } from '../../icons'
import { getChainIcon } from '../../../utils/chain-utils'
import { getProtocolIcon } from '../../../utils/protocol-utils'

/* ----------------------------------------------------------------------------
 * ImageGroup
 * ---------------------------------------------------------------------------*/

type ImageGroupProps = {
  images: ImageObject[]
  branches: ImageObject[]
}

type ImageObject = {
  symbol: string
  color?: string
}

const ImageGroup = memo(({ branches, images }: ImageGroupProps) => {
  // Pre-filter valid branches to avoid runtime checks
  const validBranches = branches.slice(0, 2)

  return (
    <div className="bg-bg-surface border border-stroke-grey-primary rounded-full">
      {images.map((image, index) => {
        const isLastItem = index === images.length - 1
        const zIndex = images.length - index

        return (
          <Avatar.Root
            key={`${image.symbol}-${index}`}
            className="block relative size-8 rounded-full"
            style={{
              zIndex,
              backgroundColor: image.color ?? 'hsl(var(--bg-section) / 0.24)',
            }}
          >
            <div className="rounded-full w-full h-full flex items-center justify-center">
              {getInitials(image.symbol)}
            </div>

            {/* Only render branches on last item and if branches exist */}
            {isLastItem &&
              validBranches.map((branch, branchIndex) => (
                <ImageBranch
                  key={`${branch.symbol}-${branchIndex}`}
                  index={branchIndex}
                  branch={branch}
                />
              ))}
          </Avatar.Root>
        )
      })}
    </div>
  )
})

ImageGroup.displayName = 'ImageGroup'

/* ----------------------------------------------------------------------------
 * ImageBranch
 * ---------------------------------------------------------------------------*/

type ImageBranchProps = {
  index: number
  branch: ImageObject
}

const ImageBranch = memo(({ index, branch }: ImageBranchProps) => {
  // Pre-calculate position to avoid runtime conditionals
  const position = index === 0 ? '-bottom-1.5 -right-1.5' : '-top-1.5 -right-1.5'

  // Determine if this is a chain or protocol icon based on the symbol
  const isChainIcon = !isNaN(Number(branch.symbol))

  return (
    <div
      className={cn('absolute block text-[0.625rem] size-5 rounded-full bg-secondary flex items-center justify-center', position)}
    >
      {isChainIcon ? (
        getChainIcon(branch.symbol, 'w-full h-full') || (
          <div className="w-full h-full flex items-center justify-center text-[8px]">
            {getInitials(branch.symbol)}
          </div>
        )
      ) : (
        getProtocolIcon(branch.symbol, 'w-full h-full') || (
          <div className="w-full h-full flex items-center justify-center text-[8px]">
            {getInitials(branch.symbol)}
          </div>
        )
      )}
    </div>
  )
})

ImageBranch.displayName = 'ImageBranch'

/* ----------------------------------------------------------------------------
 * ChainItem
 * ---------------------------------------------------------------------------*/
type ChainItemProps = ImageGroupProps & {
  chainName: string
  metadata: any
}

const ChainItem = ({ chainName, metadata, images, branches }: ChainItemProps) => {
  return (
    <div className="w-[350px] h-[105px] flex flex-col justify-center items-center rounded-lg bg-bg-surface border border-stroke-grey-primary">
      <div className="w-full h-2/3 rounded-t-lg bg-warning-bg p-[16px] relative">
        <div className="absolute top-[16px] right-[16px]">
          <Badge variant="success">Network</Badge>
        </div>
        <div className="w-full h-full flex justify-start items-center gap-3">
          <ImageGroup images={images} branches={branches} />
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-full flex items-center justify-between gap-3">
              <Clipboard.Root className="flex items-center gap-1">
                <Clipboard.Label className="w-full flex flex-col gap-1 justify-center items-start text-grey-primary text-base font-medium">
                  <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                    {chainName.length > 15 ? `${chainName.slice(0, 15)}...` : chainName}
                  </span>
                </Clipboard.Label>
              </Clipboard.Root>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/3 rounded-b-lg bg-bg-surface p-[16px] flex justify-start items-center gap-2">
        <a href={metadata?.blockExplorers?.default.url} target="_blank">
          <ShareIcon className="text-foreground" />
        </a>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * ProtocolItem
 * ---------------------------------------------------------------------------*/
type ProtocolItemProps = ImageGroupProps & {
  protocolName: string
  metadata: any
}

const ProtocolItem = ({ protocolName, metadata, images, branches }: ProtocolItemProps) => {
  return (
    <div className="w-[350px] h-[105px] flex flex-col justify-center items-center rounded-lg bg-bg-surface border border-stroke-grey-primary">
      <div className="w-full h-2/3 rounded-t-lg bg-warning-bg p-[16px] relative">
        <div className="absolute top-[16px] right-[16px]">
          <Badge variant="success">Protocol</Badge>
        </div>
        <div className="w-full h-full flex justify-start items-center gap-3">
          <ImageGroup images={images} branches={branches} />
          <div className="flex-1 flex flex-col gap-2">
            <div className="w-full flex items-center justify-between gap-3">
              <Clipboard.Root className="flex items-center gap-1">
                <Clipboard.Label className="w-full flex flex-col gap-1 justify-center items-start text-grey-primary text-base font-medium">
                  <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                    {protocolName.length > 15 ? `${protocolName.slice(0, 15)}...` : protocolName}
                  </span>
                </Clipboard.Label>
              </Clipboard.Root>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/3 rounded-b-lg bg-bg-surface p-[16px] flex justify-start items-center gap-2">
        <a href={metadata?.url} target="_blank">
          <ShareIcon className="text-foreground" />
        </a>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * TokenItem
 * ---------------------------------------------------------------------------*/
type TokenItemProps = ImageGroupProps & {
  tokenName: string
  metadata: any
}

const TokenItem = ({ tokenName, metadata, images, branches }: TokenItemProps) => {
  const { chains } = useConfig()
  const chainUrl = useMemo(() => {
    return (
      chains.find((chain) => chain.id === metadata?.network)?.blockExplorers?.default.url ??
      undefined
    )
  }, [metadata, chains])

  const usdFmt = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      maximumSignificantDigits: 1,
      roundingPriority: 'morePrecision',
      roundingMode: 'floor',
    })
  }, [])

  // Use token symbol as fallback if tokenName is not present
  const displayName = tokenName || metadata?.symbol || ''

  const priceUSD =
    (metadata?.metadata?.priceUSD as number) && (metadata?.metadata?.priceUSD as number) > 0
      ? (metadata?.metadata?.priceUSD as number)
      : (((metadata?.priceUSD ?? 0) as unknown as number) ?? 0)

  return (
    <div className="w-[350px] h-[175px] flex flex-col justify-center items-center rounded-lg bg-bg-primary border border-stroke-grey-primary">
      <div className="w-full h-4/5 rounded-t-lg bg-[rgba(194,65,12,0.1)] dark:bg-bg-surface p-[16px] relative">
        <div className="absolute top-[16px] right-[16px]">
          <Badge variant="success">Token</Badge>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full h-1/2 flex justify-start items-center gap-3">
            <ImageGroup images={images} branches={branches} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full flex items-center justify-between gap-3">
                <Clipboard.Root className="flex items-center gap-1">
                  <Clipboard.Label className="w-full flex flex-col gap-1 justify-center items-start text-grey-primary text-base font-medium">
                    <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                      {displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName}
                    </span>
                    <div className="w-full text-start font-bold text-wrap flex gap-2 justify-start items-center">
                      <span className="w-full text-start text-wrap flex gap-2 justify-between items-center text-foreground">
                        $
                        {priceUSD > 1
                          ? millify(priceUSD)
                          : formatWithZeroCountSubscript(priceUSD, 18)}
                      </span>
                      <span
                        className={cn(
                          'w-full text-start text-wrap text-sm flex justify-between items-center font-thin',
                          (metadata?.metadata?.pricePercentage24h ?? 0) > 0 && 'text-success',
                          (metadata?.metadata?.pricePercentage24h ?? 0) < 0 && 'text-failed',
                        )}
                      >
                        {(metadata?.metadata?.pricePercentage24h ?? 0) > 0 && <TriangleUpIcon />}

                        {(metadata?.metadata?.pricePercentage24h ?? 0) < 0 && <TriangleDownIcon />}
                        {metadata?.metadata?.pricePercentage24h != 0 &&
                          `${parseFloat(metadata?.metadata?.pricePercentage24h).toFixed(2)}%`}
                      </span>
                    </div>
                  </Clipboard.Label>
                </Clipboard.Root>
              </div>
            </div>
          </div>
          <div className="w-full h-1/2 flex justify-center items-center">
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold text-foreground">
                {!metadata?.metadata?.volume24h || metadata?.metadata?.volume24h == 0
                  ? '-'
                  : `$${millify(metadata?.metadata?.volume24h ?? 0)}`}
              </span>
              <span className="text-xs opacity-50 text-foreground">24H Volume</span>
            </div>
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold text-foreground">
                {!metadata?.metadata?.mcap || metadata?.metadata?.mcap == 0
                  ? '-'
                  : `$${millify(metadata?.metadata?.mcap ?? 0)}`}
              </span>
              <span className="text-xs opacity-50 text-foreground">Market Cap</span>
            </div>
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold text-foreground">
                {!metadata?.metadata?.fdv || metadata?.metadata?.fdv == 0
                  ? '-'
                  : `$${millify(metadata?.metadata?.fdv ?? 0)}`}
              </span>
              <span className="text-xs opacity-50 text-foreground">FDV</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/5 rounded-b-lg bg-bg-primary p-[16px] flex justify-start items-center gap-3">
        {chainUrl && (
          <a href={`${chainUrl}/address/${metadata?.address}`} target="_blank">
            <ShareIcon className="text-foreground" />
          </a>
        )}
        {metadata?.url && (
          <a href={metadata?.url} target="_blank">
            <Avatar.Root className="w-3.5 h-3.5 inline-block rounded-full overflow-hidden">
              <Avatar.Image
                src={'https://www.coingecko.com/favicon.ico'}
                alt="Favicon"
                className="rounded-full"
              />
            </Avatar.Root>
          </a>
        )}
        {metadata?.address.toString().toLowerCase() !==
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() && (
          <Clipboard.Root value={`${metadata?.address.toLowerCase()}`} className="font-bold">
            <Clipboard.Control>
              <Clipboard.Trigger className="size-4 flex items-center justify-center cursor-pointer active:scale-95 text-icon-subtle">
                <Clipboard.Indicator copied={<CopyIcon className="text-foreground" />}>
                  <CopyIcon className="text-foreground" />
                </Clipboard.Indicator>
              </Clipboard.Trigger>
            </Clipboard.Control>
          </Clipboard.Root>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * LendingItem
 * ---------------------------------------------------------------------------*/
type LendingItemProps = ImageGroupProps & {
  tokenName: string
  metadata: any
}

const LendingItem = ({ tokenName, metadata, images, branches }: LendingItemProps) => {
  const { chains } = useConfig()
  const chainUrl = useMemo(() => {
    return (
      chains.find((chain) => chain.id === metadata?.network)?.blockExplorers?.default.url ??
      undefined
    )
  }, [metadata, chains])

  // Use token symbol as fallback if tokenName is not present
  const displayName = tokenName || metadata?.symbol || ''
  const priceUSD =
    (metadata?.metadata?.priceUSD as number) && (metadata?.metadata?.priceUSD as number) > 0
      ? (metadata?.metadata?.priceUSD as number)
      : (((metadata?.priceUSD ?? 0) as unknown as number) ?? 0)
  return (
    <div className="w-[350px] h-[175px] flex flex-col justify-center items-center rounded-lg bg-bg-surface border border-stroke-grey-primary">
      <div className="w-full h-4/5 rounded-t-lg bg-[rgba(194,65,12,0.1)] dark:bg-bg-surface p-[16px] relative">
        <div className="absolute top-[16px] right-[16px]">
          <Badge variant="success">Lending</Badge>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full h-full flex justify-start items-center gap-3">
            <ImageGroup images={images} branches={branches} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full flex items-center justify-between gap-3">
                <Clipboard.Root className="flex items-center gap-1">
                  <Clipboard.Label className="w-full flex flex-col gap-1 justify-center items-start text-grey-primary text-base font-medium">
                    <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                      {displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName}
                    </span>
                    <div className="w-full text-start font-bold text-wrap flex gap-2 justify-start items-center">
                      <div className="w-full text-start text-wrap flex gap-2 justify-start items-end">
                        <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                          $
                          {priceUSD > 1
                            ? millify(priceUSD)
                            : formatWithZeroCountSubscript(priceUSD, 18)}
                        </span>
                      </div>
                    </div>
                  </Clipboard.Label>
                </Clipboard.Root>
              </div>
            </div>
          </div>
          <div className="w-full h-1/2 flex justify-center items-center">
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold">
                {parseFloat((metadata?.apy ?? 0)).toFixed(2)}{' '}%
              </span>
              <span className="text-xs opacity-50">APY</span>
            </div>
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold">
                $
                {metadata?.metadata?.tvl && Number(metadata?.metadata?.tvl) > 1
                  ? millify(Number(metadata?.metadata?.tvl))
                  : '0.00'}
              </span>
              <span className="text-xs opacity-50">TVL</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/5 rounded-b-lg bg-bg-primary p-[16px] flex justify-start items-center gap-3">
        {chainUrl && (
          <a href={`${chainUrl}/address/${metadata?.address}`} target="_blank">
            <ShareIcon className="text-foreground" />
          </a>
        )}
        {metadata?.url && (
          <a href={metadata?.url} target="_blank">
            <Avatar.Root className="w-3.5 h-3.5 inline-block rounded-full overflow-hidden">
              <div className="rounded-full w-full h-full flex items-center justify-center">
                {getProtocolIcon(metadata?.protocol, 'w-full h-full') || (
                  <div className="text-[8px]">P</div>
                )}
              </div>
            </Avatar.Root>
          </a>
        )}
        {metadata?.address.toString().toLowerCase() !==
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() && (
          <Clipboard.Root value={`${metadata?.address.toLowerCase()}`} className="font-bold">
            <Clipboard.Control>
              <Clipboard.Trigger className="size-4 flex items-center justify-center cursor-pointer active:scale-95 text-icon-subtle">
                <Clipboard.Indicator copied={<CopyIcon className="text-foreground" />}>
                  <CopyIcon className="text-foreground" />
                </Clipboard.Indicator>
              </Clipboard.Trigger>
            </Clipboard.Control>
          </Clipboard.Root>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * LiquidityItem
 * ---------------------------------------------------------------------------*/
type LiquidityItemProps = ImageGroupProps & {
  tokenName: string
  metadata: any
}

const LiquidityItem = ({ tokenName, metadata, images, branches }: LiquidityItemProps) => {
  const { chains } = useConfig()
  const chainUrl = useMemo(() => {
    return (
      chains.find((chain) => chain.id === metadata?.network)?.blockExplorers?.default.url ??
      undefined
    )
  }, [metadata, chains])

  // Use token symbol as fallback if tokenName is not present
  const displayName = tokenName || metadata?.symbol || ''

  const priceUSD =
    (metadata?.metadata?.priceUSD as number) && (metadata?.metadata?.priceUSD as number) > 0
      ? (metadata?.metadata?.priceUSD as number)
      : (((metadata?.priceUSD ?? 0) as unknown as number) ?? 0)
  return (
    <div className="w-[350px] h-[175px] flex flex-col justify-center items-center rounded-lg bg-bg-surface border border-stroke-grey-primary">
      <div className="w-full h-4/5 rounded-t-lg bg-[rgba(194,65,12,0.1)] dark:bg-bg-surface p-[16px] relative">
        <div className="absolute top-[16px] right-[16px]">
          <Badge variant="success">Pool</Badge>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full h-full flex justify-start items-center gap-3">
            <ImageGroup images={images} branches={branches} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full flex items-center justify-between gap-3">
                <Clipboard.Root className="flex items-center gap-1">
                  <Clipboard.Label className="w-full flex flex-col gap-1 justify-center items-start text-grey-primary text-base font-medium">
                    <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                      {displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName}
                    </span>
                    <div className="w-full text-start font-bold text-wrap flex gap-2 justify-start items-center">
                      <div className="w-full text-start text-wrap flex gap-2 justify-start items-end">
                        <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                          $
                          {priceUSD > 1
                            ? millify(priceUSD)
                            : formatWithZeroCountSubscript(priceUSD, 18)}
                        </span>
                      </div>
                    </div>
                  </Clipboard.Label>
                </Clipboard.Root>
              </div>
            </div>
          </div>
          <div className="w-full h-1/2 flex justify-center items-center">
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold">
                {metadata?.minApy === metadata?.maxApy
                  ? parseFloat(metadata?.minApy ?? 0).toFixed(2)
                  : `${parseFloat(metadata?.minApy ?? 0).toFixed(2)} - ${parseFloat(metadata?.maxApy ?? 0).toFixed(2)}`}{' '}%
              </span>
              <span className="text-xs opacity-50">APY</span>
            </div>
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold">
                $
                {metadata?.metadata?.tvl && Number(metadata?.metadata?.tvl) > 1
                  ? millify(Number(metadata?.metadata?.tvl))
                  : '0.00'}
              </span>
              <span className="text-xs opacity-50">TVL</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/5 rounded-b-lg bg-bg-primary p-[16px] flex justify-start items-center gap-3">
        {chainUrl && (
          <a href={`${chainUrl}/address/${metadata?.address}`} target="_blank">
            <ShareIcon className="text-foreground" />
          </a>
        )}
        {metadata?.url && (
          <a href={metadata?.url} target="_blank">
            <Avatar.Root className="w-3.5 h-3.5 inline-block rounded-full overflow-hidden">
              <div className="rounded-full w-full h-full flex items-center justify-center">
                {getProtocolIcon(metadata?.protocol, 'w-full h-full') || (
                  <div className="text-[8px]">P</div>
                )}
              </div>
            </Avatar.Root>
          </a>
        )}
        {metadata?.address.toString().toLowerCase() !==
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() && (
          <Clipboard.Root value={`${metadata?.address.toLowerCase()}`} className="font-bold">
            <Clipboard.Control>
              <Clipboard.Trigger className="size-4 flex items-center justify-center cursor-pointer active:scale-95 text-icon-subtle">
                <Clipboard.Indicator copied={<CopyIcon className="text-foreground" />}>
                  <CopyIcon className="text-foreground" />
                </Clipboard.Indicator>
              </Clipboard.Trigger>
            </Clipboard.Control>
          </Clipboard.Root>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * VaultItem
 * ---------------------------------------------------------------------------*/
type VaultItemProps = ImageGroupProps & {
  tokenName: string
  metadata: any
}

const VaultItem = ({ tokenName, metadata, images, branches }: LiquidityItemProps) => {
  const { chains } = useConfig()
  const chainUrl = useMemo(() => {
    return (
      chains.find((chain) => chain.id === metadata?.network)?.blockExplorers?.default.url ??
      undefined
    )
  }, [metadata, chains])

  // Use token symbol as fallback if tokenName is not present
  const displayName = tokenName || metadata?.symbol || ''
  const priceUSD =
    (metadata?.metadata?.priceUSD as number) && (metadata?.metadata?.priceUSD as number) > 0
      ? (metadata?.metadata?.priceUSD as number)
      : (((metadata?.priceUSD ?? 0) as unknown as number) ?? 0)

  return (
    <div className="w-[350px] h-[175px] flex flex-col justify-center items-center rounded-lg bg-bg-surface border border-stroke-grey-primary">
      <div className="w-full h-4/5 rounded-t-lg bg-[rgba(194,65,12,0.1)] dark:bg-bg-surface p-[16px] relative">
        <div className="absolute top-[16px] right-[16px]">
          <Badge variant="success">Vault</Badge>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full h-full flex justify-start items-center gap-3">
            <ImageGroup images={images} branches={branches} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="w-full flex items-center justify-between gap-3">
                <Clipboard.Root className="flex items-center gap-1">
                  <Clipboard.Label className="w-full flex flex-col gap-1 justify-center items-start text-grey-primary text-base font-medium">
                    <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                      {displayName.length > 15 ? `${displayName.slice(0, 15)}...` : displayName}
                    </span>
                    <div className="w-full text-start font-bold text-wrap flex gap-2 justify-start items-center">
                      <div className="w-full text-start text-wrap flex gap-2 justify-start items-end">
                        <span className="w-full text-start text-wrap flex gap-2 justify-between items-center">
                          $
                          {priceUSD > 1
                            ? millify(priceUSD)
                            : formatWithZeroCountSubscript(priceUSD, 18)}
                        </span>
                      </div>
                    </div>
                  </Clipboard.Label>
                </Clipboard.Root>
              </div>
            </div>
          </div>
          <div className="w-full h-1/2 flex justify-center items-center">
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold">
                {metadata?.minApy === metadata?.maxApy
                  ? parseFloat(metadata?.minApy ?? 0).toFixed(2)
                  : `${parseFloat(metadata?.minApy ?? 0).toFixed(2)} - ${parseFloat(metadata?.maxApy ?? 0).toFixed(2)}`}{' '}%
              </span>
              <span className="text-xs opacity-50">APY</span>
            </div>
            <div className="w-1/3 h-full flex flex-col justify-center items-center gap-1">
              <span className="text-xl font-bold">
                $
                {metadata?.metadata?.tvl && Number(metadata?.metadata?.tvl) > 1
                  ? millify(Number(metadata?.metadata?.tvl))
                  : '0.00'}
              </span>
              <span className="text-xs opacity-50">TVL</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-1/3 rounded-b-lg bg-bg-primary p-[16px] flex justify-start items-center gap-3">
        {chainUrl && (
          <a href={`${chainUrl}/address/${metadata?.address}`} target="_blank">
            <ShareIcon className="text-foreground" />
          </a>
        )}
        {metadata?.url && (
          <a href={metadata?.url} target="_blank">
            <Avatar.Root className="w-3.5 h-3.5 inline-block rounded-full overflow-hidden">
              <div className="rounded-full w-full h-full flex items-center justify-center">
                {getProtocolIcon(metadata?.protocol, 'w-full h-full') || (
                  <div className="text-[8px]">P</div>
                )}
              </div>
            </Avatar.Root>
          </a>
        )}
        {metadata?.address.toString().toLowerCase() !==
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase() && (
          <Clipboard.Root value={`${metadata?.address.toLowerCase()}`} className="font-bold">
            <Clipboard.Control>
              <Clipboard.Trigger className="size-4 flex items-center justify-center cursor-pointer active:scale-95 text-icon-subtle">
                <Clipboard.Indicator copied={<CopyIcon className="text-foreground" />}>
                  <CopyIcon className="text-foreground" />
                </Clipboard.Indicator>
              </Clipboard.Trigger>
            </Clipboard.Control>
          </Clipboard.Root>
        )}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------
 * TaggingMetadataContentComponent
 * ---------------------------------------------------------------------------*/

type TaggingMetadataContentComponentProps = ImageGroupProps & {
  value: string
  type: 'Token' | 'Pool' | 'Vault' | 'Lending' | 'Chain' | 'Protocol'
  metadata: any
}

const TaggingMetadataContent: React.FC<TaggingMetadataContentComponentProps> = ({
  value,
  type,
  images,
  branches,
  metadata,
}) => {
  const { chains } = useConfig()

  const usdFmt = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      maximumSignificantDigits: 1,
      roundingPriority: 'morePrecision',
      roundingMode: 'floor',
    })
  }, [])

  const [information, setInformation] = useState<any>(undefined)

  useEffect(() => {
    setInformation(metadata)
  }, [type, chains, metadata])

  return (
    <>
      {type === 'Chain' && (
        <ChainItem chainName={value} metadata={information} images={images} branches={branches} />
      )}
      {type === 'Protocol' && (
        <ProtocolItem
          protocolName={value}
          metadata={information}
          images={images}
          branches={branches}
        />
      )}
      {type === 'Token' && (
        <TokenItem tokenName={value} metadata={information} images={images} branches={branches} />
      )}
      {type === 'Lending' && (
        <LendingItem tokenName={value} metadata={information} images={images} branches={branches} />
      )}
      {type === 'Pool' && (
        <LiquidityItem
          tokenName={value}
          metadata={information}
          images={images}
          branches={branches}
        />
      )}
      {type === 'Vault' && (
        <VaultItem tokenName={value} metadata={information} images={images} branches={branches} />
      )}
    </>
  )
}

export default TaggingMetadataContent
