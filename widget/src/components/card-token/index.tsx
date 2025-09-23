import { cn } from '../../utils'
import { Avatar } from '../avatar'
import { AvatarTooltip } from '../avatar-tooltip'
import { Card } from '../card'
import * as React from 'react'
import { TokenType } from '../../enums/token-type'
import { Badge } from '../badge'
import { categoriesNamesByType, categoriesTypesBadge } from '../../constants/constants'

type CardTokenProps = {
  amountToken: string
  amountUSD: string
  icon: string
  className?: string
  type: TokenType
  color?: string
  valuePercent?: string
  symbol?: string
  chainId?: number
}

export function CardToken(props: CardTokenProps) {
  const { amountToken, amountUSD, icon, className, type, color, symbol, chainId } = props

  return (
    <Card variant="secondary" className={cn('p-3', className)}>
      <div className={cn('flex justify-between gap-4')}>
        <div className="flex flex-col w-full gap-2">
          <div className="flex justify-between items-center gap-1 w-full">
            <p title={amountToken} className="text-xl max-w-[79%] truncate text-foreground">
              {amountToken}
            </p>
            <div className="flex flex-col items-center justify-center gap-2">
              <Badge variant={categoriesTypesBadge[type as TokenType]}>
                {categoriesNamesByType[type || TokenType.Token]}
              </Badge>

              <AvatarTooltip
                alt="Token"
                src={icon || ''}
                fallbackName={symbol}
                chainId={chainId}
                color={color}
                rootClassName="size-7"
                tooltipContent={
                  <div className="flex items-center justify-center gap-1">
                    <Avatar
                      alt={symbol || 'Token'}
                      src={icon || ''}
                      fallbackName={symbol}
                      color={color}
                      rootClassName="size-7"
                    />
                  </div>
                }
              />
            </div>
          </div>
          <p className="text-muted-foreground text-xs font-medium">≈ {type == TokenType.VarDebt ? '-' : ''} {amountUSD}</p>
        </div>
      </div>
    </Card>
  )
}
