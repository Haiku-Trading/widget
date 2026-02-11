import { Fragment } from 'react'
import { Splitter, useSplitter } from '@ark-ui/react'

import { Avatar } from './avatar'
import { useTradeStore } from '../providers'
import { AnyAPIToken } from '../services/get-tokens'

type ResizableTargetWeightsProps = {
  tokens: AnyAPIToken[]
}

export function ResizableTargetWeights({ tokens }: ResizableTargetWeightsProps) {
  const setTargetWeights = useTradeStore((state) => state.setTargetWeights)

  const pools = tokens.map((token) => {
    return {
      // We need to change the ":" to "_" in the token's iid
      // because the splitter component uses ":" to identify the panels and make ResizeTrigger component not work.
      id: token.iid.replace(':', '_'),
      name: token.name ?? token.symbol,
      color: token.primaryColor || '',
      icon: 'logoURI' in token ? token.logoURI : '',
      usdPrice: token.priceUSD,
      address: token.address,
      symbol: token.symbol,
    }
  })

  const panels = pools.map((pool) => ({ id: pool.id }))
  const defaultSize = pools.map(() => 100 / pools.length)

  const splitter = useSplitter({
    defaultSize,
    panels,
    onResize() {
      const targetWeights = pools.map((pool) => [
        // Normalize token id
        pool.id.replace('_', ':'),
        Math.round(splitter.getPanelSize(pool.id)) / 100,
      ])
      setTargetWeights(Object.fromEntries(targetWeights))
    },
  })

  return (
    <>
      <div className="flex flex-col gap-1">
        <Splitter.RootProvider value={splitter} className="rounded-xl">
          {pools.map((pool, index) => (
            <Fragment key={pool.id}>
              <Splitter.Panel
                id={pool.id}
                style={{ backgroundColor: pool.color }}
                className="h-5"
              />

              {index !== pools.length - 1 && (
                <Splitter.ResizeTrigger
                  id={`${pool.id}:${pools[index + 1].id}`}
                  className="bg-secondary w-[1px] relative flex justify-center items-center"
                >
                  <div className="bg-secondary w-1.5 h-3 absolute rounded-xl" />
                </Splitter.ResizeTrigger>
              )}
            </Fragment>
          ))}
        </Splitter.RootProvider>

        <div className="flex items-center w-full max-w-[65%] gap-1 flex-wrap">
          {pools.map((pool) => (
            <div
              key={pool.id}
              className="flex items-center gap-1 h-4 w-auto justify-center p-1 rounded-xl"
              style={{ backgroundColor: pool.color }}
            >
              <Avatar
                src={pool.icon}
                fallbackName={pool.symbol}
                color={pool.color}
                alt={`${pool.name} asset coin`}
                rootClassName="w-full h-3"
              />
              <p className="text-[10px] font-medium leading-normal text-white">
                {Math.round(splitter.getPanelSize(pool.id))}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
