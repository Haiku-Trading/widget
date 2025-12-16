
import { Dialog } from './dialog'
import { Tooltip } from './tooltip/tooltip'
import { Button } from './button/button'
import { Spinner } from './spinner'
import { cn, usdFormatter } from '../utils'
import { formatTokenAmount } from '../utils/numberFormatting'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { MutationStatus } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import BigNumber from 'bignumber.js'
import useEmblaCarousel from 'embla-carousel-react'
import { Children, useCallback, useEffect, useMemo, useState } from 'react'
import { useDotButton } from '../hooks/use-embla-dot-button'
import { useTradeStore } from '../providers'
import { useClassicSolveIntentQuery } from '../queries/use-solve-intent-query'
import { AnyAPIToken } from '../services/get-tokens'
import { SolveIntentResponse } from '../services/solve-intent'
import { useTransactionConfirmingStore } from '../stores/tx-confirming'
import { Card } from './card'
import { CardToken } from './card-token'
import SuccessTransaction from './dialog/success-transaction'
import { FeedbackDialog } from './feedback'
import { TransactionOverview } from './transaction-overview'
import { useTransactionQuery } from '../queries/use-transaction-query'
import { ShareIcon } from './icons'

type ConfirmSwapContentProps = {
  status: MutationStatus
  txHash: string
  txURL: string
  onConfirm: () => void
  onReset: () => void
  error?: string | Error | null
  inputTokenSuccessData?: AnyAPIToken[] | undefined
  outputTokenSuccessData?: AnyAPIToken[] | undefined
  inputPositionSuccessData?: Record<string, string>
  solveIntentSuccessData?: SolveIntentResponse
}
export function ConfirmSwapContent({
  status,
  txHash,
  txURL,
  onConfirm,
  onReset,
  error,
  inputTokenSuccessData,
  outputTokenSuccessData,
  inputPositionSuccessData,
  solveIntentSuccessData,
}: ConfirmSwapContentProps) {
  const [initialBalances, setInitialBalances] = useState<string | null>(null)
  const [bridgeProtocol, setBridgeProtocol] = useState<'RELAY' | 'LIFI' | 'LAYERZERO'>('RELAY')
  const { updateTransactionConfirming } = useTransactionConfirmingStore()

  const inputTokens = useTradeStore((state) => state.inputTokens)
  const inputPositions = useTradeStore((state) => state.inputPositions)
  const outputTokens = useTradeStore((state) => state.outputTokens)
  const usdInputTotal = useTradeStore((state) => state.usdInputTotal)
  const solveIntentQuery = useClassicSolveIntentQuery()
  const transactionQuery = useTransactionQuery(bridgeProtocol, txHash)

  const loadingDescriptions = useMemo(() => {
    if (!solveIntentQuery.data?.balances) return ''
    const tokensToDeposit = [...solveIntentQuery.data.balances].map(
      ({ amount, token }) => `${amount} ${token.symbol}`,
    )
    if (tokensToDeposit.length > 1) {
      const lastToken = tokensToDeposit.pop()
      return `${tokensToDeposit.join(', ')} and ${lastToken} will be deposited into your wallet once it's complete`
    }

    const lastToken = tokensToDeposit.pop()
    return `${lastToken} will be deposited into your wallet once it's complete`
  }, [solveIntentQuery.data?.balances])

  useEffect(() => {
    if (solveIntentQuery.data?.balances && !initialBalances) {
      setBridgeProtocol(solveIntentQuery.data.metadata?.bridgeProtocol || 'RELAY')
      const tokensToDeposit = [...solveIntentQuery.data.balances].map(
        ({ amount, token }) => `${amount} ${token.symbol}`,
      )
      if (tokensToDeposit.length > 1) {
        const lastToken = tokensToDeposit.pop()
        setInitialBalances(
          `${tokensToDeposit.join(', ')} and ${lastToken} deposited into your wallet`,
        )
      } else {
        const lastToken = tokensToDeposit.pop()
        setInitialBalances(`${lastToken} deposited into your wallet`)
      }
    }
  }, [
    solveIntentQuery.data?.balances,
    initialBalances,
    solveIntentQuery.data?.metadata?.bridgeProtocol,
  ])

  // TODO Currently unused - remove?
  // const successDescriptions = useMemo(() => {
  //   return initialBalances || ''
  // }, [initialBalances])

  const filteredInputTokens = inputTokens.filter((token) =>
    BigNumber(inputPositions[token.iid]).isGreaterThan(0),
  )

  const isUserRejectionError = (error: unknown): boolean => {
    if (error instanceof Error && error.message.toLowerCase().includes('user rejected')) {
      return true
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      return (error as { code: number }).code === 4001
    }

    return false
  }

  const isFeeBridgeChangeError = (error: unknown): boolean => {
    if (error instanceof AxiosError && error?.response?.data?.errorCode === '200000') {
      return true
    }
    return false
  }

  return (
    <>
      <Dialog.Title className="sr-only">Confirm Your Trade</Dialog.Title>
      <Dialog.Description className="sr-only">
        Review and confirm your token swap transaction details before proceeding.
      </Dialog.Description>
      <Dialog.Body className="bg-bg-primary rounded-2xl">
        {status === 'pending' && (
          <FeedbackDialog
            status="loading"
            title="Swapping Token..."
            description={loadingDescriptions}
          />
        )}

        {status === 'success' &&
          inputTokenSuccessData &&
          outputTokenSuccessData &&
          inputPositionSuccessData &&
          solveIntentSuccessData && (
            <SuccessTransaction
              filteredInputTokens={inputTokenSuccessData}
              outputTokens={outputTokenSuccessData}
              inputPositionSuccessData={inputPositionSuccessData}
              solveIntentSuccessData={solveIntentSuccessData}
              transactionData={transactionQuery.data}
            />
          )}
        {status === 'error' &&
          (() => {
            if (isUserRejectionError(error)) {
              return (
                <FeedbackDialog
                  status="error"
                  title="Transaction rejected by user."
                  description="Try again."
                />
              )
            }

            if (isFeeBridgeChangeError(error)) {
              return (
                <FeedbackDialog
                  status="warning"
                  title="Fee change detected"
                  description="The bridge fee has changed. Please try again with new quote."
                />
              )
            }

            return (
              <FeedbackDialog
                status="error"
                title="Transaction Failed"
                description="Try increasing your slippage setting and try again."
              />
            )
          })()}
        {/* AFTER DEVELOP CHANGE TO  filteredInputTokens*/}
        {/* {status === 'idle' && (
          <SuccessTransaction filteredInputTokens={inputTokens} outputTokens={outputTokens} />
        )} */}

        {status === 'idle' && (
          <div className="flex flex-col gap-6">
            <CardSlider title="Input">
              {filteredInputTokens.map((token) => {
                const tokenValue = inputPositions[token.iid]
                const usdBalance = BigNumber(tokenValue).multipliedBy(token.priceUSD).toFixed()
                const amountToken = tokenValue
                  ? formatTokenAmount(Number(tokenValue), Number(token.priceUSD) || 0)
                  : '0'

                return (
                  <CardToken
                    className="mb-3 w-[99%] mx-auto embla__slide flex-[0_0_100%] min-w-0"
                    type={token.type}
                    key={token.symbol}
                    amountToken={amountToken}
                    amountUSD={usdFormatter.fullValue.format(usdBalance)}
                    icon={'logoURI' in token ? token.logoURI || '' : ''}
                    symbol={token.symbol}
                    color={token.primaryColor ?? ''}
                    chainId={token.network}
                  />
                )
              })}
            </CardSlider>
            <CardSlider title="Output">
              {outputTokens.map((token) => {
                const balance = solveIntentQuery.data?.balances.find(
                  (ot) => ot.token.address.toLowerCase() === token.address.toLowerCase(),
                )
                if (!balance) return null

                // Using pre-calculated amountUSD from balances instead of calculating from outputTokenUsdPrices
                const usdBalance = BigNumber(balance.amountUSD)

                const percentage =
                  Math.round(
                    usdBalance.dividedBy(usdInputTotal).multipliedBy(100).toNumber() || 0,
                  ) / 100

                const valuePercent = Intl.NumberFormat(undefined, {
                  style: 'percent',
                }).format(percentage)

                return (
                  <CardToken
                    className="mb-3 w-[99%] mx-auto embla__slide flex-[0_0_100%] min-w-0"
                    type={token.type}
                    key={token.symbol}
                    amountToken={formatTokenAmount(Number(balance.amount), Number(balance.amountUSD) / Number(balance.amount) || 0)}
                    amountUSD={usdFormatter.fullValue.format(usdBalance.toFixed())}
                    icon={'logoURI' in token ? token.logoURI ?? '' : ''}
                    color={'primaryColor' in token ? token.primaryColor ?? '' : ''}
                    symbol={token.symbol}
                    valuePercent={valuePercent}
                    chainId={token.network}
                  />
                )
              })}
            </CardSlider>

            <TransactionOverview />
          </div>
        )}
      </Dialog.Body>
      <Dialog.Footer
        className={cn(
          !!transactionQuery.data?.destinationTx?.protocolTxLink && 'flex-col',
          'border-t-0',
        )}
      >
        {!!transactionQuery.data?.destinationTx?.protocolTxLink && (
          <div className="flex flex-col gap-2 items-center">
            <p className="font-medium text-foreground">See the details of your transaction</p>
            <div
              className={cn(
                'flex gap-1 w-full',
                '*:flex-1 *:rounded-full *:flex *:gap-1 *:items-center *:justify-center *:h-10 *:font-medium *:border *:border-transparent hover:*:border-border *:text-muted-foreground',
              )}
            >
              <Tooltip content="Source Chain Transaction" className="text-sm p-2 rounded-lg">
                {transactionQuery.isFetching ? (
                  <Spinner />
                ) : (
                  <a target="_blank" href={txURL}>
                    Source
                    <ShareIcon />
                  </a>
                )}
              </Tooltip>
              {transactionQuery.data?.sourceTx?.chainId !==
                transactionQuery.data?.destinationTx?.chainId && (
                <Tooltip
                  content={`${transactionQuery.data?.destinationTx?.status === 'REFUNDED' ? 'Refund Transaction' : 'Bridge Transaction'}`}
                  className="text-sm p-2 rounded-lg"
                >
                  {transactionQuery.isFetching ? (
                    <Spinner />
                  ) : (
                    <a target="_blank" href={transactionQuery.data?.destinationTx?.protocolTxLink}>
                      {transactionQuery.data?.destinationTx?.status === 'REFUNDED'
                        ? 'Refund'
                        : 'Bridge'}
                      <ShareIcon />
                    </a>
                  )}
                </Tooltip>
              )}

              <Tooltip
                content={
                  transactionQuery.data?.destinationTx?.status === 'REFUNDED' ? 'Refund' : 'Bridge'
                }
                className="text-sm p-2 rounded-lg"
              >
                {transactionQuery.isFetching ? (
                  <Spinner />
                ) : (
                  <a
                    href={transactionQuery.data?.destinationTx?.txLink}
                    target="_blank"
                    className={cn(!transactionQuery.data && 'pointer-events-none')}
                  >
                    {transactionQuery.data?.destinationTx?.status === 'REFUNDED'
                      ? 'Refund'
                      : 'Destination'}
                    <ShareIcon />
                  </a>
                )}
              </Tooltip>
            </div>
          </div>
        )}

        {!isFeeBridgeChangeError(error) && (
          <Dialog.Close asChild>
            <Button
              variant={transactionQuery.data?.destinationTx?.protocolTxLink ? 'primary' : 'outline'}
              className={cn(
                'h-10',
                !transactionQuery.data?.destinationTx?.protocolTxLink && 'flex-1',
              )}
              onClick={() => {
                updateTransactionConfirming(false)
              }}
            >
              {status === 'success' ? 'Close' : 'Cancel'}
            </Button>
          </Dialog.Close>
        )}

        {status === 'error' &&
          (() => {
            if (isFeeBridgeChangeError(error)) {
              return (
                <Dialog.Close asChild>
                  <Button 
                    onClick={onReset} 
                    className="flex-1 h-9 border" 
                    style={{ borderColor: 'hsl(var(--button-text))' }}
                  >
                    Try again
                  </Button>
                </Dialog.Close>
              )
            }
            return (
              <Button 
                onClick={onReset} 
                className="flex-1 h-9 border" 
                style={{ borderColor: 'hsl(var(--button-text))' }}
              >
                Try again
              </Button>
            )
          })()}

        {(status === 'idle' || status === 'pending') && (
          <Button 
            onClick={onConfirm} 
            className="flex-1 h-9 border" 
            style={{ borderColor: 'hsl(var(--button-text))' }}
            disabled={status === 'pending'}
          >
            {status === 'pending' ? 'Swapping...' : 'Confirm'}
          </Button>
        )}

        {status === 'success' && !transactionQuery.data?.destinationTx?.protocolTxLink && (
          <Button className="flex-1 h-9" disabled={transactionQuery.isFetching}>
            {transactionQuery.isFetching ? (
              <Spinner className="h-5 w-5 bg-transparent" />
            ) : (
              <a href={txURL} target="_blank" rel="noopener noreferrer">
                View Transaction
              </a>
            )}
          </Button>
        )}
      </Dialog.Footer>
    </>
  )
}

