import { AlertDialog } from '../alert-dialog'
import { Button } from '../button/button'
import { cn } from '../../utils'

import BigNumber from 'bignumber.js'
import React, { useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/shallow'
import { TradeAlertId, getTradeAlertMessage } from '../../constants/constants'
import { TokenType } from '../../enums/token-type'
import { TradeAlert } from '../../enums/trade-alert'
import { useTradeStore } from '../../providers'

enum AlertView {
  Warnings = 'warnings',
  Errors = 'errors',
}

const TradeAlerts = () => {
  const { alerts, addMoreAlerts, inputTokens, outputTokens, usdInputTotal, inputPositions } =
    useTradeStore(useShallow((state) => state))
  const activeWarnings = useMemo(
    () =>
      alerts.filter((alert) => alert.type === TradeAlert.Warning).filter((alert) => alert.isActive),
    [alerts],
  )

  const activeErrors = useMemo(
    () =>
      alerts.filter((alert) => alert.type === TradeAlert.Error).filter((alert) => alert.isActive),
    [alerts],
  )

  // Automatically select the appropriate tab based on available alerts
  const [view, setView] = React.useState<AlertView>(() => {
    // If there are errors, show errors by default
    if (activeErrors.length > 0) {
      return AlertView.Errors
    }
    // If there are warnings but no errors, show warnings
    if (activeWarnings.length > 0) {
      return AlertView.Warnings
    }
    // Default to warnings if no alerts
    return AlertView.Warnings
  })

  // Update view when alerts change
  React.useEffect(() => {
    if (activeErrors.length > 0 && view === AlertView.Warnings) {
      setView(AlertView.Errors)
    } else if (activeErrors.length === 0 && activeWarnings.length > 0 && view === AlertView.Errors) {
      setView(AlertView.Warnings)
    }
  }, [activeErrors.length, activeWarnings.length, view])

  useEffect(() => {
    const totalDebts = outputTokens
      .filter((token) => token.type === TokenType.VarDebt)
      .reduce((acc, token) => {
        return acc.plus(token.priceUSD)
      }, new BigNumber(0))

    const hasTokens = inputTokens.length > 0 && outputTokens.length > 0

    const addDebtWithoutCollateral =
      hasTokens &&
      outputTokens.some((token) => token.type === TokenType.VarDebt) &&
      inputTokens.every((token) => token.type !== TokenType.Collateral)

    const exceedSafeBorrowLimit =
      hasTokens &&
      inputTokens.some(
        (token) =>
          token.type === TokenType.Collateral &&
          BigNumber(inputPositions[token.iid]).isGreaterThan(0),
      ) &&
      outputTokens.some(
        (token) =>
          token.type === TokenType.VarDebt && BigNumber(inputPositions[token.iid]).isGreaterThan(0),
      ) &&
      BigNumber(usdInputTotal).isLessThanOrEqualTo(totalDebts)

    const removeCollateralWithDebt =
      hasTokens &&
      inputTokens.some(
        (token) =>
          token.type === TokenType.Collateral &&
          BigNumber(inputPositions[token.iid]).isGreaterThan(0),
      ) &&
      outputTokens.every((token) => token.type !== TokenType.Collateral) &&
      totalDebts.isGreaterThan(0)

    addMoreAlerts([
      {
        isActive: addDebtWithoutCollateral,
        message: getTradeAlertMessage(TradeAlertId.AddDebtWithoutCollateral)?.description || '',
        type: TradeAlert.Warning,
      },
      {
        isActive: exceedSafeBorrowLimit,
        message: getTradeAlertMessage(TradeAlertId.ExceedSafeBorrowLimit)?.description || '',
        type: TradeAlert.Error,
      },
      {
        isActive: removeCollateralWithDebt,
        message: getTradeAlertMessage(TradeAlertId.RemoveCollateralWithDebt)?.description || '',
        type: TradeAlert.Warning,
      },
    ])
  }, [inputPositions, inputTokens, outputTokens, addMoreAlerts, usdInputTotal])

  return (
    <AlertDialog.Content
      position="fixed"
      className={cn(
        'w-[450px] fixed top-[45%] left-[45%] z-50 rounded-xl shadow-lg',
      )}
    >
      <AlertDialog.Header>
        <AlertDialog.Title>Active Alerts</AlertDialog.Title>
        <AlertDialog.Description className="sr-only">
          Review warnings and errors for your current trade configuration.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <div className="w-full flex items-center justify-start gap-2">
          <button
            onClick={() => setView(AlertView.Warnings)}
            className={cn(
              'text-sm text-warning-text font-medium',
              view !== AlertView.Warnings && 'opacity-50',
            )}
          >
            Warnings ({activeWarnings.length})
          </button>
          <button
            onClick={() => setView(AlertView.Errors)}
            className={cn(
              'text-sm text-failed font-medium',
              view !== AlertView.Errors && 'opacity-50',
            )}
          >
            Errors ({activeErrors.length})
          </button>
        </div>
        {view === AlertView.Errors ? (
          <>
            {activeErrors.map((warning) => (
              <AlertDialog.Error errorText={false} key={warning.message}>
                {warning.message}
              </AlertDialog.Error>
            ))}
          </>
        ) : (
          <>
            {activeWarnings.map((error) => (
              <AlertDialog.Warning errorText={false} key={error.message}>
                {error.message}
              </AlertDialog.Warning>
            ))}
          </>
        )}
      </AlertDialog.Body>
      <div className="p-6">
        <AlertDialog.Cancel className="w-full">
          <Button variant="outline" className="h-10">
            Close
          </Button>
        </AlertDialog.Cancel>
      </div>
    </AlertDialog.Content>
  )
}

export default TradeAlerts
