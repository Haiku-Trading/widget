import { ChevronDownIcon } from '../icons'
import { cn } from '../../utils'
import { Select } from 'radix-ui'
import { ChainSelect } from './chain-select'
import { ProtocolSelect } from './protocol-select'
import { getChainIcon } from '../../utils/chain-utils'

type CommonSelectProps = {
  valueChain: string
  onValueChainChange: (value: string) => void
  valueProtocol: string[]
  onValueProtocolChange: (value: string[]) => void
}

const CommonSelect = ({
  valueChain,
  onValueChainChange,
  valueProtocol,
  onValueProtocolChange,
}: CommonSelectProps) => {
  return (
    <Select.Root value={valueChain}>
      <Select.Trigger className="group flex items-center gap-1  text-sm outline-none duration-150 mr-2">
        {/* <Select.Value /> */}
        <div className="w-5 h-5 flex items-center justify-center">
          {valueChain === 'all-chains' ? (
            <div className="grid grid-cols-2 gap-0 w-5 h-5">
              {getChainIcon('1', 'w-2.5 h-2.5', 10)}
              {getChainIcon('80094', 'w-2.5 h-2.5', 10)}
              {getChainIcon('56', 'w-2.5 h-2.5', 10)}
              {getChainIcon('8453', 'w-2.5 h-2.5', 10)}
            </div>
          ) : (
            <div>
              {getChainIcon(valueChain, 'w-5 h-5', 20)}
            </div>
          )}
        </div>

        <Select.Icon className="transition-transform duration-200 group-data-[state=open]:rotate-180">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          // align="end"
          // sideOffset={4}
          align="start"
          side="top"
          // sideOffset={-200}
          // alignOffset={-100}
          style={{
            transform: 'translate(-195%, -15.5%)',
            marginBottom: '10px',
          }}
          className={cn('flex flex-row gap-4 px-4 h-[677px]')}
        >
          <div className="flex-row gap-4 !flex" style={{ display: 'flex !important' }}>
            <div className="flex-1 w-full" style={{ flex: '1 1 0%' }}>
              <ProtocolSelect
                chain={valueChain}
                value={valueProtocol}
                onValueChange={onValueProtocolChange}
              />
            </div>
            <div className="flex-1 w-full" style={{ flex: '1 1 0%' }}>
              <ChainSelect
                value={valueChain}
                onValueChange={onValueChainChange}
                onValueProtocolChange={onValueProtocolChange}
              />
            </div>
          </div>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default CommonSelect
