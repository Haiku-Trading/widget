/* eslint-disable @typescript-eslint/no-explicit-any */

import CloseIcon from './../../icons/close.svg'
import MagniferIcon from './../../icons/magnifer.svg'
import { getInitials } from '../../utils/get-initials'
import { Dialog } from '../dialog'
import { cn } from '../../utils'
import { Tooltip } from '../tooltip/tooltip'
import { TextField } from '../text-field'
import { ToggleGroup } from '../toggle-group'
import { Button } from '../button/button'
import { useClassicTokensBalancesQuery, useTokenBalanceQuery } from '../../queries'
import { Avatar } from '@ark-ui/react'
import BigNumber from 'bignumber.js'
import { Coins, TrendingUp, Triangle } from 'lucide-react'
import { matchSorter } from 'match-sorter'
import { HoverCard } from 'radix-ui'
import {
  ComponentProps,
  ElementRef,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import { useConfig } from 'wagmi'
import { useShallow } from 'zustand/shallow'
import { TokenCategory, categoriesNames, categoriesOrigNames, tokenBadge } from '../../constants/constants'
import { useTradeStore } from '../../providers'
import { useGetTokensQuery } from '../../queries'
import {
  APICollateralToken,
  APIToken,
  APIVarDebtToken,
  APIVaultToken,
  APIWeightedLiquidityToken,
} from '../../services/get-tokens'
import { Badge } from '../badge'
import { Card } from '../card'

import TaggingMetadataContent from '../tagging/components/tagging-metadata-content'
import millify from 'millify'
import { TokenType } from '../../enums/token-type'
import { enrichWeightedTokensWithLogos } from '../../utils/common'
import { formatTokenAmount } from '../../utils/numberFormatting'
import { ChainSelect } from '../selector/chain-select'
import { FilterSelect } from '../selector/filter-select'
import { MobileChainSelect } from '../selector/mobile-chain-select'
import { MobileProtocolSelect } from '../selector/mobile-protocol-select'
import { ProtocolSelect } from '../selector/protocol-select'

interface APITokenWithBalance extends APIToken {
  balance: string
}

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
  doubleImages?: string[]
}

export type FilterType = {
  sort: 'default' | 'marketCap' | 'volume' | 'fdv' | 'apy' | 'priceChange' | 'tvl'
  order: 'descending' | 'ascending'
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
        MORPHO: 'Morpho',
        HYPURRFI: 'Hypurrfi',
        HYPERLEND: 'HyperLend',
        PENDLE: 'Pendle',
        YEI: 'Yei',
        DRAGONSWAP_V2: 'Dragonswap V2',
        HYPERSWAP_V2: 'Hyperswap V2',
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
            '--avatar-color': image.color ?? '#0000003d',
          } as React.CSSProperties

          return (
            <Avatar.Root
              key={`asset:${image.symbol}:${index}`}
              className="block relative size-10 bg-[var(--avatar-color)] rounded-full"
              style={style}
            >
              <Avatar.Image
                src={image.src}
                alt={image.symbol}
                className="rounded-full w-full h-full"
              />
              <Avatar.Fallback className="text-sm text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {getInitials(image.symbol)}
              </Avatar.Fallback>

              {/* {image.doubleImages &&
              image.doubleImages.length >= 2 &&
              image.doubleImages[0]?.trim() &&
              image.doubleImages[1]?.trim() ? (
                // Render double images when doubleImages field exists
                <>
                  <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-full overflow-hidden">
                    <Avatar.Image
                      src={image.doubleImages[0]}
                      alt={`${image.symbol}-1`}
                      className="rounded-full w-full h-full"
                    />
                    <Avatar.Fallback className="text-sm text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {getInitials(image.symbol)}
                    </Avatar.Fallback>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3/4 h-3/4 rounded-full overflow-hidden">
                    <Avatar.Image
                      src={image.doubleImages[1]}
                      alt={`${image.symbol}-2`}
                      className="rounded-full w-full h-full"
                    />
                    <Avatar.Fallback className="text-sm text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {getInitials(image.symbol)}
                    </Avatar.Fallback>
                  </div>
                </>
              ) : (
                <>
                  <Avatar.Image
                    src={image.src}
                    alt={image.symbol}
                    className="rounded-full w-full h-full"
                  />
                  <Avatar.Fallback className="text-sm text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {getInitials(image.symbol)}
                  </Avatar.Fallback>
                </>
              )} */}

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

  return (
    <Avatar.Root
      className={cn(
        'absolute block text-[0.625rem] size-5 rounded-full bg-secondary',
        index === 0 ? '-bottom-1.5 -right-1.5' : '-top-1.5 -right-1.5',
      )}
    >
      <Avatar.Image
        src={branch.src}
        className="w-full h-full relative rounded-full"
        draggable={false}
      />
      <Avatar.Fallback className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {getInitials(branch.symbol)}
      </Avatar.Fallback>
    </Avatar.Root>
  )
}
type DivElement = ElementRef<'div'>
type DivProps = ComponentProps<'div'>
const List = forwardRef<DivElement, DivProps>((props, ref) => {
  const { className, ...divProps } = props
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-1 p-4', className)} {...divProps} ref={ref} />
  )
})
List.displayName = 'List'

