type Response = {
  requests: {
    id: string
    status: 'pending' | 'success' | 'refund'
    data: {
      outTxs: {
        hash: string
        chainId: number
      }[]
      metadata?: {
        currencyOut?: {
          currency?: {
            chainId: number
          }
        }
        currencyIn?: {
          currency?: {
            chainId: number
          }
        }
      }
    }
  }[]
}

export async function getRelayTransaction(hash: string) {
  const res = await fetch(`https://api.relay.link/requests/v2?hash=${hash}`)
  const data = (await res.json()) as Response
  if (data.requests.length === 0) {
    console.log('No relay transaction request found')
    throw new Error('no request found')
  }
  const bridgeTx = filterRelayBridgeTransactions(data)
  if (bridgeTx?.status === 'pending') {
    console.log('No relay transaction request found')
    throw new Error('no request found')
  }
  return bridgeTx
}

export function filterRelayBridgeTransactions(data: Response) {
  return data.requests.find((request) => {
    const currencyInChainId = request.data.metadata?.currencyIn?.currency?.chainId
    const currencyOutChainId = request.data.metadata?.currencyOut?.currency?.chainId
    return currencyInChainId !== currencyOutChainId
  })
}
