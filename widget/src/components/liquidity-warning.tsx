import { useMemo } from 'react'
import { Accordion } from './accordion'
import InfoOutline from './../icons/info-outline.svg'
import { useTradeStore } from '../providers'
import { useSwapInputTotal, useSwapOutputTotal } from '../hooks'
import BigNumber from 'bignumber.js'

export function LiquidityWarning() {
  const slippage = useTradeStore((state) => state.slippage)
  const inputTokensLength = useTradeStore((state) => state.inputTokens.length)
  const usdInputTotal = useSwapInputTotal()
  const usdOutputTotal = useSwapOutputTotal()

  const diffPercentage = useMemo(() => {
    if (!BigNumber(usdInputTotal).isGreaterThan('0')) return '0'
    if (!BigNumber(usdOutputTotal).isGreaterThan('0')) return '0'

    function relDiff(a: number, b: number) {
      return 100 * Math.abs((a - b) / ((a + b) / 2))
    }

    return relDiff(Number(usdInputTotal), Number(usdOutputTotal))
  }, [usdInputTotal, usdOutputTotal])

  const showWarning = BigNumber(diffPercentage).isGreaterThan(slippage)

  if (!showWarning) return null

  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item
        value="item-1"
        className="bg-warning-text/10 text-warning-text border-warning-text"
      >
        <Accordion.Trigger
          chevronClass="text-warning-text"
          className="h-10 data-[state=open]:border-b data-[state=open]:border-b-warning-text text-warning-text"
        >
          <div className="flex items-center justify-start gap-1">
            <InfoOutline className="size-4" />
            <span className="font-medium text-sm">Liquidity Warning</span>
          </div>
        </Accordion.Trigger>
        <Accordion.Content>
          <div className="flex flex-col gap-2 mt-2 text-warning-text">
            {inputTokensLength === 1 && (
              <p className="text-sm">
                This token has limited liquidity. Your trade may experience significant price impact
                or fail to execute. Consider breaking your trade into smaller amounts or adjusting
                your slippage tolerance to increase the likelihood of execution.
              </p>
            )}
            {inputTokensLength > 1 && (
              <p className="text-sm">
                One or more tokens in your trade has limited liquidity. Your transaction may
                experience significant price impact or fail to execute. Adjusting slippage could
                increase the chance of execution but may expose you to increased transaction costs,
                including MEV risks. Consider swapping this token separately to improve the success
                of your transaction.
              </p>
            )}
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
