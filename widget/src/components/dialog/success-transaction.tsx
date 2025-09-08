import SuccessIcon from './../../icons/success.svg'
import { Avatar } from '../avatar'
import { usdFormatter } from '../../utils'
import { formatTokenAmount } from '../../utils/numberFormatting'
import { RiArrowDownSLine } from '@remixicon/react'
import BigNumber from 'bignumber.js'
import { Accordion } from 'radix-ui'
import { useState } from 'react'
import { AnyAPIToken } from '../../services/get-tokens'
import { SolveIntentResponse } from '../../services/solve-intent'
import { TransactionOverview } from '../transaction-overview'
import { TokenType } from '../../enums/token-type'
import { TransactionDataTypeResponse } from '../../queries/use-transaction-query'

interface SuccessTransactionProps {
  filteredInputTokens: AnyAPIToken[]
  outputTokens: AnyAPIToken[]
  inputPositionSuccessData: Record<string, string>
  solveIntentSuccessData: SolveIntentResponse
  transactionData: TransactionDataTypeResponse | null
}
type CardTokenProps = {
  amountToken: string
  amountUSD: string
  icon: string
  className?: string
  color?: string
  valuePercent?: string
  symbol?: string
  chainId?: number
  type?: TokenType
}

const SuccessTransaction = ({
  filteredInputTokens,
  outputTokens,
  inputPositionSuccessData,
  solveIntentSuccessData,
  transactionData,
}: SuccessTransactionProps) => {
  // const inputPositions = useTradeStore((state) => state.inputPositions)
  // const solveIntentQuery = useClassicSolveIntentQuery()
  const [openItem, setOpenItem] = useState<string>('')

  const isOpen = openItem === 'item-1'
  return (
    <div className="flex w-full flex-col gap-2 items-center rounded-2xl pt-4">
      <SuccessIcon />
      <div className="flex flex-col items-center gap-2 py-4">
        <span className="text-18px-normal ">Transaction successful</span>
      </div>
      {/* {!isRefunded && (
        <span className="text-14px-normal ">
          You received {filteredInputTokens.length} token successful
        </span>
      )} */}
      <div className="bg-bg-section  flex flex-col w-full p-3 rounded-[12px] gap-[8px]">
        <span className="text-14px-normal ">You paid with</span>
        {filteredInputTokens.map((token) => {
          const tokenValue = inputPositionSuccessData[token.iid]
          const usdBalance = BigNumber(tokenValue).multipliedBy(token.priceUSD).toFixed()
          const amountToken = tokenValue
            ? formatTokenAmount(Number(tokenValue), Number(token.priceUSD) || 0)
            : '0'
          return (
            <TokenInformation
              key={token.iid}
              amountToken={amountToken}
              amountUSD={usdFormatter.fullValue.format(usdBalance)}
              icon={'logoURI' in token ? token.logoURI || '' : ''}
              symbol={token.symbol}
              type={token.type}
            />
          )
        })}
      </div>
      <div className="bg-bg-section  p-3 w-full rounded-[12px]">
        <span className="text-14px-normal ">
          {transactionData?.destinationTx?.status === 'REFUNDED'
            ? 'Refunded amount'
            : 'You received'}
        </span>
        {transactionData?.destinationTx?.status === 'REFUNDED' && transactionData.refundAmount ? (
          <TokenInformation
            key={transactionData.refundAmount.address}
            amountToken={transactionData.refundAmount.amount.toString()}
            amountUSD={usdFormatter.fullValue.format(
              transactionData.refundAmount.amountUSD.toString(),
            )}
            icon={
              'logoURI' in transactionData.refundAmount
                ? transactionData.refundAmount.logoURI || ''
                : ''
            }
            symbol={transactionData.refundAmount.symbol}
            type={
              typeof transactionData.refundAmount.type === 'string'
                ? TokenType[transactionData.refundAmount.type as keyof typeof TokenType] ?? TokenType.Token
                : transactionData.refundAmount.type ?? TokenType.Token
            }
          />
        ) : (
          outputTokens.map((token) => {
            const balance = solveIntentSuccessData?.balances.find(
              (ot) => ot.token.address.toLowerCase() === token.address.toLowerCase(),
            )
            const outputToken = solveIntentSuccessData?.outputTokenUsdPrices.find(
              (ot) => ot.address === token.address,
            )
            if (!outputToken) return null

            if (!balance) return null
            const usdBalance = BigNumber(balance.amount).multipliedBy(outputToken.priceUSD)

            return (
              <TokenInformation
                key={token.iid}
                amountToken={formatTokenAmount(Number(balance.amount), Number(outputToken.priceUSD) || 0)}
                amountUSD={usdFormatter.fullValue.format(usdBalance.toFixed())}
                symbol={token.symbol}
                icon={'logoURI' in token ? token.logoURI || '' : ''}
                type={token.type}
              />
            )
          })
        )}
      </div>

      <Accordion.Root
        className="w-full p-3 border border-stroke-grey-primary rounded-[12px]"
        type="single"
        value={openItem}
        onValueChange={(value) => setOpenItem(value)}
        collapsible
      >
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger className="w-full">
              <div className="flex w-full justify-between">
                <span className=" text-14px-medium">
                  {isOpen ? 'Hide Details' : 'Show Details'}
                </span>
                <RiArrowDownSLine
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                />
              </div>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div className="w-full">
              <TransactionOverview />
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  )
}

const TokenInformation = (props: CardTokenProps) => {
  const { amountToken, amountUSD, icon, color, symbol, type } = props

  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center justify-center">
        <Avatar alt="Token" src={icon} fallbackName={symbol} color={color} rootClassName="size-5" />
        <span className="text-16px-medium">{amountToken}</span>
        <span className="text-14px-medium">
          {String(symbol).length > 8 ? `${String(symbol).slice(0, 8)}...` : symbol}
        </span>
      </div>
      <span className="text-16px-medium">
        {type === TokenType.VarDebt ? '-' : ''}
        {amountUSD}
      </span>
    </div>
  )
}

export default SuccessTransaction
