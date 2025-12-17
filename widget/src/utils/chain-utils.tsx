import React from 'react'
import { 
  Chain1Icon, 
  Chain10Icon, 
  Chain56Icon, 
  Chain100Icon, 
  Chain130Icon, 
  Chain1329Icon, 
  Chain137Icon, 
  Chain146Icon, 
  Chain33139Icon, 
  Chain42161Icon, 
  Chain43114Icon, 
  Chain480Icon, 
  Chain534352Icon, 
  Chain747474Icon, 
  Chain80094Icon, 
  Chain8453Icon, 
  Chain999Icon,
  Chain9745Icon,
  Chain60808Icon
} from '../components/icons'

/**
 * Helper function to get the appropriate chain icon component for a given chain ID
 * @param chainId - The chain ID as a string
 * @param className - Optional CSS classes to apply to the icon (defaults to "size-5")
 * @param size - Optional explicit size prop (takes precedence over className)
 * @returns React component for the chain icon or null if not found
 */
export const getChainIcon = (
  chainId: string, 
  className: string = "size-5",
  size?: string | number
): React.ReactElement | null => {
  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: string | number }>> = {
    '1': Chain1Icon,
    '10': Chain10Icon,
    '56': Chain56Icon,
    '100': Chain100Icon,
    '130': Chain130Icon,
    '137': Chain137Icon,
    '146': Chain146Icon,
    '42161': Chain42161Icon,
    '43114': Chain43114Icon,
    '480': Chain480Icon,
    '8453': Chain8453Icon,
    '80094': Chain80094Icon,
    '999': Chain999Icon,
    '1329': Chain1329Icon,
    '33139': Chain33139Icon,
    '534352': Chain534352Icon,
    '747474': Chain747474Icon,
    '9745': Chain9745Icon,
    '60808': Chain60808Icon,
  }
  
  const IconComponent = iconMap[chainId]
  return IconComponent ? (
    <IconComponent 
      className={`${className} rounded-full`}
      {...(size && { size })}
    />
  ) : null
}

