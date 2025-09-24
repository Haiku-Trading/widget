

import { mappingErrorCodeMessage } from './../constants/constants'
import { useEIP7702 } from '../hooks/use-eip-7702'
import { Avatar } from './avatar'
import { Button } from './button/button'
import { ClientOnly } from './client-only'
import { Dialog } from './dialog'
import { Spinner } from './spinner'
import { usdFormatter } from '../utils'
import { RiAddLine } from '@remixicon/react'
import { getWalletClient } from '@wagmi/core'
import { AxiosError } from 'axios'
import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAccount, useConfig } from 'wagmi'
import { mappingChainNameToChainId } from '../constants/constants'
import { useConfig as useWidgetConfig } from '../providers/config-provider'
import { usePreselectedTokensContext } from '../providers/preselected-tokens-provider'
import { TokenType } from '../enums/token-type'
import { TradeAlert } from '../enums/trade-alert'
import { useSwapOutputTotal } from '../hooks'
import { useGetTransactionURL } from '../hooks/use-get-transaction-url'
import { useTradeStore } from '../providers'
import { useQueryClient } from '@tanstack/react-query'
import { tradeKeys } from '../queries'
import { useSwapMutation } from '../queries/mutations'
import { useClassicSolveIntentQuery } from '../queries/use-solve-intent-query'
import { AnyAPIToken, APIToken } from '../services/get-tokens'
import { SolveIntentResponse } from '../services/solve-intent'
import { useTransactionConfirmingStore } from '../stores/tx-confirming'
import { ConfirmSwapContent } from './confirm-swap-content'
import { ChosenTokenDialogContent } from './dialog/chosen-token'
import { InputAssets } from './input-assets'
import { LimitAssetsWarningDialog } from './limit-assets-warning-dialog'
import { OutputAssets } from './output-assets'
import { SelectedTokensHeader } from './selected-tokens-header'
import { SwapDivider } from './swap-divider/swap-divider'
import { InfoOutlineIcon, HaikuBirdIcon } from './icons'

