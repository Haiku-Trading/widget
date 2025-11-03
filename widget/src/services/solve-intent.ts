import { HttpClient } from '../models/http-client'
import * as common from '@mozaic-fi/intent-swapper-sdk-common'
import { AxiosRequestConfig } from 'axios'
import { BigNumberish } from 'ethers'
import { TypedDataField } from 'ethers5'
import { Address } from 'viem'
import { Chain } from '../enums/chains'
import { TBuildIntentPayloadInput } from '../models/api/swap'
import { getEndpoint } from './endpoints'
import { APIToken } from './get-tokens'
import { requester } from './requester'
import { BridgeMode } from '../enums/bridge-mode'

export const solveIntent = async (
  payload: SolveIntentPayload,
  httpClient: HttpClient,
  signal?: AbortSignal,
  identityToken?: string,
  isEIP7702?: boolean,
) => {
  const { inputPositions, targetWeights, ...intent } = payload.intent

  // CHECK ZERO VALUES, DO NOT SOLVE IF INPUTS OR OUTPUTS CONTAIN ZERO VALUES

  const hasZeroInInputPositions = Object.values(payload.intent.inputPositions || {}).some(
    (value) => Number(value) === 0,
  )
  const hasZeroInTargetWeights = Object.values(payload.intent.targetWeights || {}).some(
    (value) => value === 0,
  )

  if (hasZeroInInputPositions || hasZeroInTargetWeights) {
    return
  }

  const data = await httpClient.post<SolveIntentResponse>(
    '/widget/quote',
    {
      intent: {
        receiver: intent.receiver,
        slippage: intent.slippage,
        input_positions: inputPositions,
        target_weights: targetWeights,
        allowances_mode:
          process.env.SOLVER_PERMIT2_TYPE == 'approve' ? 'approve' : 'permit',
        is_eip7702: isEIP7702 || false,
        bridge_mode: intent.bridgeMode,
      },
      source: payload.source,
      session_id: payload.sessionID,
    },
    {
      signal,
      headers: {
        'api-key': '003f827f-b1da-4135-ac68-9a24fdd67599',
      },
    },
  )

  return data
}

export const buildIntent = async (
  payload: TBuildIntentPayloadInput,
  config?: AxiosRequestConfig,
  identityToken?: string,
): Promise<common.TransactionRequest | common.TransactionRequest[]> => {
  const { data } = await requester({
    headers: {
      'api-key': '003f827f-b1da-4135-ac68-9a24fdd67599',
    },
  }).post<common.TransactionRequest | common.TransactionRequest[]>(
    getEndpoint('BUILDINTENT'),
    payload,
    config,
  )

  return data
}

export const migrateVault = async (
  payload: MigrateVaultPayload,
  identityToken: string | null,
  config?: AxiosRequestConfig,
) => {
  const { data } = await requester({
    headers: {
      'api-key': '003f827f-b1da-4135-ac68-9a24fdd67599',
    },
  }).post<common.TransactionRequest[]>(getEndpoint('MIGRATEVAULT'), payload, config)

  return data
}

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

type Intent = {
  receiver: Address
  slippage?: number
  inputPositions: Record<string, string>
  targetWeights: Record<string, number>
  bridgeMode?: BridgeMode
}

export type SolveIntentPayload = {
  intent: Intent
  sessionID: string
  source?: 'widget'
}

type Token = {
  chainId: Chain
  address: Address
  decimals: number
  symbol: string
  name: string
}

type Amount<T extends Token> = {
  token: T
  amount: string
  amountUSD: string
  amountMinUSD: number
}

type Fund = Amount<Token>
type Fee = Amount<Token>
type Balance = Amount<Token>

type Input = {
  token: Address
  balanceBps: number
  amountOrOffset: BigNumberish
}

type Logic = {
  to: Address
  data: string
  inputs: Input[]
  wrapMode: number
  approveTo: Address
  callback: Address
}

type RouterBatchLogics = {
  logics: Logic[]
  fees: {
    token: string
    amount: BigNumberish
    metadata: Address
  }[]
  referrals: Address[]
  deadline: number
}

type Approval = {
  data: Address
  to: Address
}

type PermitDetails = {
  token: string
  amount: Address
  expiration: number
  nonce: number
}

type PermitBatch = {
  details: PermitDetails[]
  spender: Address
  sigDeadline: number
}

type Permit2Datas = {
  domain: {
    name: string
    chainId: Chain
    verifyingContract: Address
  }
  types: {
    PermitBatch: {
      name: string
      type: string
    }[]
    PermitDetails: {
      name: string
      type: string
    }[]
  }
  values: PermitBatch
}

type ExecutionBatchDetailsType = {
  domain: {
    name: string
    chainId: Chain
    verifyingContract: Address
  }
  types: Record<string, TypedDataField[]>
  values: Record<string, unknown>
}

export type SolveIntentResponse = {
  quoteId: string
  funds: Fund[]
  fees: Fee[]
  metadata:
    | {
        bridgeProtocol: 'RELAY' | 'LIFI'
      }
    | undefined
  signature: Address
  signer: Address
  balances: Balance[]
  routerBatchLogics: RouterBatchLogics
  approvals: Approval[]
  permit2Datas: Permit2Datas
  tokensReturn: string[]
  isComplexBridge: boolean
  destinationBridge?: {
    chainId: number
    unsignedTypeV4Digest: ExecutionBatchDetailsType
  }
  isEIP7702: boolean
  gas: {
    amount: number
    usd: string
  }
}

export type MigrateVaultPayload = {
  positions: Record<string, string>
  receiver: Address
}
