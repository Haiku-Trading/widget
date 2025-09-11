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
  YeiIcon,
  BeraborrowIcon,
  InfraredIcon,
  KodiakBaultsIcon,
  KodiakIslandIcon,
  DragonswapV2Icon,
  HyperstableIcon,
  BerahubIcon,
  PendleIcon,
  HyperswapV2Icon
} from '../components/icons'

/**
 * Helper function to get the appropriate protocol icon component for a given protocol symbol
 * @param protocolSymbol - The protocol symbol (e.g., 'AAVE_V3', 'BALANCER_V2')
 * @param className - Optional CSS classes to apply to the icon (defaults to "size-5")
 * @returns React component for the protocol icon or null if not found
 */
export const getProtocolIcon = (protocolSymbol: string, className: string = "size-5"): React.ReactElement | null => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    'AAVE_V3': AaveV3Icon,
    'BALANCER_V2': BalancerV2Icon,
    'BEX': BexIcon,
    'BERAPAW': BerapawIcon,
    'CURVE': CurveIcon,
    'HYPERLEND': HyperlendIcon,
    'HYPURRFI': HypurrfiIcon,
    'MORPHO': MorphoIcon,
    'UNISWAP_V2': UniswapV2Icon,
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
  }
  
  const IconComponent = iconMap[protocolSymbol]
  return IconComponent ? <IconComponent className={`${className} rounded-full`} /> : null
}

