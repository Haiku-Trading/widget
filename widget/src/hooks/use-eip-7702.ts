// Create a hook that will return the eip7702 status and a function to toggle it
// Check current wallet connector and if it's Metamask, then set eip7702 to true
// If it's not Metamask, then set eip7702 to false

import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect } from 'react'
import { useEIP7702Store } from '../stores/eip-7702'
import { useAccount, useConnectorClient } from 'wagmi'

export function useEIP7702() {
  const [eip7702LocalStorage, setEIP7702LocalStorage] = useLocalStorage('eip7702_enable', true)
  const { eip7702, setEIP7702, toggleEIP7702: storeToggleEIP7702 } = useEIP7702Store()
  const { connector } = useAccount()
  
  useEffect(() => {
    if (
      connector?.name?.toLowerCase() === 'metamask' &&
      eip7702LocalStorage &&
      process.env.NEXT_PUBLIC_TURN_OFF_EIP7702 !== 'true'
    ) {
      setEIP7702(true)
    } else {
      setEIP7702(false)
    }
  }, [connector, eip7702LocalStorage, setEIP7702])

  function toggleEIP7702() {
    setEIP7702LocalStorage(!eip7702)
    storeToggleEIP7702()
  }

  return {
    eip7702,
    toggleEIP7702,
    canToggleEIP7702: connector?.name?.toLowerCase() === 'metamask',
  }
}