export function TradeBody() {
  const account = useAccount()
  const solveIntentQuery = useClassicSolveIntentQuery()
  const queryClient = useQueryClient()
  const { updateTransactionConfirming } = useTransactionConfirmingStore()
  const getTransactionURL = useGetTransactionURL()
  const { isResolvingPreselectedTokens } = usePreselectedTokensContext()

  const slippage = useTradeStore((state) => state.slippage)
  const addInputToken = useTradeStore((state) => state.addInputToken)
  const addOutputToken = useTradeStore((state) => state.addOutputToken)
  const inputTokens = useTradeStore((state) => state.inputTokens)
  const inputPositions = useTradeStore((state) => state.inputPositions)
  const outputTokens = useTradeStore((state) => state.outputTokens)
  const swapTokens = useTradeStore((state) => state.swapToken)
  const reset = useTradeStore((state) => state.reset)
  const removeOutputToken = useTradeStore((state) => state.removeOutputToken)
  const usdInputTotal = useTradeStore((state) => state.usdInputTotal)
  const inputChainId = useTradeStore((state) => state.inputChainIds[0])
  const addMoreAlerts = useTradeStore((state) => state.addMoreAlerts)
  const removeAlerts = useTradeStore((state) => state.removeAlerts)
  const clearAlerts = useTradeStore((state) => state.clearAlerts)

  const usdOutputTotal = useSwapOutputTotal()

  const [inputExpand, setInputExpand] = useState(true)
  const [outputExpand, setOutputExpand] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [insufficientBalance, setInsufficientBalance] = useState({})
  const [txHash, setTxHash] = useState('')
  const [txURL, setTxURL] = useState('')
  const [type, setType] = useState<'input' | 'output' | null>(null)

  const [inputTokenSuccessData, setInputTokenSuccessData] = useState<AnyAPIToken[] | undefined>(
    undefined,
  )
  const [outputTokenSuccessData, setOutputTokenSuccessData] = useState<AnyAPIToken[] | undefined>(
    undefined,
  )

  const [inputPositionSuccessData, setInputPositionSuccessData] = useState<
    Record<string, string> | undefined
  >(undefined)
  const [solveIntentSuccessData, setSolveIntentSuccessData] = useState<
    SolveIntentResponse | undefined
  >(undefined)

  // Memoize the complex calculations to prevent unnecessary recalculations
  const hasSeiIntent = useMemo(() => {
    const hasSeiInInput = inputTokens.some((token) => token.network === 1329)
    const hasSeiInOutput = outputTokens.some((token) => token.network === 1329)
    return hasSeiInInput !== hasSeiInOutput
  }, [inputTokens, outputTokens])

  // Memoize the input positions check to prevent unnecessary iterations
  const hasValidInputPositions = useMemo(() => {
    return Object.values(inputPositions).some((position) => Number(position) > 0)
  }, [inputPositions])

  // Memoize the error message calculation
  const getErrorMessage = useCallback(
    (failure: AxiosError | undefined) => {
      if (failure?.response?.status === 500) {
        return hasSeiIntent
          ? 'Bridge is not supported'
          : 'This intent could not be solved right now. Please try again in a few minutes'
      }
      return failure?.message || 'An error occurred'
    },
    [hasSeiIntent],
  )

  // Memoize the alert removal function with debouncing
  const removeAllErrorAlerts = useCallback(() => {
    // Debounce the alert removal to prevent rapid state updates
    const timeoutId = setTimeout(() => {
      Object.keys(mappingErrorCodeMessage).forEach((key) => {
        removeAlerts([
          {
            isActive: true,
            type: TradeAlert.Error,
            message: mappingErrorCodeMessage[key],
          },
        ])
      })
    }, 100) // 100ms debounce

    return () => clearTimeout(timeoutId)
  }, [removeAlerts])

  // Memoize the failure reason to prevent unnecessary re-renders
  const failureReason = useMemo(
    () => solveIntentQuery.failureReason,
    [solveIntentQuery.failureReason],
  )
  const hasError = useMemo(() => !!solveIntentQuery.error, [solveIntentQuery.error])

  useEffect(() => {
    // Early return if no tokens are selected
    if (inputTokens.length === 0 && outputTokens.length === 0) {
      clearAlerts()
      return
    }

    // Only proceed if we have a failure reason and valid input positions
    if (failureReason && hasValidInputPositions) {
      const failure = failureReason as AxiosError | undefined
      const updateMessage = getErrorMessage(failure)

      addMoreAlerts([
        {
          isActive: true,
          type: TradeAlert.Error,
          message: updateMessage,
        },
      ])
    } else if (!failureReason && !hasError) {
      // Remove all previous errors from the last request to path: /solveIntent
      removeAllErrorAlerts()
    }
  }, [
    inputTokens.length,
    outputTokens.length,
    failureReason,
    hasError,
    hasValidInputPositions,
    getErrorMessage,
    addMoreAlerts,
    removeAllErrorAlerts,
    clearAlerts,
  ])

  const addInsufficientBalance = useCallback((insufficientBalance: boolean, symbol: string) => {
    setInsufficientBalance((prev) => ({ ...prev, [symbol]: insufficientBalance }))
  }, [])
  const hasInsufficientBalance = Object.values(insufficientBalance).some((value) => value === true)

  const swapMutation = useSwapMutation(inputChainId)

  const handleSwapToken = () => {
    setInsufficientBalance({})
    // if (!inputTokens.length || !outputTokens.length) return
    swapTokens()
  }

  const handleSwap = () => {
    if (!solveIntentQuery.data) return

    updateTransactionConfirming(true)

    swapMutation.mutate(solveIntentQuery.data, {
      onSuccess: (receipt) => {
        setInputTokenSuccessData(inputTokens)
        setOutputTokenSuccessData(outputTokens)
        setInputPositionSuccessData(inputPositions)
        setSolveIntentSuccessData(solveIntentQuery.data ?? undefined)
        setTxHash(receipt.transactionHash)
        setTxURL(getTransactionURL(inputChainId, receipt.transactionHash))
        setIsSuccess(true)
        updateTransactionConfirming(false)
        setInsufficientBalance({})
        queryClient.invalidateQueries({ queryKey: tradeKeys.tokens() })
        queryClient.invalidateQueries({ queryKey: [account.address, 'balances'] })
      },
      onError: (error: unknown) => {
        console.log('ERROR', error instanceof Error ? error.message : String(error))
        updateTransactionConfirming(false)
      },
    })
  }

  // eslint-disable-next-line
  const resetOutputTokens = () => {
    outputTokens.forEach(removeOutputToken)
  }

  const handleAddInputToken = (tokens: AnyAPIToken[]) => {
    setType('input')
    addInputToken(tokens)
  }

  const handleAddOutputToken = (tokens: AnyAPIToken[]) => {
    setType('output')
    addOutputToken(tokens)
  }

  const renderNameButton = () => {
    if (!inputTokens.length || !outputTokens.length) return 'Select Assets'

    const hasZeroBalance = inputTokens.some(
      (token) => !BigNumber(inputPositions[token.iid] || 0).isGreaterThan(0),
    )

    return hasZeroBalance ? 'Enter amounts' : 'Swap'
  }

  const getChainIdFromPositions = (positions: Record<string, string>) => {
    const chainNameSet = new Set(Object.keys(positions).map((key) => key.split(':')[0]))
    return mappingChainNameToChainId[Array.from(chainNameSet)[0]]
  }

  const { eip7702 } = useEIP7702()
  const [disableWithVarDebt, setDisableWithVarDebt] = useState(false)
  const config = useConfig()

  useEffect(() => {
    async function checkVarDebtAndCapabilities() {
      const debtTokens = inputTokens.filter((token) => token.type === TokenType.VarDebt)

      const collateralTokens = inputTokens
        .filter((token) => token.type === TokenType.Collateral)
        .map((token) => {
          return {
            ...token,
            inputAmount: inputPositions[token.iid] || '0',
          }
        })

      if (debtTokens.length > 0 && (!collateralTokens || collateralTokens.length === 0)) {
        addMoreAlerts([
          {
            isActive: true,
            type: TradeAlert.Error,
            message:
              'You need to select an additional collateral token when your input includes a var debt token.',
          },
        ])

        setDisableWithVarDebt(true)
      } else {
        removeAlerts([
          {
            isActive: true,
            type: TradeAlert.Error,
            message:
              'You need to select an additional collateral token when your input includes a var debt token.',
          },
        ])
        setDisableWithVarDebt(false)
      }

      // Only proceed with wallet client checks if account is connected
      if (!account.isConnected || !account.address) {
        // If there are debt tokens but no connected account, we can't check EIP7702 support
        if (debtTokens.length > 0) {
          addMoreAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message: 'Please connect your wallet to use var debt tokens.',
            },
          ])
          setDisableWithVarDebt(true)
        }
        return
      }

      try {
        const chainId = getChainIdFromPositions(inputPositions)
        const walletClient = await getWalletClient(config, { chainId })
        const capabilities = await walletClient.getCapabilities({
          account: walletClient.account,
          chainId,
        })

        const isEIP7702 =
          (capabilities?.atomic?.status === 'supported' ||
            capabilities?.atomic?.status === 'ready') &&
          eip7702

        if (debtTokens.length > 0 && !isEIP7702) {
          addMoreAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message:
                'Debt in the input is not supported for EOA accounts. Please try again with a smart account wallet..',
            },
          ])
          setDisableWithVarDebt(true)
        } else {
          removeAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message:
                'Debt in the input is not supported for EOA accounts. Please try again with a smart account wallet..',
            },
          ])
          removeAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message: 'Please connect your wallet to use var debt tokens.',
            },
          ])
          removeAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message: 'Unable to connect to wallet. Please try reconnecting.',
            },
          ])
          setDisableWithVarDebt(false)
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        if (debtTokens.length > 0) {
          addMoreAlerts([
            {
              isActive: true,
              type: TradeAlert.Error,
              message:
                'Debt in the input is not supported for EOA accounts. Please try again with a smart account wallet..',
            },
          ])
        }
      }
    }

    if (config.connectors?.length > 0) {
      checkVarDebtAndCapabilities()
    }
  }, [config, eip7702, inputPositions, inputTokens, account.isConnected, account.address])

  return (
    <div className="flex-1 overflow-auto borde trade-body-scroll">
      <ClientOnly>
        <LimitAssetsWarningDialog type={type} onClose={() => setType(null)} />
      </ClientOnly>

      {Number(slippage) <= 0 && (
        <div className="p-6 pb-0">
          <div className="flex items-center text-foreground text-sm font-medium gap-1 bg-warning-bg/10 border border-warning-border rounded-xl p-3">
            <InfoOutlineIcon className="size-4 text-foreground" /> Slippage must be greater than 0
          </div>
        </div>
      )}

      {/* {inputTokens.length > 0 &&
        inputTokens.some((token) => BigNumber(inputPositions[token.iid] || 0).isEqualTo(0)) && (
          <div className="p-6 pb-0 pt-3">
            <div className="flex items-center text-foreground text-sm font-medium gap-1 bg-warning-bg/10 border border-warning-border rounded-xl p-3">
              <Info className="size-4 text-foreground" /> All input tokens must have a value
              greater than 0
            </div>
          </div>
        )} */}

      <div className="flex flex-col gap-6 justify-between p-6 pb-7">
        <div className="flex flex-col gap-2">
          {inputTokens.length === 0 && (
            <EmptyAssetsState type="input" onSelectTokens={handleAddInputToken} />
          )}

          {inputTokens.length > 0 && (
            <SelectedTokensHeader
              // label="I want to start here"
              label="From"
              isExpanded={inputExpand}
              onToggle={() => setInputExpand(!inputExpand)}
            />
          )}

          {inputTokens.length > 0 && !inputExpand && (
            <CollapsedTokensList
              tokens={inputTokens}
              usdTotal={usdInputTotal}
              label="Input total"
              type="input"
              onSelectTokens={handleAddInputToken}
            />
          )}

          {inputTokens.length > 0 && inputExpand && (
            <InputAssets
              onInsufficientBalance={addInsufficientBalance}
              onSelectTokens={handleAddInputToken}
            />
          )}
        </div>

        <SwapDivider onSwap={handleSwapToken} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            {outputTokens.length === 0 && (
              <EmptyAssetsState type="output" onSelectTokens={handleAddOutputToken} />
            )}

            {outputTokens.length > 0 && (
              <SelectedTokensHeader
                // label="I want to end here"
                label="To"
                isExpanded={outputExpand}
                onToggle={() => setOutputExpand(!outputExpand)}
              />
            )}

            {outputTokens.length > 0 && !outputExpand && (
              <CollapsedTokensList
                tokens={outputTokens}
                usdTotal={usdOutputTotal}
                label="Output total"
                type="output"
                onSelectTokens={handleAddOutputToken}
              />
            )}

            {outputTokens.length > 0 && outputExpand && (
              <OutputAssets onSelectTokens={handleAddOutputToken} />
            )}

            {/* <ResizableTargetWeights
              key={outputTokens.map((t) => t.iid).join('_')}
              tokens={outputTokens}
            /> */}
          </div>

          <div className="w-full ">
            <ClientOnly>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button
                    size="lg"
                    className="w-full bg-primary rounded-full text-primary-foreground disabled:bg-disabled"
                    disabled={
                      disableWithVarDebt ||
                      !!solveIntentQuery.isFetching ||
                      !inputTokens.length ||
                      !outputTokens.length ||
                      inputTokens.some(
                        (token) => !BigNumber(inputPositions[token.iid] || 0).isGreaterThan(0),
                      ) ||
                      !BigNumber(usdInputTotal).isGreaterThan(0) ||
                      hasInsufficientBalance ||
                      !!(solveIntentQuery.data?.balances.length === 0) ||
                      (Number(slippage) <= 0 && Number(slippage) >= 10) ||
                      Number(slippage) === 0 ||
                      !!solveIntentQuery.error
                    }
                    onClick={() => {
                      updateTransactionConfirming(true)
                    }}
                  >
                    {solveIntentQuery.isFetching && !solveIntentQuery.failureReason && (
                      <Spinner className="text-white" />
                    )}
                    {renderNameButton()}
                  </Button>
                </Dialog.Trigger>
                <Dialog.Content
                  position="absolute"
                  // className="max-w-[440px] w-full z-50"
                  className="w-[440px]"
                  overlayClassName="bg-overlay/75"
                  // container={globalThis?.document?.querySelector('#swap-box')}
                  onCloseAutoFocus={() => {
                    swapMutation.reset()
                    if (isSuccess) {
                      reset()
                      resetOutputTokens()
                      setIsSuccess(false)
                      setTxHash('')
                      setTxURL('')
                    }
                  }}
                >
                  <ConfirmSwapContent
                    onConfirm={handleSwap}
                    onReset={swapMutation.reset}
                    status={swapMutation.status}
                    txHash={txHash}
                    txURL={txURL}
                    error={
                      swapMutation.error instanceof Error
                        ? swapMutation.error
                        : String(swapMutation.error)
                    }
                    inputTokenSuccessData={inputTokenSuccessData}
                    outputTokenSuccessData={outputTokenSuccessData}
                    inputPositionSuccessData={inputPositionSuccessData}
                    solveIntentSuccessData={solveIntentSuccessData}
                  />
                </Dialog.Content>
              </Dialog.Root>
            </ClientOnly>
          </div>
        </div>
        
        {/* Powered by text */}
        <div className="flex justify-center items-center">
          <HaikuBirdIcon className="w-4 h-4" />
          <p className="text-xs text-grey-secondary opacity-60 pl-1">
            Powered by Haiku x Biconomy
          </p>
        </div>
      </div>
    </div>
  )
}

