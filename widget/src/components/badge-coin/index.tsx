/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Badge } from '../badge'

import { Avatar } from '../avatar'
import { XMarkIcon } from '../icons'

type BadgeCoinProps = {
  coin: string
  icon: string
  color: string
  symbol?: string
  onDismiss?: () => void
}

export function BadgeCoin({ coin, color, icon, onDismiss, symbol }: BadgeCoinProps) {
  return (
    <Badge
      className="flex items-center justify-start gap-1 pl-1"
      style={{ backgroundColor: color }}
    >
      <Avatar color={color} fallbackName={symbol} src={icon} alt="Coin icon" rootClassName="size-5" />
      <span className="text-xs">{coin}</span>
      <button onClick={onDismiss}>
        <XMarkIcon />
      </button>
    </Badge>
  )
}
