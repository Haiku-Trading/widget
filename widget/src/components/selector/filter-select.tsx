import { cn } from '../../utils'
import { CheckIcon } from '@radix-ui/react-icons'
import { ArrowUpDown } from 'lucide-react'
import { Select } from 'radix-ui'
import { FilterType } from '../dialog/chosen-token'

type FilterSelectProps = {
  value: FilterType
  onValueChange: (value: string) => void
}

const sortByField = [
  { label: 'Balances', value: 'default' },
  { label: 'Price change', value: 'priceChange' },
  { label: 'Volume', value: 'volume' },
  { label: 'APY', value: 'apy' },
  { label: 'TVL', value: 'tvl', disabled: false },
  { label: 'Market cap', value: 'marketCap' },
  { label: 'FDV', value: 'fdv' },
]
const orderField = [
  { label: 'Descending', value: 'descending' },
  { label: 'Ascending', value: 'ascending' },
]

export function FilterSelect({ value, onValueChange }: FilterSelectProps) {
  const activeSort =
    Object.entries(value).find(
      ([k, v]) => ['default', 'priceChange', 'marketCap', 'volume', 'fdv'].includes(k) && v,
    )?.[0] || 'defaults'

  return (
    <Select.Root
      value={`${activeSort}`}
      onValueChange={(selected) => {
        onValueChange(selected)
      }}
    >
      <Select.Trigger
        style={{ paddingLeft: '11px', paddingRight: '11px' }}
        className="w-[38px] items-center justify-center p-2 flex gap-1 rounded-lg bg-bg-section text-sm outline-none duration-150"
      >
        {/* Filter
        <Select.Icon className="transition-transform duration-200 group-data-[state=open]:rotate-180">
          <ChevronDownIcon />
        </Select.Icon> */}
        <ArrowUpDown className="w-4 h-4" />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          align="end"
          sideOffset={4}
          className={cn(
            'bg-bg-surface border border-stroke-grey-primary rounded-lg max-h-[450px] overflow-auto',
          )}
          style={{
            boxShadow: '0px 4px 20.6px 0px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Select.Viewport className="p-2 flex flex-col gap-1">
            {/* Sort by */}
            <div className="px-2 py-1 text-xs text-orange-400">Sort by</div>
            {sortByField.map((item) => (
              <Select.Item
                disabled={item.disabled}
                key={item.value}
                value={item.value}
                className={cn(
                  'p-2 text-sm rounded-lg',
                  item.disabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'cursor-pointer data-[highlighted]:bg-bg-section',
                )}
              >
                <Select.ItemText>
                  <div className="flex gap-1 items-center">
                    {item.label} {item.value === value.sort && <CheckIcon className="w-4 h-4" />}
                  </div>
                </Select.ItemText>
              </Select.Item>
            ))}

            {/* Order */}
            <div className="px-2 py-1 text-xs text-orange-400 mt-2">Order</div>
            {orderField.map((item) => (
              <Select.Item
                key={item.value}
                value={item.value}
                className="p-2 text-sm cursor-pointer data-[highlighted]:bg-bg-section rounded-lg"
              >
                <Select.ItemText>
                  <div className="flex gap-1">
                    {item.label} {item.value === value.order && <CheckIcon className="w-4 h-4" />}
                  </div>
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
