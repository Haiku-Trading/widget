import { TradeAlert } from "../../enums/trade-alert"

export type TradeAlertsType = {
  isActive: boolean
  type: TradeAlert
  message: string  
}