type FilterTokensProps = {
  search: string
  selectedCategories: string[]
  tokens: APIToken[]
  collateralTokens: APICollateralToken[]
  varDebtTokens: APIVarDebtToken[]
  weightedLiquidityTokens: APIWeightedLiquidityToken[]
  vaultTokens: APIVaultToken[]
}

type ChosenTokenDialogContentProps = {
  type: 'input' | 'output'
  onSelectTokens?: (tokens: APIToken[]) => void
}

// Hook to detect if viewport height is 800px or less
export function useIsShortScreen() {
  const [isShort, setIsShort] = useState(false)
  useEffect(() => {
    const check = () => setIsShort(window.innerHeight <= 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isShort
}

export function ChosenTokenDialogContent({ type, onSelectTokens }: ChosenTokenDialogContentProps) {
  const getTokensQuery = useGetTokensQuery()
  const tokenBalancesQuery = useClassicTokensBalancesQuery()

  const allTokensSelected = useTradeStore(
    useShallow((state) => state.inputTokens.concat(state.outputTokens)),
  )
  const selectedOutputToken = useTradeStore((state) => state.outputTokens)
  const inputChainIds = useTradeStore(
    useShallow((state) => Array.from(new Set(state.inputChainIds))),
  )
  const outputChainIds = useTradeStore(
    useShallow((state) => Array.from(new Set(state.outputChainIds))),
  )

  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all'])
  const [chainValue, setChainValue] = useState('all-chains')
  const [protocolValue, setProtocolValue] = useState<string[]>([''])
  const [selectedTokens, setSelectedTokens] = useState<APIToken[]>([])
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null)
  const [filter, selectFilter] = useState<FilterType>({ sort: 'default', order: 'descending' })

  const tokens = useMemo(
    () => getTokensQuery?.data?.tokenList.tokens || [],
    [getTokensQuery?.data?.tokenList.tokens],
  )
  const collateralTokens = useMemo(
    () => getTokensQuery?.data?.tokenList.collateralTokens || [],
    [getTokensQuery?.data?.tokenList.collateralTokens],
  )
  const varDebtTokens = useMemo(
    () => getTokensQuery?.data?.tokenList.varDebtTokens || [],
    [getTokensQuery?.data?.tokenList.varDebtTokens],
  )
  const vaultTokens = useMemo(
    () => getTokensQuery?.data?.tokenList.vaultTokens || [],
    [getTokensQuery?.data?.tokenList.vaultTokens],
  )
  const weightedLiquidityTokens = useMemo(
    () =>
      enrichWeightedTokensWithLogos(
        getTokensQuery?.data?.tokenList.weightedLiquidityTokens || [],
        tokens as any,
      ),
    [getTokensQuery?.data?.tokenList.weightedLiquidityTokens, tokens],
  )

  const balances = useMemo(() => {
    if (!tokenBalancesQuery.data) return {} as Record<string, number>
    return tokenBalancesQuery.data.wallet_positions
  }, [tokenBalancesQuery.data])

  const filterTokens = ({
    search,
    selectedCategories,
    tokens,
    collateralTokens,
    varDebtTokens,
    vaultTokens,
    weightedLiquidityTokens,
  }: FilterTokensProps) => {
    function removeSelectedTokens(token: { iid: string }) {
      return !allTokensSelected.some((tokenSelected) => tokenSelected.iid === token.iid)
    }
    function removeOutputToken(token: { iid: string }) {
      return !selectedOutputToken.some((tokenSelected) => tokenSelected.iid === token.iid)
    }

    function isVarDebtAPIToken<T>(token: T | APIVarDebtToken): token is APIVarDebtToken {
      return (token as APIVarDebtToken).primaryColor !== undefined
    }

    function sortTokensByBalanceAndSymbol<T>(tokens: (T & { balance: string })[], order: boolean) {
      return tokens.sort((a, b) => {
        const balanceA = new BigNumber(a.balance).abs().toNumber()
        const balanceB = new BigNumber(b.balance).abs().toNumber()

        return order ? balanceB - balanceA : balanceA - balanceB
      })
    }

    const addBalanceToTokens = (tokens: (APIToken | APICollateralToken | APIVarDebtToken)[]) => {
      return tokens.map((token) => {
        const balance = BigNumber(balances[token.iid] || 0)
          .multipliedBy(token.priceUSD || 0)
          .toFixed()
        return {
          ...token,
          balance: isNaN(Number(balance)) ? '0' : balance,
        }
      })
    }

    const filteredTokens = (() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let tokensWithBalance: any[] = []

      if (selectedCategories.includes('all')) {
        tokensWithBalance = addBalanceToTokens(
          tokens
            .concat(collateralTokens)
            .concat(varDebtTokens)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .concat(vaultTokens as any)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .concat(weightedLiquidityTokens as any),
        )
      } else {
        // Combine tokens from all selected categories
        if (selectedCategories.includes('token')) {
          tokensWithBalance = tokensWithBalance.concat(addBalanceToTokens(tokens))
        }
        if (selectedCategories.includes('collateral')) {
          tokensWithBalance = tokensWithBalance.concat(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            addBalanceToTokens(collateralTokens.concat(varDebtTokens as any)),
          )
        }
        if (selectedCategories.includes('weightedLiquidity')) {
          tokensWithBalance = tokensWithBalance.concat(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            addBalanceToTokens(weightedLiquidityTokens as any),
          )
        }
        if (selectedCategories.includes('vault')) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tokensWithBalance = tokensWithBalance.concat(addBalanceToTokens(vaultTokens as any))
        }
        if (selectedCategories.includes('varDebt')) {
          tokensWithBalance = tokensWithBalance.concat(
            addBalanceToTokens(varDebtTokens).filter(isVarDebtAPIToken),
          )
        }
        if (selectedCategories.includes('pendle')) {
          tokensWithBalance = tokensWithBalance.concat(
            addBalanceToTokens(tokens).filter(
              (token) =>
                token.symbol.startsWith('PT-') ||
                token.symbol.startsWith('YT-') ||
                token.symbol.startsWith('YT-'),
            ),
          )
        }
      }

      const sortedTokens = sortTokensByBalanceAndSymbol(
        tokensWithBalance,
        filter.order === 'descending',
      )

      // const tokensHasBalance = sortedTokens.filter((token) =>
      //   BigNumber(Math.abs(token.balance)).isGreaterThan(0),
      // )

      // const tokensNonBalance = sortedTokens.filter((token) => BigNumber(token.balance).isEqualTo(0))

      // function sortByBerachain(a: APITokenWithBalance) {
      //   return a.network === Chain.BeraChain && BigNumber(a.balance).isEqualTo(0) ? -1 : 1
      //    const volumeA = a?.metadata?.volume24h || 0
      // }

      function sortByVolume(a: APITokenWithBalance, b: APITokenWithBalance) {
        const volumeA = a?.metadata?.volume24h || 0
        const volumeB = b?.metadata?.volume24h || 0

        return Number(volumeB) - Number(volumeA)
      }

      let orderedTokens = sortedTokens.sort(sortByVolume)
      // let orderedTokens = sortedTokens.sort(sortByBerachain)

      const selectedNetworks = selectedTokens.map((token) => token.network)
      const networks = Array.from(new Set(inputChainIds.concat(selectedNetworks)))
      if (type === 'input' && networks.length > 0) {
        // Move enabled tokens to top and disabled tokens to bottom
        const [selectedChainId] = networks

        const [enabledTokens, disabledTokens] = orderedTokens.reduce(
          ([enabledTokens, disabledTokens], token) => {
            if (token.network === selectedChainId) {
              return [enabledTokens.concat(token), disabledTokens]
            }
            return [enabledTokens, disabledTokens.concat(token)]
          },
          [[] as APITokenWithBalance[], [] as APITokenWithBalance[]],
        )

        orderedTokens = [...enabledTokens, ...disabledTokens]
      }

      // const tokensWithoutBalance = orderedTokens.map(
      //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   ({ balance, ...rest }) => rest,
      // )

      //FILTER BY CHAIN
      const tokenFilterByChain =
        chainValue === 'all-chains'
          ? orderedTokens
          : orderedTokens.filter((token) => token?.network?.toString() === chainValue)

      //FILTER BY PROTOCOL
      let tokenFilterByProtocol =
        protocolValue.length === 0 || (protocolValue.length === 1 && protocolValue[0] === '')
          ? tokenFilterByChain
          : tokenFilterByChain.filter((token) => {
              const tokenProtocol = token?.protocol?.toString() || ''
              // Only include tokens that have a protocol AND match the selected protocols
              return tokenProtocol && protocolValue.includes(tokenProtocol)
            })

      tokenFilterByProtocol = matchSorter(tokenFilterByProtocol, search, {
        keys: ['name', 'symbol', 'address'],
        baseSort: (a, b) => a.index - b.index,
      })

      if (filter.sort === 'volume') {
        const sorted = tokenFilterByProtocol.sort((a, b) => {
          const volumeA = a?.metadata?.volume24h || 0
          const volumeB = b?.metadata?.volume24h || 0

          if (a.type === TokenType.Token && b.type !== TokenType.Token) return -1
          if (b.type === TokenType.Token && a.type !== TokenType.Token) return 1
          return filter.order === 'descending' ? volumeB - volumeA : volumeA - volumeB
        })

        return process.env.VERCEL_ENV === 'production'
          ? sorted.filter((token) => {
              const excludedChainIds = [10, 130]
              const excludedProtocols = ['PENDLE']
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : sorted
      }

      if (filter.sort === 'marketCap') {
        const sorted = tokenFilterByProtocol.sort((a, b) => {
          const marketCapA = Number(a?.metadata?.mcap) || 0
          const marketCapB = Number(b?.metadata?.mcap) || 0
          if (a.type === TokenType.Token && b.type !== TokenType.Token) return -1
          if (b.type === TokenType.Token && a.type !== TokenType.Token) return 1
          return filter.order === 'descending' ? marketCapB - marketCapA : marketCapA - marketCapB
        })

        return process.env.VERCEL_ENV === 'production'
          ? sorted.filter((token) => {
              const excludedChainIds = [10, 130]
              const excludedProtocols = ['PENDLE']
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : sorted
      }

      if (filter.sort === 'fdv') {
        const sorted = tokenFilterByProtocol.sort((a, b) => {
          const fdvA = a?.metadata?.fdv || 0
          const fdvB = b?.metadata?.fdv || 0
          if (a.type === TokenType.Token && b.type !== TokenType.Token) return -1
          if (b.type === TokenType.Token && a.type !== TokenType.Token) return 1
          return filter.order === 'descending' ? fdvB - fdvA : fdvA - fdvB
        })

        return process.env.VERCEL_ENV === 'production'
          ? sorted.filter((token) => {
              const excludedChainIds = [10, 130]
              const excludedProtocols = ['PENDLE']
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : sorted
      }
      if (filter.sort === 'tvl') {
        const sorted = tokenFilterByProtocol.sort((a, b) => {
          const fdvA = a?.metadata?.tvl || 0
          const fdvB = b?.metadata?.tvl || 0
          if (a.type === TokenType.Token && b.type !== TokenType.Token) return 1
          if (b.type === TokenType.Token && a.type !== TokenType.Token) return -1
          return filter.order === 'descending' ? fdvB - fdvA : fdvA - fdvB
        })

        return process.env.VERCEL_ENV === 'production'
          ? sorted.filter((token) => {
              const excludedChainIds = [10, 130]
              const excludedProtocols = ['PENDLE']
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : sorted
      }

      if (filter.sort === 'priceChange') {
        const sorted = tokenFilterByProtocol.sort((a, b) => {
          const priceChangeA = a?.metadata?.pricePercentage24h || 0
          const priceChangeB = b?.metadata?.pricePercentage24h || 0

          if (a.type === TokenType.Token && b.type !== TokenType.Token) return -1
          if (b.type === TokenType.Token && a.type !== TokenType.Token) return 1

          return filter.order === 'descending'
            ? priceChangeB - priceChangeA
            : priceChangeA - priceChangeB
        })

        return process.env.VERCEL_ENV === 'production'
          ? sorted.filter((token) => {
              const excludedChainIds = [10, 130]
              const excludedProtocols = ['PENDLE']
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : sorted
      }

      if (filter.sort === 'apy') {
        const sorted = tokenFilterByProtocol.sort((a, b) => {
          const apyA =
            a?.apy !== undefined
              ? Number(a.apy)
              : a.minApy !== undefined && a.maxApy !== undefined
                ? // ? ((Number(token.minApy) + Number(token.maxApy)) / 2).toFixed(2)
                  Number(a.minApy) + Number(a.maxApy) / 2
                : 0

          const apyB =
            b?.apy !== undefined
              ? Number(b.apy)
              : b.minApy !== undefined && b.maxApy !== undefined
                ? // ? ((Number(token.minApy) + Number(token.maxApy)) / 2).toFixed(2)
                  Number(b.minApy) + Number(b.maxApy) / 2
                : 0

          if (a.type === TokenType.Token && b.type !== TokenType.Token) return 1
          if (b.type === TokenType.Token && a.type !== TokenType.Token) return -1

          return filter.order === 'descending' ? apyB - apyA : apyA - apyB
        })
        return process.env.VERCEL_ENV === 'production'
          ? sorted.filter((token) => {
              const excludedChainIds = [10, 130]
              const excludedProtocols = ['PENDLE']
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : sorted
      }

      //FILTER BY PRODUCTION ENVIRONMENT
      const tokenFilterByEnvironment =
        process.env.VERCEL_ENV === 'production'
          ? tokenFilterByProtocol.filter((token) => {
              // In production, exclude tokens from these chains
              const excludedChainIds = [10, 130] // optimism, unichain
              // In production, exclude tokens from these protocols
              const excludedProtocols = ['PENDLE'] // pendle
              return (
                !excludedChainIds.includes(token.network) &&
                !excludedProtocols.includes(token.protocol || '')
              )
            })
          : tokenFilterByProtocol

      return type === 'input'
        ? tokenFilterByEnvironment.filter(removeSelectedTokens)
        : tokenFilterByEnvironment.filter(removeOutputToken)
    })()

    // const filterKey = search
    // return matchSorter(filteredTokens, filterKey, {
    //   keys: ['name', 'symbol', 'address'],
    //   baseSort: (a, b) => a.index - b.index,
    // })
    return filteredTokens
  }

  const disableTokenCard = useCallback(
    (token: APIToken) => {
      /* User starts with inputs:
        - Chains [A, B, C] all available
        - User selects wETH from chain A
        - Chains [B, C] disabled, all chain A tokens still available

      User then goes onto outputs, with Chain A tokens selected as inputs
        - Chains [A, B, C] all available
        - User adds a token from chain A
        - Chains [A, B, C] all available
        - User adds a token from chain B
        - Chain C now disabled */

      if (type === 'input') {
        const selectedNetworks = selectedTokens.map((token) => token.network)
        const networks = Array.from(new Set(inputChainIds.concat(selectedNetworks)))
        const isDisabled = networks.length > 0 && !networks.includes(token.network)
        return isDisabled
      }

      if (type === 'output') {
        // The input chain(s) (there should always only be one)
        const inputChain = inputChainIds[0]
        // All currently selected output tokens (including those in the store and in the dialog selection)
        const selectedNetworks = selectedTokens.map((token) => token.network)
        const outputNetworks = Array.from(new Set(outputChainIds.concat(selectedNetworks)))

        // Only input chain selected, allow any chain
        if (outputNetworks.length === 1 && outputNetworks[0] === inputChain) {
          return false
        }

        // Find destination chains (not input chain)
        const destinationChains = outputNetworks.filter((chain) => chain !== inputChain)

        if (destinationChains.length === 0) {
          // Only input chain selected, allow any chain
          return false
        }

        if (destinationChains.length === 1) {
          // Only input + one destination chain allowed
          // Disable all tokens not from input chain or the selected destination chain
          if (token.network !== inputChain && token.network !== destinationChains[0]) {
            return true
          }
          return false
        }

        // If more than two chains are present (shouldn't happen, but just in case)
        if (destinationChains.length > 1) {
          // Disable all tokens not from input chain or the first destination chain
          if (token.network !== inputChain && token.network !== destinationChains[0]) {
            return true
          }
          return false
        }
      }

      return false
    },
    [inputChainIds, outputChainIds, type, selectedTokens],
  )

  // Memoize the expensive filterTokens operation to prevent re-computation on every render
  const filteredTokens = useMemo(() => {
    return filterTokens({
      tokens,
      collateralTokens,
      varDebtTokens,
      search,
      selectedCategories,
      vaultTokens,
      weightedLiquidityTokens,
    })
  }, [
    tokens,
    collateralTokens,
    varDebtTokens,
    search,
    selectedCategories,
    vaultTokens,
    allTokensSelected,
    weightedLiquidityTokens,
    chainValue, // Add chainValue dependency
    protocolValue, // Add protocolValue dependency
    filter, // Add filter dependency for sorting
    balances, // Add balances dependency so list updates when balances load
  ])

  const matches = useMemo(() => {
    return filteredTokens
      .map((token) => ({ ...token, isDisabled: disableTokenCard(token) }))
      .sort((a, b) => Number(a.isDisabled) - Number(b.isDisabled))
  }, [filteredTokens, disableTokenCard])

  const myTokens = useMemo(() => {
    const filtered = matches.filter((token) =>
      BigNumber(Math.abs(token.balance as any)).isGreaterThan(0),
    )

    function sortByBalance(a: APITokenWithBalance, b: APITokenWithBalance) {
      const balanceA = new BigNumber(a.balance).abs().toNumber()
      const balanceB = new BigNumber(b.balance).abs().toNumber()

      return filter.order === 'descending' ? balanceB - balanceA : balanceA - balanceB
    }

    if (filter.sort === 'default') {
      return filtered.sort(sortByBalance)
    }
    return filtered
  }, [matches])

  // const matches = filterTokens({
  //   tokens,
  //   collateralTokens,
  //   varDebtTokens,
  //   search,
  //   selectedCategories,
  //   vaultTokens,
  //   weightedLiquidityTokens,
  // })
  //   .map((token) => ({ ...token, isDisabled: disableTokenCard(token) }))
  //   .sort((a, b) => Number(a.isDisabled) - Number(b.isDisabled))

  const toggleSelectedToken = (token: APIToken) => {
    setSelectedTokens((currentSelectedTokens) => {
      const isTokenSelected = currentSelectedTokens.find(
        (currentToken) => currentToken.iid === token.iid,
      )
      if (isTokenSelected)
        return currentSelectedTokens.filter((currentToken) => currentToken.iid !== token.iid)
      return currentSelectedTokens.concat(token)
    })
  }

  const renderSortedName = (myAssets: boolean) => {
    if (filter.sort === 'apy') {
      return 'APY'
    }
    if (filter.sort === 'priceChange') {
      return 'price change'
    }
    if (filter.sort === 'marketCap') {
      return 'market cap'
    }
    if (filter.sort === 'fdv') {
      return 'FDV'
    }
    if (filter.sort === 'tvl') {
      return 'TVL'
    }
    if (filter.sort === 'volume') {
      return '24H volume'
    }
    return myAssets ? 'balances' : '24H volume'
  }

  // const isShortScreen = useIsShortScreen()
  const mergedTokens = useMemo(() => {
    return [...myTokens, ...matches]
  }, [myTokens, matches])

  return (
    <Dialog.Content
      // className={`w-full ${!isShortScreen ? 'h-full' : ''} max-h-[730px] md:h-auto`}
      className={`w-full  md:max-h-[730px] md:h-auto`}
      onOpenAutoFocus={(event) => event.preventDefault()}
      overlayClassName={'w-full h-full'}
      onInteractOutside={(event) => {
        // Prevent closing when clicking on the side panel (chain/protocol selectors)
        const target = event.target as Element
        if (target.closest('[data-side-panel]')) {
          event.preventDefault()
        }
      }}
      sideElement={
        <div
          className={cn(
            'flex flex-row gap-4 h-[677px] animate-[slideInFromLeft_0.4s_ease-out_0.05s_both]',
          )}
          data-side-panel
        >
          <div className="flex-row gap-[8px] !flex" style={{ display: 'flex !important' }}>
            <div className="flex-1 w-full" style={{ flex: '1 1 0%' }}>
              <ChainSelect
                value={chainValue}
                onValueChange={setChainValue}
                onValueProtocolChange={setProtocolValue}
              />
            </div>
            <div className="flex-1 w-full" style={{ flex: '1 1 0%' }}>
              <ProtocolSelect
                chain={chainValue}
                value={protocolValue}
                onValueChange={setProtocolValue}
              />
            </div>
          </div>
        </div>
      }
    >
      {/* <div className={`flex flex-col ${isShortScreen ? '' : 'w-[500px]'} h-full`}> */}
      <div
        className={`flex flex-col md:w-[500px] h-full animate-[slideInFromRight_0.4s_ease-out_0.05s_both]`}
      >
        <Dialog.Header>
          <Dialog.Title>Select Assets</Dialog.Title>
          <Dialog.Description className="sr-only">
            Choose tokens to add to your trade. Use the search bar to find specific tokens, and
            filter by chain and protocol.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="px-0 pb-0">
          {/* <div className={`flex flex-col ${isShortScreen ? 'h-[70vh]' : 'h-full md:h-[600px]'}`}> */}
          <div className={`flex flex-col h-70vh md:h-[600px]`}>
            <div className="px-4">
              <div className="flex justify-between items-center mb-4 mt-2 md:hidden">
                <div>
                  <MobileChainSelect
                    onValueChange={setChainValue}
                    value={chainValue}
                    onValueProtocolChange={setProtocolValue}
                  />
                </div>
                <div>
                  <MobileProtocolSelect
                    chain={chainValue}
                    value={protocolValue}
                    onValueChange={setProtocolValue}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <TextField
                  leftIcon={<MagniferIcon />}
                  // rightIcon={<ChainSelect value={chainValue} onValueChange={setChainValue} />}
                  // rightIcon={
                  //   <CommonSelect
                  //     valueChain={chainValue}
                  //     onValueChainChange={setChainValue}
                  //     valueProtocol={protocolValue}
                  //     onValueProtocolChange={setProtocolValue}
                  //   />
                  // }
                  placeholder="Search by name or enter address"
                  containerClassName="w-full border-b border-border bg-transparent"
                  // className="bg-section"
                  className="bg-transparent"
                  onChange={(event) => setSearch(event.target.value)}
                  value={search}
                  autoFocus
                />

                <div>
                  <FilterSelect
                    value={filter}
                    onValueChange={(selected: string) => {
                      // if (selected !== 'descending' && selected !== 'ascending') {
                      //   setSelectedCategories(['all'])
                      // }
                      selectFilter((prev) => {
                        if (selected !== 'descending' && selected !== 'ascending') {
                          return {
                            sort: selected as FilterType['sort'],
                            order: prev.order,
                          }
                        } else {
                          return {
                            sort: prev.sort,
                            order: selected as FilterType['order'],
                          }
                        }
                      })
                    }}
                  />
                </div>
              </div>
              <ToggleGroup.Root
                type="multiple"
                value={selectedCategories}
                className="overflow-x-auto"
                onValueChange={(value) => {
                  const hasAll = value.includes('all')

                  let newValue = value

                  if (hasAll) {
                    newValue = value.filter((item) => item !== 'all')
                  } else if (value.length === 0) {
                    newValue = ['all']
                  }

                  setSelectedCategories(newValue)
                }}
              >
                {/* <ToggleGroup.Item value="all" className="whitespace-nowrap flex-1">
                All
              </ToggleGroup.Item> */}
                {getTokensQuery.data?.tokenCategories?.map((category) =>
                  categoriesOrigNames[category] && category !== 'varDebt' ? (
                    <ToggleGroup.Item
                      key={category}
                      value={category}
                      className="whitespace-nowrap capitalize"
                    >
                      {/* {category === 'varDebt' ? 'Borrow' : categoriesNames[category]} */}
                      {categoriesOrigNames[category]}
                    </ToggleGroup.Item>
                  ) : null,
                )}
                <ToggleGroup.Item
                  key={'pendle'}
                  value={'pendle'}
                  className="whitespace-nowrap capitalize"
                >
                  YT/PT
                </ToggleGroup.Item>
              </ToggleGroup.Root>

              {selectedTokens.length > 0 && (
                <div className="pb-4 flex flex-wrap items-center gap-2.5">
                  {selectedTokens.map((token) => {
                    const images = [
                      {
                        src: token?.logoURI || '',
                        symbol: token.symbol,
                        color: undefined,
                      },
                    ]

                    const branches = [
                      {
                        src: `/icons/networks/${token.network}.svg`,
                        symbol: token.network.toString(),
                      },
                    ]

                    if ('protocol' in token) {
                      branches.push({
                        src: `/icons/protocols/${token.protocol}.svg`,
                        symbol: token.protocol as string,
                      })
                    }
                    return (
                      <button
                        key={token.iid}
                        className="relative"
                        onClick={() => toggleSelectedToken(token)}
                      >
                        <ImageGroup images={images} branches={branches} />
                        <div className="size-5 rounded-full bg-state-error-default flex items-center justify-center absolute top-0.5 -left-1.5 text-white">
                          <CloseIcon />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div
              className={cn(
                'min-h-0 overflow-y-auto md:flex-1',
                selectedTokens.length > 0 ? 'h-[45vh]' : 'h-[55vh]',
              )}
            >
              {/* {myTokens.length > 0 && <h3 className="ml-[25px] text-orange-400">My Tokens</h3>} */}
              {getTokensQuery.isPending ? (
                <List className="h-full">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <Card key={index} className="w-full h-16 animate-pulse" variant="secondary" />
                  ))}
                </List>
              ) : (
                <VirtuosoGrid
                  style={{ height: '100%' }}
                  data={mergedTokens}
                  totalCount={mergedTokens.length}
                  components={{ List }}
                  overscan={200}
                  computeItemKey={(index, token) => `${index}-${token.iid}`}
                  itemContent={(_index, token) => {
                    return (
                      <div
                        className={`w-full ${_index === 0 || _index === myTokens.length ? 'h-[94px]' : 'h-[70px]'} `}
                        key={token.iid}
                      >
                        {/* <div className={`w-full`} key={token.iid}> */}
                        {_index === 0 && myTokens.length > 0 && (
                          <div className="flex items-center gap-1 ml-[10px] text-orange-400">
                            <Coins className="w-4 h-4" />
                            <h3 className="">My assets by {renderSortedName(true)}</h3>
                          </div>
                        )}
                        {_index === myTokens.length && (
                          <div className="flex items-center gap-1 ml-[10px] text-orange-400">
                            <TrendingUp className="w-4 h-4" />
                            <h3 className="">Assets by {renderSortedName(false)}</h3>
                          </div>
                        )}
                        <TokenCard
                          token={token}
                          disabled={token.isDisabled}
                          selected={
                            !!selectedTokens.find(
                              (selectedToken) => selectedToken.iid === token.iid,
                            )
                          }
                          activeTooltipId={activeTooltipId}
                          setActiveTooltipId={setActiveTooltipId}
                          onSelect={() => toggleSelectedToken(token)}
                          isFirstCard={_index === 0 || _index === myTokens.length}
                        />
                      </div>
                    )
                  }}
                />
              )}
            </div>
            <div className="bg-bg-surface p-4 flex items-center gap-4 rounded-b-full">
              {selectedTokens.length > 0 && (
                <Button
                  className="flex-1 text-base text-grey-secondary"
                  variant="outline"
                  size="lg"
                  onClick={() => setSelectedTokens([])}
                >
                  Reset Selection
                </Button>
              )}
              <Button
                className="flex-1 text-base disabled:grayscale disabled:opacity-30"
                size="lg"
                onClick={() => {
                  onSelectTokens?.(selectedTokens)
                  setSelectedTokens([])
                }}
                disabled={!selectedTokens.length}
              >
                Continue {selectedTokens.length > 0 && `(${selectedTokens.length})`}
              </Button>
            </div>
          </div>
        </Dialog.Body>
      </div>
    </Dialog.Content>
  )
}

type TokenCardProps = {
  token: APIToken
  disabled?: boolean
  selected: boolean
  onSelect: () => void
  activeTooltipId: string | null
  setActiveTooltipId: (id: string | null) => void
  isFirstCard: boolean
}

export const TokenCard = memo(function TokenCard({
  token,
  selected,
  disabled = false,
  onSelect,
  isFirstCard,
  // setActiveTooltipId,
  // activeTooltipId,
}: TokenCardProps) {
  // const [isHoveringContent, setIsHoveringContent] = useState(false)
  const tokenBalanceQuery = useTokenBalanceQuery(token.iid)
  const balance = tokenBalanceQuery.data || 0

  // const result = Math.max(5 - balance.toString().length, 2)

  // const isOpen = activeTooltipId === token.iid

  // const format = new Intl.NumberFormat('en-us', {
  //   roundingMode: 'floor',
  //   maximumFractionDigits: result > token.decimals ? result : result * 2 + 3,
  //   minimumFractionDigits: result,
  // })

  const images = [
    {
      src: token?.logoURI || '',
      symbol: token.symbol,
      color: undefined,
      doubleImages: token?.imgSrc,
    },
  ]

  const branches = [
    {
      src: `/icons/networks/${token.network}.svg`,
      symbol: token.network.toString(),
    },
  ]

  if ('protocol' in token) {
    branches.push({
      src: `/icons/protocols/${token.protocol}.svg`,
      symbol: token.protocol as string,
    })
  }

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

  // const apy = useMemo(() => {
  //   return token?.apy !== undefined
  //     ? Number(token.apy).toFixed(2)
  //     : token.minApy !== undefined && token.maxApy !== undefined
  //       ? ((Number(token.minApy) + Number(token.maxApy)) / 2).toFixed(2)
  //       : '0.00'
  // }, [token])

  const tokenType = useMemo(() => {
    if (token) {
      if (token.type === TokenType.WeightedLiquidity) {
        return 'Pool'
      } else if (token.type === TokenType.Vault) {
        return 'Vault'
      } else if (token.type === TokenType.Collateral || token.type === TokenType.VarDebt) {
        return 'Lending'
      } else {
        return 'Token'
      }
    } else {
      return 'Token'
    }
  }, [token])

  return (
    <HoverCard.Root>
      <HoverCard.Trigger className="w-full">
        <Card variant="secondary" asChild className="p-2 w-full h-full">
          <button
            style={{ height: isFirstCard ? '70px' : '100%' }}
            disabled={disabled}
            className={cn(
              'flex items-center border-0 justify-between h-full group transition-all duration-150',
              'ring-1 ring-inset ring-transparent',
              selected
                ? 'bg-state-highlight-light/10 ring-1 ring-inset ring-state-highlight-light'
                : 'hover:bg-section',
              { grayscale: disabled },
            )}
            onClick={onSelect}
          >
            <div className="w-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="h-full flex items-center gap-[13px]">
                  <ImageGroup images={images} branches={branches} />
                  <div className="flex flex-col gap-0.5">
                    <p
                      title={token.name || token.symbol}
                      className="text-left text-[16px] font-normal"
                    >
                      {token.name || token.symbol}
                    </p>
                    <div className="flex gap-1 items-center">
                      {Number(balance) > 0 && (
                        <p className="text-12px-normal opacity-55">
                          {formatTokenAmount(Number(balance), Number(token.priceUSD) || 0)}
                        </p>
                      )}
                      <p
                        title={token.symbol}
                        className="text-left text-12px-normal opacity-55 truncate max-w-[77px]"
                      >
                        {token.symbol}
                      </p>
                      {token.tokenCategory && token.tokenCategory !== 'token' && (
                        <Badge
                          variant={tokenBadge[token.tokenCategory as TokenCategory]}
                          className="h-5"
                        >
                          {categoriesNames[token.tokenCategory]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-max flex flex-col items-end gap-0.5">
                  <p className="text-16px-medium text-grey-primary">
                    {balance !== 0
                      ? new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(
                          BigNumber(balance)
                            .multipliedBy(token.priceUSD ?? 0)
                            .toNumber(),
                        )
                      : token.type !== TokenType.Token
                        ? `$${token?.metadata?.tvl && Number(token?.metadata?.tvl) > 1 ? millify(Number(token?.metadata?.tvl)) : '0.00'} ` +
                          'TVL'
                        : '$0.00'}
                  </p>
                  {/* <p className="text-16px-medium text-grey-primary">
                    {formatWithZeroCountSubscript(format.format(Number(balance)), 8)}
                  </p> */}
                  {token.type === TokenType.Token ? (
                    <p
                      className={`flex items-center gap-1 text-12px-normal ${
                        Number.parseFloat(token.metadata?.pricePercentage24h ?? '0') < 0
                          ? 'text-red-500'
                          : 'text-green-500'
                      }`}
                    >
                      {Number.parseFloat(token.metadata?.pricePercentage24h ?? '0') < 0 ? (
                        <Triangle size={6} className="rotate-180 fill-current" />
                      ) : (
                        <Triangle size={6} className="fill-current" />
                      )}
                      {Number.parseFloat(token.metadata?.pricePercentage24h ?? '0').toFixed(2)}%
                    </p>
                  ) : (
                    <p className="text-12px-normal text-grey-secondary">
                      APY{' '}
                      {token?.apy !== undefined
                        ? `${parseFloat(token.apy ?? 0).toFixed(2)}%`
                        : token.minApy !== undefined && token.maxApy !== undefined
                          ? // ? ((Number(token.minApy) + Number(token.maxApy)) / 2).toFixed(2)
                            token?.minApy === token?.maxApy
                            ? `${parseFloat(token?.minApy ?? 0).toFixed(2)}%`
                            : `${parseFloat(token?.minApy ?? 0).toFixed(2)}% - ${parseFloat(token?.maxApy ?? 0).toFixed(2)}%`
                          : '0.00%'}{' '}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end">
                {token.minApr && token.maxApr && (
                  <span className="text-xs text-grey-secondary flex gap-2">
                    {formatAPR(token.minApr, token.maxApr)} APY
                  </span>
                )}
              </div>
            </div>
          </button>
        </Card>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content side={'right'} align="start" sideOffset={0} className="z-50">
          <TaggingMetadataContent
            value={token.name}
            images={images}
            branches={branches}
            type={tokenType}
            metadata={token || '{}'}
          />
          <HoverCard.Arrow className="fill-section h-[6px] w-3" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
})
