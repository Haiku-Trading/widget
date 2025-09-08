type LifiResponse = {
  sending: {
    txHash: string
    txLink: string
    amount: string | number
    token: {
      address: string
      symbol: string
      decimals: number
      chainId: string | number
      name: string
      coinKey: string
      priceUSD: string | number
      logoURI: string
    }
    chainId: string | number
    gasToken: {
      address: string
      symbol: string
      decimals: number
      chainId: string | number
      name: string
      coinKey: string
      priceUSD: string | number
      logoURI: string
    }
    gasAmount: string | number
    gasAmountUSD: string | number
    gasPrice: string | number
    gasUsed: string | number
  }
  receiving: {
    txHash: string
    txLink: string
    amount: string | number
    token: {
      address: string
      symbol: string
      decimals: number
      chainId: string | number
      name: string
      coinKey: string
      priceUSD: string | number
      logoURI: string
    }
    chainId: string | number
    gasToken: {
      address: string
      symbol: string
      decimals: number
      chainId: string | number
      name: string
      coinKey: string
      priceUSD: string | number
      logoURI: string
    }
    gasAmount: string | number
    gasAmountUSD: string | number
    gasPrice: string | number
    gasUsed: string | number
  }
  tool: string
  status: 'PENDING' | 'DONE' | 'NOT_FOUND' | 'FAILED'
  substatus:
  | 'WAIT_SOURCE_CONFIRMATIONS'
  | 'WAIT_DESTINATION_TRANSACTION'
  | 'BRIDGE_NOT_AVAILABLE'
  | 'CHAIN_NOT_AVAILABLE'
  | 'REFUND_IN_PROGRESS'
  | 'UNKNOWN_ERROR'
  | 'COMPLETED'
  | 'PARTIAL'
  | 'REFUNDED'
  fromAddress: string
  toAddress: string
  metadata: {
    integrator: string
  }
  lifiExplorerLink: string
  transactionId: string
}

export async function getLifiTransaction(hash: string) {
  const res = await fetch(`https://li.quest/v1/status?txHash=${hash}`, {
    method: 'GET',
  })
  const data = (await res.json()) as LifiResponse

  if (!data) {
    console.log('No relay transaction request found')
    throw new Error('no request found')
  }

  return data
}


export async function getTransactionData(protocol: string,hash: string) {
  const res = await fetch(`https://li.quest/v1/status?txHash=${hash}`, {
    method: 'GET',
  })
  const data = (await res.json()) as LifiResponse

  if (!data) {
    console.log('No relay transaction request found')
    throw new Error('no request found')
  }

  return data
}
