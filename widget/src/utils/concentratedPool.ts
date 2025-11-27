import BigNumber from 'bignumber.js'

export const calcConcentratedBalances = (
  balances: Record<string, string>,
  tickLower?: string,
  tickUpper?: string,
) => {
  if (!tickLower || !tickUpper) {
    return {
      balance: 0,
      balanceUSD: 0,
    }
  }
  let balance = 0
  let balanceUSD = 0
  Object.keys(balances).forEach((key) => {
    const [, , lowerTick, upperTick] = key.split(':')
    if (tickLower == lowerTick && tickUpper == upperTick) {
      balance = Number(balances[key].split(':')[0])
      balanceUSD = Number(balances[key].split(':')[1])
      return
    }
  })
  return {
    balance,
    balanceUSD,
  }
}

export function getUniswapV3PositionUSDValue({
  liquidity,
  sqrtPriceX96,
  tickLower,
  tickUpper,
  decimals0,
  decimals1,
  price0USD,
  price1USD,
}: {
  liquidity: bigint
  sqrtPriceX96: bigint
  tickLower: number
  tickUpper: number
  decimals0: number
  decimals1: number
  price0USD: number
  price1USD: number
}): number {
  const Q96 = new BigNumber(2).pow(96)

  const sqrtP = new BigNumber(sqrtPriceX96.toString()).div(Q96)

  const sqrtPl = new BigNumber(Math.pow(1.0001, tickLower / 2).toString())
  const sqrtPu = new BigNumber(Math.pow(1.0001, tickUpper / 2).toString())

  const L = new BigNumber(liquidity.toString())

  let amount0 = new BigNumber(0)
  let amount1 = new BigNumber(0)

  if (sqrtP.lte(sqrtPl)) {
    amount0 = L.times(sqrtPu.minus(sqrtPl)).div(sqrtPu.times(sqrtPl))
  } else if (sqrtP.lt(sqrtPu)) {
    amount0 = L.times(sqrtPu.minus(sqrtP)).div(sqrtPu.times(sqrtP))
    amount1 = L.times(sqrtP.minus(sqrtPl))
  } else {
    amount1 = L.times(sqrtPu.minus(sqrtPl))
  }

  const amount0Human = amount0.div(new BigNumber(10).pow(decimals0))
  const amount1Human = amount1.div(new BigNumber(10).pow(decimals1))

  const totalUSD = amount0Human.times(price0USD).plus(amount1Human.times(price1USD))

  return totalUSD.toNumber()
}
