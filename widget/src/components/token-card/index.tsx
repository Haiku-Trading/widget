import { Avatar } from '@ark-ui/react'
import { RiAddLine, RiCloseLine, RiLockFill, RiLockUnlockFill } from '@remixicon/react'
import { useMediaQuery } from '@uidotdev/usehooks'
import BigNumber from 'bignumber.js'
import IMask, { type InputMask } from 'imask'
import millify from 'millify'
import React, { ComponentRef, forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { Address } from 'viem'
import { useConfig } from 'wagmi'
import { useShallow } from 'zustand/shallow'
import { categoriesNamesByType, categoriesTypesBadge, mappingErrorCodeMessage } from '../../constants/constants'
import { TokenType } from '../../enums/token-type'
import { TradeAlert } from '../../enums/trade-alert'
import { useTradeStore } from '../../providers'
import { useTokenBalanceQuery } from '../../queries'
import { useConcentratedPoolData } from '../../queries/concentrated-pool-data'
import { cn, tokenFormatter } from '../../utils'
import { calcConcentratedBalances, getUniswapV3PositionUSDValue } from '../../utils/concentratedPool'
import { MAX_TICK, MIN_TICK, nearestUsableTick } from '../../utils/uniswapV3'
import { getChainIcon } from '../../utils/chain-utils'
import { getInitials } from '../../utils/get-initials'
import { formatTokenAmount, formatWithZeroCountSubscript } from '../../utils/numberFormatting'
import { getProtocolIcon } from '../../utils/protocol-utils'
import { useStableCallback } from '../../utils/react-19-compat'
import { Badge } from '../badge'
import { useIsShortScreen } from '../dialog/chosen-token'
import CustomSlider from '../ruler-slider/CustomSlider'
import { Tooltip } from '../tooltip/tooltip'

/* ----------------------------------------------------------------------------
 * ImageGroup
 * ---------------------------------------------------------------------------*/

type ImageGroupProps = {
  images: ImageObject[]
  branches: ImageObject[]
}

type ImageObject = {
  src?: string
  symbol: string
  color?: string
}

const ImageGroup = (props: ImageGroupProps) => {
  const { branches, images } = props
  const config = useConfig()

  const [network, protocol] = branches

  const content = useMemo(() => {
    const names = []
    const chain = config.chains.find((chain) => chain.id === Number(network.symbol))
    if (chain) names.push(chain.name)

    if (protocol) {
      const protocolName = {
        AAVE_V3: 'Aave',
        BALANCER_V2: 'Balancer',
        BERAHUB: 'BeraHub',
        BEX: 'Bex',
        BERABORROW: 'BeraBorrow',
        BERAPAW: 'BeraPaw',
        INFRARED: 'Infrared',
        KODIAK_ISLAND: 'Kodiak Island',
        KODIAK_BAULTS: 'Kodiak Baults',
        CURVE: 'Curve',
        UNISWAP_V2: 'Uniswap V2',
        UNISWAP_V3: 'Uniswap V3',
        MORPHO: 'Morpho',
        HYPURRFI: 'Hypurrfi',
        HYPERLEND: 'HyperLend',
        PENDLE: 'Pendle',
        YEI: 'Yei',
        DRAGONSWAP_V2: 'Dragonswap V2',
        HYPERSWAP_V2: 'Hyperswap V2',
        HYPERSTABLE: 'Hyperstable',
        YEARN_FINANCE: 'Yearn Finance',
        FLUID: 'Fluid',
        BEND: 'Bend',
        QUICKSWAP_V3: 'Quickswap V3',
        HYBRA_V2: 'Hybra V2',
        HYBRA_V3: 'Hybra V3',
        HYPERSWAP_V3: 'Hyperswap V3',
        KINETIQ: 'Kinetiq',
        LAMINAR_V3: 'Laminar V3',
        PROJECTX_V3: 'ProjectX V3',
        STAKED_HYPE: 'Staked Hype',
      }[protocol.symbol]

      names.unshift(protocolName)
    }

    return names.join(' - ')
  }, [config.chains, network.symbol, protocol])

  return (
    <Tooltip
      content={content}
      className="bg-bg-surface border border-stroke-grey-primary rounded-lg p-2 text-sm text-grey-secondary"
    >
      <div className="flex -space-x-2 py-2 shrink-0 grow-0 isolate">
        {images.map((image, index) => {
          const isLastItem = index === images.length - 1
          const style = {
            zIndex: images.length - index,
            '--avatar-color': image.color ?? 'hsl(var(--bg-section) / 0.24)',
          } as React.CSSProperties

          return (
            <Avatar.Root
              key={`asset:${image.symbol}:${index}`}
              // className="block relative size-5 bg-[var(--avatar-color)] rounded-full"
              className="block relative w-[30px] h-[30px] bg-[var(--avatar-color)] rounded-full"
              style={style}
            >
              <Avatar.Image src={image.src} alt={image.symbol} className="rounded-full" />
              <Avatar.Fallback className="text-sm text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {getInitials(image.symbol)}
              </Avatar.Fallback>

              {isLastItem &&
                branches.map((branch, index) => (
                  <ImageBranch
                    key={`branch:${branch.symbol}:${index}`}
                    index={index}
                    branch={branch}
                  />
                ))}
            </Avatar.Root>
          )
        })}
      </div>
    </Tooltip>
  )
}

/* ----------------------------------------------------------------------------
 * ImageBranch
 * ---------------------------------------------------------------------------*/

type ImageBranchProps = {
  index: number
  branch: ImageObject
}

const ImageBranch = (props: ImageBranchProps) => {
  const { index, branch } = props

  if (index < 0 || index > 1) {
    return null
  }

  // Determine if this is a chain or protocol icon based on the symbol
  const isChainIcon = !isNaN(Number(branch.symbol))
  
  return (
    <div
      className={cn(
        'absolute block text-[0.625rem] size-[13px] rounded-full bg-secondary flex items-center justify-center',
        index === 0 ? '-bottom-[2px] -right-[1px] ' : '-top-[4px] -right-[1px] ',
      )}
    >
      {isChainIcon ? (
        getChainIcon(branch.symbol, 'w-full h-full', 13) || (
          <div className="w-full h-full flex items-center justify-center text-[8px]">
            {getInitials(branch.symbol)}
          </div>
        )
      ) : (
        getProtocolIcon(branch.symbol, 'w-full h-full', 13) || (
          <div className="w-full h-full flex items-center justify-center text-[8px]">
            {getInitials(branch.symbol)}
          </div>
        )
      )}
    </div>
  )
}

const getSmartDecimalLimit = (value: string, decimal: number) => {
  if (!value || typeof value !== 'string') return 6

  const str = value.toString()

  const match = str.match(/^0\.(0+)([1-9])/)

  if (match) {
    const consecutiveZeros = match[1].length
    return consecutiveZeros + 2
  }

  return decimal
}

const formatNumberFromScientific = (num: string): string => {
  // Handle scientific notation by converting to fixed decimal
  if (num.includes('e')) {
    // Use toFixed with enough precision to capture the full number
    const str = Number(num).toFixed(100)
    // Remove trailing zeros
    return str.replace(/\.?0+$/, '')
  }
  return num.toString()
}
const dollarMask = {
  mask: '$ num',
  blocks: {
    num: {
      mask: Number,
      thousandsSeparator: ',',
      radix: '.',
      mapRadixTo: '.',
      scale: 2,
      min: 0,
      max: 99999999999999999999999999999999,
    }
  }
}

const tokenMask = (decimal?: number, balance?: string, prefix?: string) => {
  const decimalLimit = Math.min(
    getSmartDecimalLimit(balance || '6', 6),
    decimal || getSmartDecimalLimit(balance || '6', 6),
  )
  
  if (prefix) {
    return {
      mask: `${prefix} num`,
      blocks: {
        num: {
          mask: Number,
          scale: decimalLimit,
          thousandsSeparator: '',
          radix: '.',
          mapRadixTo: '.',
          min: 0,
          max: 99999999999999999999999999999999,
          normalizeZeros: false,
          padFractionalZeros: false,
        }
      }
    }
  }
  
  return {
    mask: Number,
    scale: decimalLimit,
    thousandsSeparator: '',
    radix: '.',
    mapRadixTo: '.',
    min: 0,
    max: 99999999999999999999999999999999,
    normalizeZeros: false,
    padFractionalZeros: false,
  }
}

type AssetCardElement = ComponentRef<'div'>
type AssetCardProps = ImageGroupProps & {
  type: 'input' | 'output'
  iid: string
  usdPrice?: string
  address?: Address
  tokenDecimal?: number
  chainId: number
  tokenValue?: string
  className?: string
  disabled?: boolean
  //
  name: string
  symbol: string
  logoURL?: string
  network: number
  protocol?: string
  color?: string
  tokenCategory: TokenType
  //
  onInsufficientBalance?: (insufficientBalance: boolean, symbol: string) => void
  onValueChange?: (value: string, balance?: { balance: number; balanceUSD: number }) => void
  onDismiss?: () => void
  onOpenChosenTokens?: () => void
  setOpen?: any
  isLast?: boolean
  locked?: boolean
  percentage?: number
  showSlider?: boolean
  minApr?: string
  maxApr?: string
  showAddButton?: boolean
  isLocked?: boolean
}

export const AssetCard = forwardRef<AssetCardElement, AssetCardProps>(
  (
    {
      type,
      iid,
      usdPrice = '0',
      tokenValue = '0',
      tokenDecimal = 18,
      className,
      name,
      symbol,
      tokenCategory,
      onValueChange,
      onDismiss,
      onInsufficientBalance,
      onOpenChosenTokens,
      images,
      branches,
      setOpen,
      isLast,
      locked,
      percentage,
      showSlider,
      color,
      minApr,
      maxApr,
      showAddButton = true,
      isLocked = false,
    },
    ref,
  ) => {
    // Parse iid to extract tick range for CLAMM tokens
    let tokenIid = ''
    let lowerTick: string | undefined
    let upperTick: string | undefined
    if (tokenCategory === TokenType.ConcentratedLiquidity) {
      const [realIid, tickSpace] = iid.split('::')
      tokenIid = realIid
      if (tickSpace) {
        lowerTick = tickSpace.split(':')[0]
        upperTick = tickSpace.split(':')[1]
      }
    } else {
      tokenIid = iid
    }

    const tokenBalanceQuery = useTokenBalanceQuery(tokenIid)
    const { data: concentratedPoolData } = useConcentratedPoolData({
      iid: tokenIid,
      enable: tokenCategory === TokenType.ConcentratedLiquidity,
    })

    const toggleLock = useTradeStore((state) => state.toggleLock)
    const toggleSlider = useTradeStore((state) => state.toggleSlider)
    const outputTokens = useTradeStore((state) => state.outputTokens)
    const { isTokenView, setIsTokenView } = useTradeStore(
      useShallow((state) => ({
        isTokenView: state.isTokenView,
        setIsTokenView: state.setIsTokenView,
      })),
    )
    
    const inputRef = useRef<HTMLInputElement>(null)
    const maskRef = useRef<InputMask<any> | null>(null)

    const handlePercentageChange = useTradeStore((state) => state.handlePercentageChange)
    const isShortScreen = useIsShortScreen()
    const isMobile = useMediaQuery('(max-width: 500px)')

    // Calculate balance for CLAMM tokens
    const calcBalance =
      tokenCategory === TokenType.ConcentratedLiquidity
        ? calcConcentratedBalances((tokenBalanceQuery.data ?? {}) as any, lowerTick, upperTick)
        : tokenBalanceQuery.data
    const balance =
      tokenCategory === TokenType.ConcentratedLiquidity ? calcBalance.balanceUSD : calcBalance

    // const [isTokenView, setIsTokenView] = useState(true)
    const [usdValue, setUsdValue] = useState('0')
    const isShowBalance = useTradeStore((state) => state.isShowBalance)

    // Create stable callbacks to prevent React 19 re-render issues
    const stableOnDismiss = useStableCallback(() => {
      onDismiss?.()
      removeAlerts([
        {
          isActive: true,
          type: TradeAlert.Error,
          message: `You don't have enough funds to complete the transaction. (${symbol})`,
        },
      ])
      Object.keys(mappingErrorCodeMessage).forEach((key) => {
        removeAlerts([
          {
            isActive: true,
            type: TradeAlert.Error,
            message: mappingErrorCodeMessage[key],
          },
        ])
      })
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      if (tokenCategory === TokenType.ConcentratedLiquidity) {
        const usdValue = getUniswapV3PositionUSDValue({
          liquidity: BigInt(Math.floor(Number(value) || 0)),
          sqrtPriceX96: BigInt(concentratedPoolData?.sqrtPriceX96 || '0'),
          tickLower: Number(lowerTick),
          tickUpper: Number(upperTick),
          decimals0: concentratedPoolData?.token0.decimals || 18,
          decimals1: concentratedPoolData?.token1.decimals || 18,
          price0USD: parseFloat(concentratedPoolData?.token0PriceUSD ?? '0'),
          price1USD: parseFloat(concentratedPoolData?.token1PriceUSD ?? '0'),
        })
        if (isTokenView) {
          onValueChange?.(value, calcBalance)
          setUsdValue(usdValue.toString())
        } else {
          onValueChange?.(usdValue.toString(), calcBalance)
          setUsdValue(value.toString())
        }
        return
      }

      let truncatedValue = value.replace(/[^0-9.]/g, '')

      if (truncatedValue === '') {
        removeAlerts([
          {
            isActive: true,
            type: TradeAlert.Error,
            message: `You don't have enough funds to complete the transaction. (${symbol})`,
          },
        ])
      }

      truncatedValue = truncatedValue.replace(/^0+(?=\d)/, '')

      if (truncatedValue.startsWith('.')) {
        truncatedValue = '0' + truncatedValue
      }

      if (isTokenView) {
        onValueChange?.(truncatedValue, calcBalance)
        const usdVal = BigNumber(truncatedValue || '0').multipliedBy(usdPrice)
        setUsdValue(usdVal.isEqualTo('0') ? '0.00' : usdVal.toFixed())
      } else {
        const tokenAmount = BigNumber(truncatedValue || 0)
          .dividedBy(usdPrice)
          .toFixed(tokenDecimal, BigNumber.ROUND_DOWN)

        onValueChange?.(tokenAmount, calcBalance)
        setUsdValue(truncatedValue)
      }
    }

    const toggleView = () => {
      if (isTokenView) {
        const usdValue = BigNumber(tokenValue).multipliedBy(usdPrice)
        setUsdValue(usdValue.isEqualTo('0') ? '0.00' : usdValue.toFixed())
      } else {
        const tokenAmount = BigNumber(usdValue)
          .dividedBy(usdPrice)
          .toFixed(tokenDecimal, BigNumber.ROUND_DOWN)

        onValueChange?.(
          tokenFormatter.fullValue(tokenDecimal).format(tokenAmount).replaceAll(',', ''),
        )
      }

      setIsTokenView(!isTokenView)
    }

    const formatToUsd = (amount: string | number) => {
      return Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        amount as number,
      )
    }


    const oppositeValue = useMemo(() => {
      let priceUSD = usdPrice || '0'
      if (tokenCategory === TokenType.ConcentratedLiquidity) {
        if (type === 'input') {
          priceUSD = '1'
        } else {
          const usdValue = getUniswapV3PositionUSDValue({
            liquidity: BigInt(Math.floor(Number(tokenValue) || 0)),
            sqrtPriceX96: BigInt(concentratedPoolData?.sqrtPriceX96 || '0'),
            tickLower: Number(lowerTick),
            tickUpper: Number(upperTick),
            decimals0: concentratedPoolData?.token0.decimals || 18,
            decimals1: concentratedPoolData?.token1.decimals || 18,
            price0USD: parseFloat(concentratedPoolData?.token0PriceUSD ?? '0'),
            price1USD: parseFloat(concentratedPoolData?.token1PriceUSD ?? '0'),
          })
          if (Number(usdValue) && Number(tokenValue)) {
            setUsdValue(usdValue.toString())
            priceUSD = Number(parseFloat(usdValue.toString()) / Number(tokenValue)).toString()
          }
        }
      }

      const tokenVal =
        tokenCategory === TokenType.ConcentratedLiquidity
          ? BigNumber(tokenValue || '0').multipliedBy(priceUSD)
          : BigNumber(tokenValue || '0')
      const usdVal =
        tokenCategory === TokenType.ConcentratedLiquidity
          ? tokenVal
          : tokenVal.multipliedBy(priceUSD)
      const tokenRounded = tokenVal.toFixed(
        getSmartDecimalLimit(tokenVal.toString(), 8),
        BigNumber.ROUND_DOWN,
      )

      if (isTokenView) {
        return formatToUsd(usdVal.toFixed(8, BigNumber.ROUND_DOWN))
      }
      return formatTokenAmount(Number(tokenRounded), Number(priceUSD) || 0)
    }, [isTokenView, usdPrice, tokenDecimal, tokenValue, tokenCategory, type, concentratedPoolData, lowerTick, upperTick])

    const oppositeOutputValue = useMemo(() => {
      let priceUSD = usdPrice || '0'
      if (tokenCategory === TokenType.ConcentratedLiquidity) {
        const usdValue = getUniswapV3PositionUSDValue({
          liquidity: BigInt(Math.floor(Number(tokenValue) || 0)),
          sqrtPriceX96: BigInt(concentratedPoolData?.sqrtPriceX96 || '0'),
          tickLower: Number(lowerTick),
          tickUpper: Number(upperTick),
          decimals0: concentratedPoolData?.token0.decimals || 18,
          decimals1: concentratedPoolData?.token1.decimals || 18,
          price0USD: parseFloat(concentratedPoolData?.token0PriceUSD ?? '0'),
          price1USD: parseFloat(concentratedPoolData?.token1PriceUSD ?? '0'),
        })
        if (Number(usdValue) && Number(tokenValue)) {
          priceUSD = Number(parseFloat(usdValue.toString()) / Number(tokenValue)).toString()
        }
      }

      const tokenVal =
        tokenCategory === TokenType.ConcentratedLiquidity
          ? BigNumber(tokenValue || '0').multipliedBy(priceUSD)
          : BigNumber(tokenValue || '0')
      const usdVal =
        tokenCategory === TokenType.ConcentratedLiquidity
          ? tokenVal
          : tokenVal.multipliedBy(priceUSD)
      const tokenRounded = tokenVal.toFixed(
        getSmartDecimalLimit(tokenVal.toString(), 8),
        BigNumber.ROUND_DOWN,
      )

      if (!isTokenView) {
        return formatToUsd(usdVal.toFixed(8, BigNumber.ROUND_DOWN))
      }
      return formatTokenAmount(Number(tokenRounded), Number(priceUSD) || 0)
    }, [isTokenView, usdPrice, tokenDecimal, tokenValue, tokenCategory, concentratedPoolData, lowerTick, upperTick])

    const usdBalance = useMemo(() => {
      return tokenCategory === TokenType.ConcentratedLiquidity
        ? calcBalance.balanceUSD
        : BigNumber(balance).multipliedBy(usdPrice).toFixed()
    }, [balance, usdPrice, tokenCategory, calcBalance])

    const { removeAlerts, addMoreAlerts } = useTradeStore(useShallow((state) => state))

    const isInsufficientBalance = useMemo(() => {
      let isGreaterThan = false

      if (isTokenView) {
        if (!tokenValue || tokenValue === 'NaN') return false
        const usdTokenValue = BigNumber(tokenValue).multipliedBy(usdPrice)
        isGreaterThan = usdTokenValue.abs().isGreaterThan(BigNumber(usdBalance).abs())
      } else {
        isGreaterThan = BigNumber(usdValue || '0')
          .abs()
          .isGreaterThan(BigNumber(usdBalance).abs())
      }

      return isGreaterThan
    }, [balance, isTokenView, tokenValue, type, usdBalance, usdPrice, usdValue])

    // Handle alert updates in useEffect to avoid setState during render
    // Use React 19 safe pattern with stable callbacks
    useEffect(() => {
      if (type === 'input') {
        const alertMessage = `You don't have enough funds to complete the transaction. (${symbol})`
        
        if (isInsufficientBalance) {
          addMoreAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message: alertMessage,
            },
          ])
        } else {
          removeAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message: alertMessage,
            },
          ])
        }
      }
    }, [isInsufficientBalance, type, symbol, addMoreAlerts, removeAlerts])

    useEffect(() => {
      if (!name) return
      onInsufficientBalance?.(isInsufficientBalance, name)
    }, [name, isInsufficientBalance, onInsufficientBalance])

    useEffect(() => {
      if (isTokenView) {
        const usdValue = BigNumber(tokenValue).multipliedBy(usdPrice)
        setUsdValue(usdValue.isEqualTo('0') ? '0.00' : usdValue.toFixed())
      } else {
        const tokenAmount = BigNumber(usdValue)
          .dividedBy(usdPrice)
          .toFixed(tokenDecimal, BigNumber.ROUND_DOWN)

        if (type === 'input') {
          onValueChange?.(
            tokenFormatter.fullValue(tokenDecimal).format(tokenAmount).replaceAll(',', ''),
          )
        }
      }

      // setIsTokenView(!isTokenView)
    }, [isTokenView, tokenDecimal, tokenValue, type, usdPrice, usdValue])

    const inputValue = isTokenView ? tokenValue : usdValue

    // Initialize and update mask when view changes
    useEffect(() => {
      if (!inputRef.current) return

      // Destroy existing mask
      if (maskRef.current) {
        maskRef.current.destroy()
        maskRef.current = null
      }

      // Create new mask based on current view
      const prefix = tokenCategory === TokenType.VarDebt ? '-' : undefined
      const maskOptions = isTokenView ? tokenMask(tokenDecimal || 2, inputValue, prefix) : dollarMask
      maskRef.current = IMask(inputRef.current, maskOptions)

      // Set initial value
      if (inputValue && inputValue !== '0') {
        maskRef.current.unmaskedValue = inputValue
      }

      // Handle value changes
      maskRef.current.on('accept', () => {
        const unmaskedValue = maskRef.current?.unmaskedValue || '0'
        handleInputChange({
          target: { value: unmaskedValue },
          preventDefault: () => {},
          stopPropagation: () => {},
          persist: () => {},
        } as unknown as React.ChangeEvent<HTMLInputElement>)
      })

      return () => {
        if (maskRef.current) {
          maskRef.current.destroy()
          maskRef.current = null
        }
      }
    }, [isTokenView, tokenDecimal, inputValue, tokenCategory])

    const formatAPR = (minApr: string, maxApr: string) => {
      if (minApr === maxApr) {
        return Number(minApr) < 0.01 ? '< 0.01%' : `${millify(Number(minApr), { precision: 2 })}%`
      }

      if (Number(minApr) < 0.01 && Number(maxApr) < 0.01) {
        return '< 0.01%'
      }

      if (Number(minApr) < 0.01) {
        return `< 0.01% - ${millify(Number(maxApr), { precision: 2 })}%`
      }

      if (Number(maxApr) < 0.01) {
        return `${millify(Number(minApr), { precision: 2 })}% - < 0.01$`
      }
      return `${millify(Number(minApr), { precision: 2 })}% - ${millify(Number(maxApr), { precision: 2 })}%`
    }

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 w-full bg-bg-surface flex items-start justify-start flex-col relative rounded-2xl group',
          // 'hover:bg-[#494949]',
          type === 'input' && isInsufficientBalance && 'border-failed',
          className,
        )}
        onMouseEnter={() => {
          // Check if user is at bottom of scroll container and add temporary padding if so
          const scrollContainer = document.querySelector('.trade-body-scroll') as HTMLElement
          if (scrollContainer) {
            // Only apply logic if container is actually scrollable
            const isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight
            if (isScrollable) {
              const isAtBottom =
                scrollContainer.scrollTop >=
                scrollContainer.scrollHeight - scrollContainer.clientHeight - 1
              if (isAtBottom) {
                // Add temporary padding to prevent "upward expansion" and force card to expand downwards
                scrollContainer.style.paddingBottom = '1px'
              }
            }
          }
          toggleSlider(iid, type)
        }}
        onMouseLeave={() => {
          // Remove temporary padding
          const scrollContainer = document.querySelector('.trade-body-scroll') as HTMLElement
          if (scrollContainer) {
            scrollContainer.style.paddingBottom = ''
          }
          toggleSlider(iid, type)
        }}
      >
        {!isLocked && (
          <button
            onClick={stableOnDismiss}
            className="bg-state-error-default size-5 rounded-full flex items-center justify-center absolute -top-2 -right-2 invisible group-hover:visible re"
          >
            <RiCloseLine size={16} />
          </button>
        )}

        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-start justify-center flex-col gap-1">
            <div className="flex items-center gap-2">
              <button
                className="bg-bg-section  rounded-[18px] h-10 px-[4px] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onOpenChosenTokens}
                disabled={isLocked}
              >
                <ImageGroup images={images} branches={branches} />
                <p className="text-sm  font-medium whitespace-nowrap text-foreground">
                  {isMobile && symbol.length > 5
                    ? `${symbol.slice(0, 5)}...`
                    : categoriesNamesByType[tokenCategory] === 'Liquidity' ||
                      categoriesNamesByType[tokenCategory] === 'Concentrated'
                      ? `${symbol.slice(0, 9)}...`
                      : symbol.length > 16
                        ? `${symbol.slice(0, 16)}...`
                        : symbol}
                </p>
                <div className="flex items-center justify-center gap-2">
                  {categoriesNamesByType[tokenCategory] !== 'Token' && (
                    <Badge variant={categoriesTypesBadge[tokenCategory]}>
                      {tokenCategory === TokenType.ConcentratedLiquidity && type === 'output'
                        ? lowerTick &&
                          upperTick &&
                          concentratedPoolData &&
                          Number(lowerTick) ===
                            nearestUsableTick(MIN_TICK, concentratedPoolData?.tickSpacing) &&
                          Number(upperTick) ===
                            nearestUsableTick(MAX_TICK, concentratedPoolData?.tickSpacing)
                          ? 'CLAMM Full'
                          : 'CLAMM Custom'
                        : categoriesNamesByType[tokenCategory]}
                    </Badge>
                  )}
                </div>
              </button>
              {isLast && showAddButton && !isLocked && (
                <button
                  className="size-[30px] rounded-full flex items-center justify-center bg-bg-surface border border-stroke-grey-secondary"
                  onClick={() => setOpen(true)}
                >
                  <RiAddLine size={14} className="text-foreground" />
                </button>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <span
                onClick={() =>
                  handleInputChange({
                    target: {
                      value: isTokenView ? balance : usdBalance,
                    },
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    persist: () => {},
                  } as unknown as React.ChangeEvent<HTMLInputElement>)
                }
                className="text-sm text-grey-secondary whitespace-nowrap cursor-pointer hover:cursor-pointer"
              >
                Balance: {tokenCategory === TokenType.ConcentratedLiquidity && '$'}
                {isShowBalance
                  ? balance
                    ? Number(formatTokenAmount(Number(balance), Number(usdPrice) || 0)) < 1
                      ? formatWithZeroCountSubscript(
                          Number(formatTokenAmount(Number(balance), Number(usdPrice) || 0)),
                          18,
                        )
                      : millify(Number(formatTokenAmount(Number(balance), Number(usdPrice) || 0)))
                    : '0'
                  : '***'}
              </span>
              {type === 'output' && outputTokens.length > 1 && (<div className="flex items-center gap-1">
                  <span style={{ color }} className="text-[14px] font-normal">
                    {percentage}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const N = outputTokens.length
                      const lockedCount = outputTokens.filter(
                        (token) => token.locked === true,
                      ).length
                      const maxLockable = Math.max(0, N - 2)

                      if (N === 2) {
                        return
                      }

                      if (!locked) {
                        if (lockedCount < maxLockable) {
                          toggleLock(iid)
                        }
                      } else {
                        toggleLock(iid)
                      }
                    }}
                    className={`p-1 rounded ${
                      locked ? 'text-blue-600 bg-blue-100' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {locked ? <RiLockFill size={16} /> : <RiLockUnlockFill size={16} />}
                  </button>
                </div>)}
             </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-1">
            {type === 'input' &&(
              <input
                ref={inputRef}
                style={{ textAlign: 'right', marginTop: '3px' }}
                className={cn(
                  `text-[32px] font-medium outline-none bg-transparent w-full max-w-[75%] h-7 placeholder:text-grey-secondary disabled:text-muted-foreground`,
                  Number(inputValue) > Math.abs(Number(isTokenView ? balance : usdBalance))
                    ? 'text-failed'
                    : 'text-grey-secondary',
                )}
                placeholder="0.00"
                onClick={(e) => e.stopPropagation()}
              />
            ) }

            {type === 'output' && (
              <p
                style={{ padding: '0px', marginTop: '3px' }}
                className={cn(
                  'text-grey-medium text-[32px] font-medium leading-none text-nowrap',
                  formatWithZeroCountSubscript(oppositeOutputValue, 8) === '0'
                    ? 'text-grey-medium'
                    : 'text-grey-secondary',
                )}
              >
                {formatWithZeroCountSubscript(oppositeOutputValue, 8) === '0'
                  ? '0.00'
                  : isTokenView
                    ? categoriesNamesByType[tokenCategory] === 'Liquidity' ||
                      categoriesNamesByType[tokenCategory] === 'Concentrated'
                      ? (() => {
                          const liquidityValue =
                            tokenCategory === TokenType.ConcentratedLiquidity
                              ? Number(oppositeOutputValue)
                              : Number(
                                  formatTokenAmount(Number(tokenValue || 0), Number(usdPrice) || 0),
                                )
                          return Number(liquidityValue) < 1
                            ? formatWithZeroCountSubscript(Number(liquidityValue), 18)
                            : millify(Number(liquidityValue))
                        })()
                      : Number(
                          formatTokenAmount(Number(tokenValue || 0), Number(usdPrice) || 0),
                        ) < 1
                        ? formatWithZeroCountSubscript(
                            Number(
                              formatTokenAmount(Number(tokenValue || 0), Number(usdPrice) || 0),
                            ),
                            18,
                          )
                        : millify(
                            Number(
                              formatTokenAmount(Number(tokenValue || 0), Number(usdPrice) || 0),
                            ),
                          )
                    : oppositeOutputValue}
              </p>
            )}

            <div className="flex items-center gap-1 mt-[5px]">
              <p className="text-grey-secondary text-14px-normal">
                {tokenCategory == TokenType.VarDebt && '-'}
                {isShowBalance ? formatWithZeroCountSubscript(oppositeValue, 8) : '$***'}
              </p>
            </div>
            {minApr && maxApr && (
              <div className="flex items-center gap-1">
                <p className="text-grey-medium text-14px-normal text-nowrap">
                  {formatAPR(minApr ?? '0', maxApr ?? '0')} APY
                </p>
              </div>
            )}
          </div>
        </div>

        {/*{showSlider && !locked && (*/}
        {!locked && !isLocked && (
          <div
            className={
              'mt-2 w-full overflow-hidden transition-all duration-[1000ms] ease-in-out max-h-0 group-hover:max-h-32'
            }
          >
            {(type === 'input' || (type === 'output' && outputTokens.length > 1)) && (
              <CustomSlider
                value={
                  type === 'output'
                    ? (percentage ?? 0)
                    : inputValue == balance
                      ? 100
                      : Math.round(
                          (Number(inputValue) * 100) /
                            Number(
                              new BigNumber(isTokenView ? balance : usdBalance).abs().toString(),
                            ),
                        )
                }
                onChange={(e) => {
                  if (type === 'output') {
                    handlePercentageChange(iid, e)
                    return
                  }

                  BigNumber.config({ DECIMAL_PLACES: 100 })
                  const base = isTokenView ? BigNumber(balance) : BigNumber(usdBalance)
                  const calculatedValue = base.multipliedBy(e).dividedBy(100)
                  const newValue =
                    e === 100
                      ? isTokenView
                        ? balance
                        : usdBalance
                      : formatNumberFromScientific(calculatedValue.toString())

                  handleInputChange({
                    target: { value: newValue },
                    preventDefault: () => {},
                    stopPropagation: () => {},
                    persist: () => {},
                  } as unknown as React.ChangeEvent<HTMLInputElement>)
                }}
              />
            )}
          </div>
        )}

        {/* ADD BUTTON */}
        {/* {isLast && (
          <button
            className="size-[30px] rounded-full flex items-center justify-center bg-bg-surface border border-stroke-grey-secondary absolute bottom-[-15px] left-1/2 -translate-x-1/2"
            onClick={() => setOpen(true)}
          >
            <RiAddLine size={14} className="text-foreground" />
          </button>
        )} */}
      </div>
    )
  },
)

AssetCard.displayName = 'AssetCard'
