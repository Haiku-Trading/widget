'use client'

import { Button } from './button/button'
import { Dialog } from './dialog'

import { Checkbox } from './checkbox'
import { useLocalStorage } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { useTradeStore } from '../providers'

type LimitAssetsWarningDialogProps = {
  type: 'input' | 'output' | null
  onClose: () => void
}

export function LimitAssetsWarningDialog({ type, onClose }: LimitAssetsWarningDialogProps) {
  const { inputTokensLength, outputTokensLength } = useTradeStore(
    useShallow((state) => ({
      inputTokensLength: state.inputTokens.length,
      outputTokensLength: state.outputTokens.length,
    })),
  )
  const [showAgain, setShowAgain] = useLocalStorage('limit-warning-show-again', true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (showAgain) {
      if (type === 'input' && inputTokensLength === 5) {
        setOpen(true)
      }
      if (type === 'output' && outputTokensLength === 5) {
        setOpen(true)
      }
    }
  }, [type, inputTokensLength, outputTokensLength, showAgain])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Content className="max-w-[440px] w-full" onCloseAutoFocus={onClose}>
        <div className="p-5 flex gap-4">
          <div className="size-10 rounded-[10px] bg-[#F8D3D3] inline-flex justify-center items-center flex-shrink-0">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21.5C7.0293 21.5 3 17.4707 3 12.5C3 7.5293 7.0293 3.5 12 3.5C16.9707 3.5 21 7.5293 21 12.5C21 17.4707 16.9707 21.5 12 21.5ZM11.1 15.2V17H12.9V15.2H11.1ZM11.1 8V13.4H12.9V8H11.1Z"
                fill="#FB3748"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <p>Warning</p>
            <p className="text-sm text-muted-foreground">
              Selecting more than 4 assets may cause increased latency and failed transactions. For
              more complex trades, consider using our API or contact our support team via{' '}
              <a href="https://discord.com/invite/haiku-official" target="_blank">
                <strong>Discord</strong>
              </a>{' '}
              or{' '}
              <a href="https://t.me/haiku_trade" target="_blank">
                <strong>Telegram</strong>
              </a>
              .
            </p>
          </div>
        </div>
        <div className="px-5 py-4 flex justify-between items-center">
          <Checkbox
            label="Don't show it again"
            className="size-4"
            onCheckedChange={(checked) => {
              setShowAgain(checked ? false : true)
            }}
          />
          <Dialog.Close>
            <Button className="rounded-lg">Close</Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
