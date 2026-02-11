import { Popup } from "./popup"

import { BridgeMode } from "../enums/bridge-mode"
import { useTradeStore } from "../providers"
import { useConfig } from "../providers/config-provider"
import { InfoIcon } from './icons'

const BridgeModeToogle = () => {
    const bridgeMode = useTradeStore((state) => state.bridgeMode)
    const setBridgeMode = useTradeStore((state) => state.setBridgeMode)
    const { config } = useConfig()

    // Hide the toggle if bridgeMode is set to 'fast' or 'economy' in config
    // Only show when bridgeMode is 'open' or undefined (default behavior)
    if (config.bridgeMode === 'fast' || config.bridgeMode === 'economy') {
        return null
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm">Bridge Mode</span>
                <Popup
                    content={
                        <div>
                            <p className="font-bold">Fast Mode</p>
                            <p>Lightning-fast transfers for when time matters most. Best for complex transfers.</p>
                            <p className="font-bold mt-2">Economy Mode</p>
                            <p>Cheaper bridging with slower transfers (up to ~2 minutes). Best for simple transfers; may fail if complex.</p>
                        </div>
                    }
                >
                    <div className="flex items-center gap-2">
                        <InfoIcon width={16} height={16} className="text-sec-border cursor-pointer flex-shrink-0" />
                    </div>
                </Popup>
            </div>
            <div className="flex gap-2 w-full">
                <button
                    onClick={() => setBridgeMode(BridgeMode.Fast)}
                    className={`flex-1 p-1 rounded-lg text-sm font-medium transition-all duration-200 ${bridgeMode === BridgeMode.Fast
                        ? 'bg-bg-section border border-primary text-primary shadow-md'
                        : 'bg-bg-section text-foreground hover:bg-bg-section/75 border border-transparent'
                        }`}
                >
                    Fast
                </button>
                <button
                    onClick={() => setBridgeMode(BridgeMode.Economy)}
                    className={`flex-1 p-1 rounded-lg text-sm font-medium transition-all duration-200 ${bridgeMode === BridgeMode.Economy
                        ? 'bg-bg-section border border-primary text-primary shadow-md'
                        : 'bg-bg-section text-foreground hover:bg-bg-section/75 border border-transparent'
                        }`}
                >
                    Economy
                </button>
            </div>
        </div>
    )
}

export default BridgeModeToogle