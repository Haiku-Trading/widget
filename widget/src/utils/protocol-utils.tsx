import React from 'react'
import { 
  AaveV3Icon,
  BalancerV2Icon,
  BexIcon,
  BerapawIcon,
  CurveIcon,
  HyperlendIcon,
  HypurrfiIcon,
  MorphoIcon,
  UniswapV2Icon,
  UniswapV3Icon,
  YeiIcon,
  BeraborrowIcon,
  InfraredIcon,
  KodiakBaultsIcon,
  KodiakIslandIcon,
  DragonswapV2Icon,
  HyperstableIcon,
  BerahubIcon,
  PendleIcon,
  HyperswapV2Icon,
  BendIcon,
  FluidIcon,
  QuickswapV3Icon,
  YearnFinanceIcon,
  HybraV2Icon,
  HybraV3Icon,
  HyperswapV3Icon,
  KinetiqIcon,
  LaminarV3Icon,
  ProjectXV3Icon,
  StakedHypeIcon
} from '../components/icons'

/**
 * Helper function to get the appropriate protocol icon component for a given protocol symbol
 * @param protocolSymbol - The protocol symbol (e.g., 'AAVE_V3', 'BALANCER_V2')
 * @param className - Optional CSS classes to apply to the icon (defaults to "size-5")
 * @param size - Optional explicit size prop (takes precedence over className)
 * @returns React component for the protocol icon or null if not found
 */
export const getProtocolIcon = (
  protocolSymbol: string, 
  className: string = "size-5",
  size?: string | number
): React.ReactElement | null => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: string | number }>> = {
    'AAVE_V3': AaveV3Icon,
    'BALANCER_V2': BalancerV2Icon,
    'BEX': BexIcon,
    'BERAPAW': BerapawIcon,
    'CURVE': CurveIcon,
    'HYPERLEND': HyperlendIcon,
    'HYPURRFI': HypurrfiIcon,
    'MORPHO': MorphoIcon,
    'UNISWAP_V2': UniswapV2Icon,
    'UNISWAP_V3': UniswapV3Icon,
    'YEI': YeiIcon,
    'BERABORROW': BeraborrowIcon,
    'INFRARED': InfraredIcon,
    'KODIAK_BAULTS': KodiakBaultsIcon,
    'KODIAK_ISLAND': KodiakIslandIcon,
    'DRAGONSWAP_V2': DragonswapV2Icon,
    'HYPERSTABLE': HyperstableIcon,
    'BERAHUB': BerahubIcon,
    'PENDLE': PendleIcon,
    'HYPERSWAP_V2': HyperswapV2Icon,
    'BEND': BendIcon,
    'FLUID': FluidIcon,
    'QUICKSWAP_V3': QuickswapV3Icon,
    'YEARN_FINANCE': YearnFinanceIcon,
    'HYBRA_V2': HybraV2Icon,
    'HYBRA_V3': HybraV3Icon,
    'HYPERSWAP_V3': HyperswapV3Icon,
    'KINETIQ': KinetiqIcon,
    'LAMINAR_V3': LaminarV3Icon,
    'PROJECTX_V3': ProjectXV3Icon,
    'STAKED_HYPE': StakedHypeIcon,
  }
  
  const IconComponent = iconMap[protocolSymbol]
  return IconComponent ? (
    <IconComponent 
      className={`${className} rounded-full`}
      {...(size && { size })}
    />
  ) : null
}

