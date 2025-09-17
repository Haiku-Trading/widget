import { Popup } from "./popup"

import { BridgeMode } from "../enums/bridge-mode"
import { useTradeStore } from "../providers"
import { InfoIcon } from './icons'

const BridgeModeToogle = () => {
    const bridgeMode = useTradeStore((state) => state.bridgeMode)
    const setBridgeMode = useTradeStore((state) => state.setBridgeMode)

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
                        <InfoIcon className="w-5 text-sec-border cursor-pointer" />
                    </div>
                </Popup>
            </div>
            <div className="flex gap-2 w-full">
                <button
                    onClick={() => setBridgeMode(BridgeMode.Fast)}
                    className={`flex-1 p-1 rounded-lg text-sm font-medium transition-all duration-200 ${bridgeMode === BridgeMode.Fast
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-filled text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Fast
                </button>
                <button
                    onClick={() => setBridgeMode(BridgeMode.Economy)}
                    className={`flex-1 p-1 rounded-lg text-sm font-medium transition-all duration-200 ${bridgeMode === BridgeMode.Economy
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-filled text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Economy
                </button>
            </div>
        </div>
    )
}

export default BridgeModeToogle