type CardSliderProps = {
  title: string
  children: React.ReactNode
}

function CardSlider({ title, children }: CardSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const sliderLength = Children.count(children)

  return (
    <Card variant="secondary" className="p-3 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-xs font-medium">{title}</p>
        <div className="w-full overflow-hidden">
          <div className="w-full embla overflow-hidden">
            <div className="embla__viewport" ref={emblaRef}>
              <div className="embla__container flex gap-2">{children}</div>
            </div>
            {sliderLength > 1 && (
              <div className="flex justify-between items-center pt-4">
                <button
                  disabled={!emblaApi?.canScrollPrev()}
                  className={cn(
                    'embla__prev size-7 rounded-full bg-primary inline-flex justify-center items-center',
                    'disabled:bg-tertiary',
                  )}
                  onClick={scrollPrev}
                >
                  <ChevronLeftIcon />
                </button>

                <div className="flex items-center gap-1.5">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => onDotButtonClick(index)}
                      className={cn(
                        'size-1.5 rounded-full bg-tertiary',
                        selectedIndex === index && 'bg-primary',
                      )}
                    />
                  ))}
                </div>

                <button
                  disabled={!emblaApi?.canScrollNext()}
                  className={cn(
                    'embla__next size-7 rounded-full bg-primary inline-flex justify-center items-center',
                    'disabled:bg-tertiary',
                  )}
                  onClick={scrollNext}
                >
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
