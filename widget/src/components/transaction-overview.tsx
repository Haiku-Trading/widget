

import { tokenFormatter, usdFormatter } from '../utils'
import BigNumber from 'bignumber.js'
import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react'
import { useSwapOutputTotal } from '../hooks'
import { useTradeStore } from '../providers'
import { useClassicSolveIntentQuery } from '../queries/use-solve-intent-query'
import { Popup } from './popup'
import { InfoIcon } from './icons'

interface ITransactionOverview {
  isClassicModal?: boolean
}

export function TransactionOverview({ isClassicModal = true }: ITransactionOverview) {
  const inputTokens = useTradeStore((state) => state.inputTokens)
  const outputTokens = useTradeStore((state) => state.outputTokens)
  const solveIntentQuery = useClassicSolveIntentQuery()
  const outputTotal = useSwapOutputTotal()
  const slippage = useTradeStore((state) => state.slippage)

  const [resetTransactionData, setResetTransactionData] = useState(false)

  useEffect(() => {
    if (outputTokens.length === 0 || inputTokens.length === 0) {
      setResetTransactionData(true)
    } else {
      setResetTransactionData(false)
    }
  }, [outputTokens, inputTokens])

  const fee = useMemo(() => {
    if (!solveIntentQuery.data) {
      return {
        total: '0',
        usd: '0',
      }
    }

    const total = solveIntentQuery.data.fees.reduce((previous, current) => {
      return BigNumber(previous).plus(current.amount).toFixed()
    }, '0')

    const usd = solveIntentQuery.data.fees.reduce((previous, current) => {
      return BigNumber(previous).plus(current.amountUSD).toFixed()
    }, '0')

    // return { total, usd, symbol: solveIntentQuery.data.fees[0].token.symbol }
    return { total, usd }
  }, [solveIntentQuery.data])

  const networkFee = useMemo(() => {
    if (resetTransactionData || !solveIntentQuery.data) return 0

    return solveIntentQuery.data.fees.reduce((total, fee) => {
      return total + parseFloat(fee.amount)
    }, 0)
  }, [resetTransactionData, solveIntentQuery.data])

  const txnOverview = [
    {
      label: 'Transaction fee',
      value: [
        `${tokenFormatter.fullValue(4).format(fee.total)} ETH`,
        usdFormatter.fullValue.format(fee.usd),
      ],
      tooltip:
        'Fees are collected from each input token to support platform functionality and are included in this quote. Eligible $veHKU holders may receive discounts. ',
    },
    ...(isClassicModal
      ? [
          {
            label: 'Minimum received',
            value: resetTransactionData
              ? usdFormatter.fullValue.format(0)
              : usdFormatter.fullValue.format(outputTotal),
            tooltip:
              'The minimum amount you will receive, accounting for potential price differences based on your slippage settings.',
          },
        ]
      : []),
    {
      label: 'Max slippage tolerance',
      value: `${(Number(slippage) * 100).toFixed(2)}%`,
      tooltip:
        "The maximum price impact you're willing to accept for this swap. Your transaction will fail if this limit is exceeded. Applies to each token in multi-token swaps. ",
    },
    {
      label: 'Network cost',
      value: `${usdFormatter.fullValue.format(networkFee || 0)}`,
      tooltip:
        'This is the estimated cost to process your transaction on the blockchain. Haiku does not receive any share of these fees.',
    },
  ]

  return (
    <div className="mt-2 flex flex-col gap-2">
      {txnOverview.map((item, index) => (
        <TransactionOverViewItem {...item} key={index} />
      ))}
    </div>
  )
}

type TransactionOverViewItemProps = {
  label: string
  value: string | string[]
  tooltip?: ReactNode
  href?: string
}

function TransactionOverViewItem({ label, value, tooltip, href }: TransactionOverViewItemProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <Popup
        content={
          <p>
            {tooltip}{' '}
            {href && (
              <a href={href} className="font-medium underline" target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            )}
          </p>
        }
      >
        <div className="flex items-center justify-center">
          <span className="text-14px-normal flex items-center text-foreground">{label}</span>
          <button>
            <InfoIcon className="size-[18px] text-muted-foreground" />
          </button>
        </div>
      </Popup>

      <span className="text-14px-medium text-foreground">
        {!Array.isArray(value) ? (
          value
        ) : (
          <Fragment>
            {value[0]} <span className="text-14px-medium text-muted-foreground">({value[1]})</span>
          </Fragment>
        )}
      </span>
    </div>
  )
}