type EmptyAssetsStateProps = {
  type: 'input' | 'output'
  onSelectTokens?: (tokens: APIToken[]) => void
}

function EmptyAssetsState({ type, onSelectTokens }: EmptyAssetsStateProps) {
  const [open, setOpen] = useState(false)
  const { isResolvingPreselectedTokens } = usePreselectedTokensContext()
  const { config: widgetConfig } = useWidgetConfig()
  const header = `${type === 'input' ? 'From' : 'To'}`
  const isLocked = type === 'input' ? widgetConfig.lockedInputs : widgetConfig.lockedOutputs
  
  // Determine if multi-selection is allowed based on type and config
  const isMultiSelectAllowed = type === 'input' ? widgetConfig.multiInput : widgetConfig.multiOutput
  
  return (
    <div>
      <span className="text-16px-normal mt-3 mb-3">{header}</span>
      <div className="mt-3 bg-bg-section rounded-[32px] p-4">
        <div className="bg-bg-surface rounded-[16px] p-4 flex items-center justify-between">
          {isResolvingPreselectedTokens ? (
            <div className="flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              <p className="text-sm font-medium text-foreground">
                Loading preselected tokens...
              </p>
            </div>
          ) : isLocked ? (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground opacity-50">
                Tokens are locked
              </p>
            </div>
          ) : (
            <ClientOnly>
              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger>
                  <button className="bg-bg-section rounded-[18px] h-10 px-3 flex items-center gap-2">
                    <p className="text-sm font-medium whitespace-nowrap text-foreground">
                      {isMultiSelectAllowed ? 'Select Assets' : 'Select Asset'}
                    </p>
                    <RiAddLine size={16} className="text-foreground" />
                  </button>
                </Dialog.Trigger>
                <ChosenTokenDialogContent
                  type={type}
                  isOpen={open}
                  onSelectTokens={(tokens) => {
                    setOpen(false)
                    onSelectTokens?.(tokens)
                  }}
                />
              </Dialog.Root>
            </ClientOnly>
          )}

          <div className="flex flex-col gap-1">
            {/* <p className="text-xs text-grey-muted mb-1">Bal: $0.00</p> */}
            <p className="text-3xl font-medium text-grey-secondary">0.00</p>
            {/* <p className="text-grey-secondary text-xs">≈ $0.00</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

type CollapsedTokensListProps = {
  tokens: AnyAPIToken[]
  usdTotal: string | number
  label: string
  type: 'input' | 'output'
  onSelectTokens: (tokens: AnyAPIToken[]) => void
}

function CollapsedTokensList({
  tokens,
  usdTotal,
  label,
  type,
  onSelectTokens,
}: CollapsedTokensListProps) {
  const [open, setOpen] = useState(false)
  const { config: widgetConfig } = useWidgetConfig()
  const slicedInputTokens = tokens.slice(0, 2)
  
  // Determine if multi-selection is allowed based on type and config
  const isMultiSelectAllowed = type === 'input' ? widgetConfig.multiInput : widgetConfig.multiOutput
  const isLocked = type === 'input' ? widgetConfig.lockedInputs : widgetConfig.lockedOutputs

  return (
    <div className="bg-bg-section rounded-[32px] p-4 flex justify-between items-center relative">
      <div className="flex flex-col gap-2">
        <p className="font-medium text-sm text-grey-secondary">{tokens.length} tokens selected</p>
        <ul className="flex items-center [&>li+li]:translate-x-[calc(4px*var(--index)*-1)]">
          {slicedInputTokens.map((token, index) => (
            <li key={token.iid} style={{ ['--index' as string]: (index + 1).toString() }}>
              <Avatar
                src={'logoURI' in token ? token.logoURI : ''}
                alt={token.symbol}
                fallbackName={token.symbol}
                rootClassName="ring-[6px] ring-bg-section"
                color={token.primaryColor}
              />
            </li>
          ))}
          {tokens.length > 2 && (
            <li
              className="size-[38px] rounded-full ring-[6px] ring-bg-section bg-bg-surface flex items-center justify-center"
              style={{ ['--index' as string]: '3' }}
            >
              <span className="text-foreground">+{tokens.length - 2}</span>
            </li>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-2 text-right">
        <p className="font-medium text-sm text-foreground">{label}</p>
        <p className="font-medium text-lg text-foreground">{usdFormatter.fullValue.format(usdTotal)}</p>
      </div>

      {isMultiSelectAllowed && !isLocked && (
        <ClientOnly>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
              <button className="size-[30px] rounded-full flex items-center justify-center bg-bg-surface border border-stroke-grey-secondary absolute bottom-[-15px] left-1/2 -translate-x-1/2">
                <RiAddLine size={14} className="text-foreground" />
              </button>
            </Dialog.Trigger>
            <ChosenTokenDialogContent
              type={type}
              isOpen={open}
              onSelectTokens={(tokens) => {
                setOpen(false)
                onSelectTokens?.(tokens)
              }}
            />
          </Dialog.Root>
        </ClientOnly>
      )}
    </div>
  )
}
