import { RiEyeLine, RiEyeOffLine, RiResetLeftLine } from '@remixicon/react'
import { useEIP7702 } from '../hooks/use-eip-7702'
import { useClassicTokensBalancesQuery } from '../queries'
import { cn } from '../utils'
import { AlertDialog } from './alert-dialog'
import { Button } from './button/button'
import { ClientOnly } from './client-only'
import {
  Content as PopoverContent,
  PopoverRoot,
  Trigger as PopoverTrigger,
} from './popover'
import { Switch } from './switch'
import { TextField } from './text-field'
import { Item as ToggleGroupItem, Root as ToggleGroupRoot } from './toggle-group'
import { Tooltip } from './tooltip/tooltip'
// import { RiResetLeftLine, RiRefreshLine } from '@remixicon/react'
import { useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { baseSlippages } from '../constants/constants'
import { TradeAlert } from '../enums/trade-alert'
import { useTradeStore } from '../providers'
import { defaultTradeInitState } from '../stores'
import { useStableCallback } from '../utils/react-19-compat'
import BridgeModeToogle from './bridge-mode-toogle'
import { ErrorIcon, InfoIcon, InfoOutlineIcon, Setting2Icon } from './icons'
import { Popup } from './popup'
import TradeAlerts from './trade-alerts'

const EIP7702Switch = ({
  isEIP7702,
  switchEIP7702,
  canToggleEIP7702,
}: {
  isEIP7702: boolean
  switchEIP7702: () => void
  canToggleEIP7702: boolean
}) => {
  return (
    <div className="flex items-center gap-2 justify-between mt-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Smart Account Mode</span>
        <Popup
          content={
            <p>
              {!canToggleEIP7702 ? (
                <span>
                  Smart Accounts are only supported with Metamask. Please switch to Metamask to continue.{' '}
                  <a href="https://support.metamask.io/configure/accounts/what-is-a-smart-account/" target="_blank" rel="noopener noreferrer" className="text-primary">
                    Learn more
                  </a>
                </span>
              ) : (
                'Smart Account Mode will be used automatically when the intents involve vaults. The regular Haiku router will be used for all other intents.'
              )}
            </p>
          }
        >
          <div className="flex items-center gap-2">
            <InfoIcon width={16} height={16} className="text-foreground cursor-pointer flex-shrink-0" />
          </div>
        </Popup>
      </div>

      <Switch
        checked={isEIP7702}
        onCheckedChange={switchEIP7702}
        disabled={!canToggleEIP7702}
        size="medium"
      />
    </div>
  )
}

type TradeHeaderProps = {
  tokenBalancesQuery:
    | ReturnType<typeof useClassicTokensBalancesQuery>
}

export function TradeHeader({ tokenBalancesQuery }: TradeHeaderProps) {
  const alerts = useTradeStore((state) => state.alerts)
  const slippage = useTradeStore((state) => state.slippage)
  const { isTokenView, setIsTokenView, reset, inputTokens, outputTokens } = useTradeStore(
    useShallow((state) => ({
      isTokenView: state.isTokenView,
      setIsTokenView: state.setIsTokenView,
      reset: state.reset,
      inputTokens: state.inputTokens,
      outputTokens: state.outputTokens,
    })),
  )
  const setValue = useTradeStore((state) => state.setSlippage)
  const activeAlerts = useMemo(() => alerts.filter((alert) => alert.isActive), [alerts])

  const handleShowBalance = useTradeStore((state) => state.handleShowBalance)
  const isShowBalance = useTradeStore((state) => state.isShowBalance)

  const [customValue, setCustomValue] = useState('')
  const [selectedValue, setSelectedValue] = useState(slippage)
  const defaultSlippage = defaultTradeInitState.slippage

  const warningSlippage = customValue && Number(customValue) > 1
  const errorSlippage = customValue && Number(customValue) >= 50

  const handleSelectChange = useCallback((newValue: string) => {
    if (!newValue) return

    if (newValue === 'Custom') {
      setSelectedValue(newValue)
      setCustomValue('')
      setValue('')
    } else if (newValue !== null) {
      setSelectedValue(newValue)
      setValue(newValue)
      setCustomValue('')
    }
  }, [setValue])

  const handleResetSlippage = useCallback(() => {
    setSelectedValue(defaultSlippage)
    setCustomValue('')
    setValue(defaultSlippage)
  }, [setValue, defaultSlippage])

  // Create stable callbacks to prevent React 19 re-render issues
  const stableHandleSelectChange = useStableCallback(handleSelectChange)
  const stableHandleResetSlippage = useStableCallback(handleResetSlippage)
  
  // Stable no-op handlers for buttons inside Tooltip/Popover to prevent infinite loops
  const stableNoOpHandler = useStableCallback(() => {})
  
  // Stable handlers for other buttons
  const stableResetHandler = useStableCallback(() => reset())
  const stableToggleTokenViewHandler = useStableCallback(() => setIsTokenView(!isTokenView))

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    if (inputValue === '') {
      setCustomValue('')
      setValue('')
      return
    }
    if (inputValue.startsWith('.')) {
      inputValue = '0' + inputValue
    }
    const regex = new RegExp(/^(100|[0-9]{1,2}(\.\d{0,2})?)$/)
    if (regex.test(inputValue)) {
      setCustomValue(inputValue)
      const numericValue = Number(inputValue)
      if (numericValue >= 0 && numericValue <= 100) {
        const formattedValue = (numericValue / 100).toString()
        setValue(formattedValue)
      }
    }
  }

  const EyeIcon = isShowBalance ? RiEyeLine : RiEyeOffLine

  const { eip7702, toggleEIP7702, canToggleEIP7702 } = useEIP7702()

  const switchEIP7702 = useCallback(() => {
    toggleEIP7702()
    // Note: Query will automatically refetch when eip7702 changes due to query key dependency
  }, [toggleEIP7702])

  return (
    <div className="border-b border-b-border px-6 max-md:px-3 max-md:py-3 py-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1  text-14px-normal">
          {/* <EyeIcon className="cursor-pointer" onClick={handleShowBalance} size={17} />
          <p className="font-medium font-sans">Show Balances</p> */}
          {(inputTokens.length > 0 || outputTokens.length > 0) && (
            <button
              onClick={stableResetHandler}
              className="border-[0.69px] border-transparent hover:bg-bg-section rounded-[6.5px] w-7 h-7 flex items-center justify-center"
            >
              <RiResetLeftLine style={{ color: "hsl(var(--button-header-icon))"}} className="w-[18px] h-[18px] text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">

          <ClientOnly>
            <AlertDialog.Root>
              {activeAlerts.length > 0 && (
                <AlertDialog.Trigger>
                  <Button
                    alert
                    variant={
                      activeAlerts.find((item) => item.type === TradeAlert.Error)
                        ? 'failure'
                        : 'warning'
                    }
                    className="px-2"
                  >
                    {activeAlerts.length}
                  </Button>
                </AlertDialog.Trigger>
              )}
              <TradeAlerts />
            </AlertDialog.Root>
          </ClientOnly>

          <PopoverRoot>
            <PopoverTrigger>
              <Tooltip content="USD Input">
                <button
                  onClick={stableToggleTokenViewHandler}
                  className={cn(
                    "border-[0.69px] rounded-[6.5px] w-7 h-7 flex items-center justify-center transition-colors",
                    !isTokenView
                      ? "border-muted-background bg-bg-section hover:bg-bg-section/80"
                      : "border-transparent hover:bg-bg-section"
                  )}
                >
                  {/* <SettingsIcon className="w-4 text-[#191919]" /> */}
                  <span
                    style={{ color: "hsl(var(--button-header-icon))"}}
                    className={`text-18px-normal ${isTokenView ? 'text-muted-foreground' : 'text-primary'} `}
                  >
                    $
                  </span>
                </button>
              </Tooltip>
            </PopoverTrigger>
          </PopoverRoot>

          <PopoverRoot>
            <Tooltip content="Settings">
              <PopoverTrigger>
                {/* <button className="border-[0.69px] border-[#D9D9D9] rounded-[6.5px] w-7 h-7 flex items-center justify-center"> */}
                <button 
                  className="border-[0.69px]  border-transparent hover:bg-bg-section rounded-[6.5px] w-7 h-7 flex items-center justify-center"
                  onClick={stableNoOpHandler}
                >
                  <Setting2Icon style={{ color: "hsl(var(--button-header-icon))"}} className="w-[18px] h-[18px] text-muted-foreground" />
                </button>
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[206px] p-3"
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <div className="flex flex-col gap-2">
                <Popup
                  content={
                    <p>
                      Slippage tolerance is the acceptable price difference for your trade.
                      Increasing slippage may improve execution but could result in a lower final
                      amount.
                    </p>
                  }
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground">Slippage</p>
                    <button onClick={stableNoOpHandler}>
                      <InfoIcon width={16} height={16} className="text-sec-border cursor-pointer flex-shrink-0" />
                    </button>
                  </div>
                </Popup>
                <div className="flex flex-col gap-2">
                  <ToggleGroupRoot
                    type="single"
                    value={selectedValue}
                    onValueChange={stableHandleSelectChange}
                    className="gap-1 py-0 min-h-fit"
                  >
                    {baseSlippages.map((item) => (
                      <ToggleGroupItem size="xs" variant="filled" value={item.value} key={item.id}>
                        {item.label}
                      </ToggleGroupItem>
                    ))}
                    {selectedValue === 'Custom' ? (
                      <TextField
                        placeholder="1.5%"
                        containerClassName="cursor-pointer text-xs rounded-lg flex items-center justify-center h-8 disabled:opacity-50 disabled:cursor-not-allowed w-[58px] bg-bg-surface"
                        onChange={handleCustomInputChange}
                        value={customValue}
                        type="text"
                      />
                    ) : (
                      <ToggleGroupItem size="xs" variant="filled" value="Custom">
                        Custom
                      </ToggleGroupItem>
                    )}
                  </ToggleGroupRoot>
                  {process.env.TURN_OFF_EIP7702 !== 'true' && (
                    <EIP7702Switch
                      isEIP7702={eip7702}
                      switchEIP7702={switchEIP7702}
                      canToggleEIP7702={canToggleEIP7702}
                    />
                  )}
                  {process.env.VERCEL_ENV !== 'production' && <BridgeModeToogle />}
                </div>

                {(warningSlippage || errorSlippage) && (
                  <div
                    className={cn(
                      'flex items-center gap-2 p-3 justify-center rounded-xl flex-col',
                      {
                        'bg-slippage-warning-bg/10 text-slippage-warning-text': warningSlippage,
                        'bg-slippage-error-bg/10 text-slippage-error-text': errorSlippage,
                      },
                    )}
                  >
                    <div className="flex gap-2 items-start">
                      {warningSlippage ? (
                        <InfoOutlineIcon className="size-4 min-w-[14px]" />
                      ) : (
                        <ErrorIcon className="size-4 min-w-[14px]" />
                      )}

                      <p className="text-sm font-medium">
                        {errorSlippage
                          ? 'Enter a valid slippage percentage.'
                          : warningSlippage
                            ? 'Your transaction may be frontrun.'
                            : ''}
                      </p>
                    </div>

                    <p className="text-sm">
                      <span
                        onClick={stableHandleResetSlippage}
                        className="cursor-pointer font-medium underline"
                      >
                        Reset slippage settings
                      </span>{' '}
                      to avoid potential loss.
                    </p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </PopoverRoot>
        </div>
      </div>
    </div>
  )
}
