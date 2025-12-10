import { ConnectButton, RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { arbitrum, avalanche, base, berachain, bsc, gnosis, katana, mainnet, optimism, polygon, scroll, sei, sonic, worldchain } from "wagmi/chains";
import CustomDarkColor from "./components/custom-colors/custom-dark-color";
import CustomLightColor from "./components/custom-colors/custom-light-color";
import { DEFAULT_CONFIG } from "./components/haiku-widget";
import { HaikuWidget, WidgetConfig, WidgetTheme } from "./index";
import { plasma } from "./providers/wagmi-config";
// Import dev showcase CSS (unscoped Tailwind for the showcase page)
// Note: This file is NOT included in the production widget build
import "./dev-main.css";
import { ColorPalette } from "./types/theme";

// Create a client
const queryClient = new QueryClient();

// Configure chains for development
const chains = [
    mainnet, // 1: Ethereum
    optimism, // 10: Optimism
    bsc, // 56: BNB Smart Chain
    gnosis, // 100: Gnosis
    polygon, // 137: Polygon
    arbitrum, // 42161: Arbitrum
    avalanche, // 43114: Avalanche
    base, // 8453: Base
    scroll, // 534352: Scroll
    berachain, // 80094: Berachain
    sei, // 1329: Sei
    worldchain, // 480: Worldchain
    katana, // 747474: Katana
    plasma, // 9745: Plasma
    sonic, // 146: Sonic
];

const config = getDefaultConfig({
    appName: "Haiku Swap Widget Demo",
    projectId: "559f57c80e698d3d95adb8d69e8b9228", // Get from https://cloud.walletconnect.com
    chains: chains as any,
});

// Available chains for the playground
const availableChains = [
    { id: 1, name: "Ethereum", chain: mainnet },
    { id: 10, name: "Optimism", chain: optimism },
    { id: 56, name: "BSC", chain: bsc },
    { id: 100, name: "Gnosis", chain: gnosis },
    { id: 137, name: "Polygon", chain: polygon },
    { id: 42161, name: "Arbitrum", chain: arbitrum },
    { id: 43114, name: "Avalanche", chain: avalanche },
    { id: 8453, name: "Base", chain: base },
    { id: 534352, name: "Scroll", chain: scroll },
    { id: 80094, name: "Berachain", chain: berachain },
    { id: 1329, name: "Sei", chain: sei },
    { id: 480, name: "Worldchain", chain: worldchain },
    { id: 747474, name: "Katana", chain: katana },
    { id: 9745, name: "Plasma", chain: plasma },
    { id: 146, name: "Sonic", chain: sonic },
];

// Available protocols for testing
const availableProtocols = ["AAVE_V3", "UNISWAP_V3", "SUSHISWAP", "CURVE", "BALANCER", "COMPOUND", "MAKER", "LIDO"];

// Example token IDs for testing
const exampleTokens = {
    inputs: [
        { id: "uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "ETH (Universal)" },
        { id: "base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "ETH (Base)" },
        { id: "polygon:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "MATIC (Polygon)" },
    ],
    outputs: [
        { id: "base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", name: "USDC (Base)" },
        { id: "base:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", name: "ETH (Base)" },
        { id: "polygon:0x2791bca1f2de4661ed88a30c99a7a9449aa84174", name: "USDC (Polygon)" },
    ],
};

function DevApp() {
    // Theme state
    const [configMode, setConfigMode] = useState<"light" | "dark" | "auto">("dark");
    const [previewMode, setPreviewMode] = useState<"light" | "dark">("dark");
    const [colorPaletteTab, setColorPaletteTab] = useState<"light" | "dark">("dark");

    // Light mode colors
    const [lightModeColors, setLightModeColors] = useState<ColorPalette>({
        primaryColor: "#3B82F6",
        backgroundColor: "#FFFFFF",
        borderColor: "#e2e8f0",
        button: "#f5f5f5",
        paper: "",
        mutedBackground: "#f5f5f5",
        primaryText: "#020817",
        secondaryText: "#666666",
        swapButton: "#f8fafc",
        iconsHeader: "#64748b",
        swapIcon: "#020817",
    });

    // Dark mode colors
    const [darkModeColors, setDarkModeColors] = useState<ColorPalette>({
        primaryColor: "#60A5FA",
        backgroundColor: "#0F172A",
        borderColor: "#1d283a",
        button: "#f5f5f5",
        paper: "",
        mutedBackground: "#1e293b",
        primaryText: "#f8fafc",
        secondaryText: "#b2bdcc",
        swapButton: "#f8fafc",
        iconsHeader: "#94a3b8",
        swapIcon: "#020817",
    });

    // Widget configuration state
    const [hiddenChains, setHiddenChains] = useState<number[]>([]);
    const [hiddenProtocols, setHiddenProtocols] = useState<string[]>([]);
    const [singleInput, setSingleInput] = useState(false);
    const [singleOutput, setSingleOutput] = useState(false);
    const [lockedInputs, setLockedInputs] = useState(false);
    const [lockedOutputs, setLockedOutputs] = useState(false);
    const [tokenSelect, setTokenSelect] = useState<'simple' | 'default'>('default');

    // Preselected tokens state
    const [preselectedInputs, setPreselectedInputs] = useState<Record<string, number>>({});
    const [preselectedOutputs, setPreselectedOutputs] = useState<Record<string, number>>({});

    // Input for adding new preselected tokens
    const [newInputTokenId, setNewInputTokenId] = useState("");
    const [newInputAmount, setNewInputAmount] = useState("");
    const [newOutputTokenId, setNewOutputTokenId] = useState("");
    const [newOutputWeight, setNewOutputWeight] = useState("");

    // Computed widget config
    const widgetConfig = useMemo((): WidgetConfig => {
        const theme: WidgetTheme = {
            mode: configMode,
            light: {
                primaryColor: lightModeColors.primaryColor,
                backgroundColor: lightModeColors.backgroundColor,
                button: lightModeColors.button,
                borderColor: lightModeColors.borderColor,
                mutedBackground: lightModeColors.mutedBackground,
                primaryText: lightModeColors.primaryText,
                secondaryText: lightModeColors.secondaryText,
                swapButton: lightModeColors.swapButton,
                iconsHeader: lightModeColors.iconsHeader,
                swapIcon: lightModeColors.swapIcon,
            },
            dark: {
                primaryColor: darkModeColors.primaryColor,
                backgroundColor: darkModeColors.backgroundColor,
                button: darkModeColors.button,
                borderColor: darkModeColors.borderColor,
                mutedBackground: darkModeColors.mutedBackground,
                primaryText: darkModeColors.primaryText,
                secondaryText: darkModeColors.secondaryText,
                swapButton: darkModeColors.swapButton,
                iconsHeader: darkModeColors.iconsHeader,
                swapIcon: darkModeColors.swapIcon,
            },
        };

        return {
            theme,
            hiddenChains: hiddenChains.length > 0 ? hiddenChains : undefined,
            hiddenProtocols: hiddenProtocols.length > 0 ? hiddenProtocols : undefined,
            multiInput: !singleInput, // Convert single to multi
            multiOutput: !singleOutput, // Convert single to multi
            lockedInputs,
            lockedOutputs,
            preselectedInputs: Object.keys(preselectedInputs).length > 0 ? preselectedInputs : undefined,
            preselectedOutputs: Object.keys(preselectedOutputs).length > 0 ? preselectedOutputs : undefined,
            tokenSelect: tokenSelect !== 'default' ? tokenSelect : undefined,
        };
    }, [
        configMode,
        lightModeColors,
        darkModeColors,
        hiddenChains,
        hiddenProtocols,
        singleInput,
        singleOutput,
        lockedInputs,
        lockedOutputs,
        preselectedInputs,
        preselectedOutputs,
        tokenSelect,
    ]);

    // Preview config (uses previewMode for preview widget display)
    const previewConfig = useMemo((): WidgetConfig => {
        return {
            ...widgetConfig,
            theme: {
                ...widgetConfig.theme,
                mode: previewMode,
            },
        };
    }, [widgetConfig, previewMode]);

    // Simple remount approach: completely unmount and remount widget on config changes
    // This is only for the dev playground, not production code
    const [isWidgetMounted, setIsWidgetMounted] = useState(true);
    const prevConfigRef = React.useRef<string | null>(null);
    
    // When config changes, unmount and remount the widget completely
    useEffect(() => {
        const configString = JSON.stringify(previewConfig);
        
        // Skip on first mount
        if (prevConfigRef.current === null) {
            prevConfigRef.current = configString;
            return;
        }
        
        // If config actually changed, unmount then remount
        if (prevConfigRef.current !== configString) {
            prevConfigRef.current = configString;
            
            // Unmount
            setIsWidgetMounted(false);
            
            // Remount on next tick
            setTimeout(() => {
                setIsWidgetMounted(true);
            }, 0);
        }
    }, [previewConfig]);

    // Helper functions
    const toggleHiddenChain = (chainId: number) => {
        setHiddenChains((prev) => (prev.includes(chainId) ? prev.filter((id) => id !== chainId) : [...prev, chainId]));
    };

    const toggleHiddenProtocol = (protocol: string) => {
        setHiddenProtocols((prev) => (prev.includes(protocol) ? prev.filter((p) => p !== protocol) : [...prev, protocol]));
    };

    const addPreselectedInput = () => {
        if (newInputTokenId && newInputAmount) {
            const amount = parseFloat(newInputAmount);
            if (!isNaN(amount)) {
                setPreselectedInputs((prev) => ({
                    ...prev,
                    [newInputTokenId]: amount,
                }));
                setNewInputTokenId("");
                setNewInputAmount("");
            }
        }
    };

    const addPreselectedOutput = () => {
        if (newOutputTokenId && newOutputWeight) {
            const weight = parseFloat(newOutputWeight);
            if (!isNaN(weight)) {
                setPreselectedOutputs((prev) => ({
                    ...prev,
                    [newOutputTokenId]: weight,
                }));
                setNewOutputTokenId("");
                setNewOutputWeight("");
            }
        }
    };

    const removePreselectedInput = (tokenId: string) => {
        setPreselectedInputs((prev) => {
            const newInputs = { ...prev };
            delete newInputs[tokenId];
            return newInputs;
        });
    };

    const removePreselectedOutput = (tokenId: string) => {
        setPreselectedOutputs((prev) => {
            const newOutputs = { ...prev };
            delete newOutputs[tokenId];
            return newOutputs;
        });
    };

    const resetConfig = () => {
        setConfigMode("dark");
        setPreviewMode("dark");
        setColorPaletteTab("dark");

        // Reset light mode colors
        setLightModeColors({
            primaryColor: "#3B82F6",
            backgroundColor: "#FFFFFF",
            borderColor: "#e2e8f0",
            button: "#f5f5f5",
            paper: "",
            mutedBackground: "#f5f5f5",
            primaryText: "#020817",
            secondaryText: "#666666",
            swapButton: "#f8fafc",
            iconsHeader: "#64748b",
            swapIcon: "#020817",
        });

        setDarkModeColors({
            primaryColor: "#60A5FA",
            backgroundColor: "#0F172A",
            borderColor: "#1d283a",
            button: "#f5f5f5",
            paper: "",
            mutedBackground: "#1e293b",
            primaryText: "#f8fafc",
            secondaryText: "#b2bdcc",
            swapButton: "#f8fafc",
            iconsHeader: "#94a3b8",
            swapIcon: "#020817",
        });

        // Reset dark mode colors

        setHiddenChains([]);
        setHiddenProtocols([]);
        setSingleInput(false);
        setSingleOutput(false);
        setLockedInputs(false);
        setLockedOutputs(false);
        setTokenSelect('default');
        setPreselectedInputs({});
        setPreselectedOutputs({});
        setNewInputTokenId("");
        setNewInputAmount("");
        setNewOutputTokenId("");
        setNewOutputWeight("");
    };

    function getDiff(current: any, defaults: any): any {
        if (typeof current !== "object" || current === null) {
            return current === defaults ? undefined : current;
        }

        if (Array.isArray(current)) {
            return current.length > 0 ? current : undefined;
        }

        const diff: any = {};
        let hasChanges = false;

        for (const key in current) {
            const currentValue = current[key];
            const defaultValue = defaults?.[key];

            if (Array.isArray(currentValue)) {
                if (currentValue.length > 0) {
                    diff[key] = currentValue;
                    hasChanges = true;
                }
                continue;
            }

            if (typeof currentValue === "object" && currentValue !== null) {
                const nestedDiff = getDiff(currentValue, defaultValue);
                if (nestedDiff && Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                    hasChanges = true;
                }
                continue;
            }

            if (currentValue !== defaultValue) {
                diff[key] = currentValue;
                hasChanges = true;
            }
        }

        return hasChanges ? diff : undefined;
    }

    function generateComponentSnippet() {
        const configDiff = getDiff(widgetConfig, DEFAULT_CONFIG);

        if (!configDiff || Object.keys(configDiff).length === 0) {
            return `<HaikuWidget widgetKey="<YOUR_WIDGET_KEY>" />`;
        }

        const configString = JSON.stringify(configDiff, null, 2);
        // Indent each line of the JSON config to align within the JSX config prop
        // JSON.stringify produces 2-space indentation, we need 4 total (2 for JSX + 2 for config object)
        const lines = configString.split('\n');
        const indentedConfig = lines
            .slice(1, -1) // Skip first line (opening brace) and last line (closing brace)
            .map((line) => {
                // Add 2 more spaces to each line (JSON already has 2, we need 4 total)
                return '  ' + line;
            })
            .join('\n');
        
        return `<HaikuWidget
  widgetKey="<YOUR_WIDGET_KEY>"
  config={{
${indentedConfig}
  }}
/>`;
    }

    const copyConfig = async () => {
        try {
            const componentSnippet = generateComponentSnippet();
            await navigator.clipboard.writeText(componentSnippet);

            // Show success feedback
            const button = document.getElementById("copy-config-btn");
            if (button) {
                const originalText = button.textContent;
                button.textContent = "Copied!";
                button.style.backgroundColor = "#10b981";
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = "#3b82f6";
                }, 2000);
            }
        } catch (err) {
            console.error("Failed to copy config:", err);
            // Fallback for older browsers
            const componentSnippet = generateComponentSnippet();
            const textArea = document.createElement("textarea");
            textArea.value = componentSnippet;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
    };

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <div className="min-h-screen bg-gray-50 p-4">
                        <div className="max-w-7xl mx-auto">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Haiku Swap Widget Playground</h1>
                                <p className="text-lg text-gray-600 mb-2">Experiment with real-time configuration changes</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Customize your widget settings and copy the generated config to use in your application
                                </p>
                                <div className="flex justify-center mb-4">
                                    <ConnectButton />
                                </div>
                                <div className="flex gap-3 justify-center">
                                    <button
                                        onClick={copyConfig}
                                        id="copy-config-btn"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium border border-blue-600"
                                        style={{ backgroundColor: "#3b82f6", color: "white" }}>
                                        Copy Config
                                    </button>
                                    <button
                                        onClick={resetConfig}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium border border-red-600"
                                        style={{ backgroundColor: "#ef4444", color: "white" }}>
                                        Reset All Settings
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Controls Panel */}
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Theme Controls */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Theme</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                                                <select
                                                    value={configMode}
                                                    onChange={(e) => {
                                                        const newMode = e.target.value as "light" | "dark" | "auto";
                                                        setConfigMode(newMode);
                                                        // Update preview tabs when light or dark is selected, but not for auto
                                                        if (newMode === "light" || newMode === "dark") {
                                                            setPreviewMode(newMode);
                                                            setColorPaletteTab(newMode);
                                                        }
                                                    }}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="auto">Auto</option>
                                                </select>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Theme Colors</h3>

                                                <div className="rounded-lg border border-gray-300 bg-gray-50">
                                                    {/* Tabs */}
                                                    <div className="flex relative">
                                                        {["Light", "Dark"].map((tab) => {
                                                            const tabValue = tab.toLowerCase() as "light" | "dark";
                                                            const isActive = previewMode === tabValue;
                                                            return (
                                                                <button
                                                                    key={tab}
                                                                    onClick={() => {
                                                                        setPreviewMode(tabValue);
                                                                        setColorPaletteTab(tabValue);
                                                                    }}
                                                                    className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 border-b ${
                                                                        isActive
                                                                            ? "bg-gray-100 text-gray-500 hover:text-gray-700 border-transparent"
                                                                            : "bg-white text-gray-900 border-gray-300 shadow-sm"
                                                                    }`}
                                                                    style={{
                                                                        borderTopLeftRadius: tab === "Light" ? "8px" : "0",
                                                                        borderTopRightRadius: tab === "Dark" ? "8px" : "0",
                                                                    }}>
                                                                    {tab}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="h-[500px] p-4 bg-white rounded-b-lg overflow-auto">
                                                        {colorPaletteTab === "light" ? (
                                                            <CustomLightColor colorsObject={lightModeColors} setColorsObject={setLightModeColors} />
                                                        ) : (
                                                            <CustomDarkColor colorsObject={darkModeColors} setColorsObject={setDarkModeColors} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Widget Behavior Controls */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Widget Behavior</h3>

                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={singleInput}
                                                    onChange={(e) => setSingleInput(e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">Single Input</span>
                                            </label>

                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={singleOutput}
                                                    onChange={(e) => setSingleOutput(e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">Single Output</span>
                                            </label>

                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={lockedInputs}
                                                    onChange={(e) => setLockedInputs(e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">Locked Inputs</span>
                                            </label>

                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={lockedOutputs}
                                                    onChange={(e) => setLockedOutputs(e.target.checked)}
                                                    className="mr-2"
                                                />
                                                <span className="text-sm text-gray-700">Locked Outputs</span>
                                            </label>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Token Select Mode</label>
                                                <select
                                                    value={tokenSelect}
                                                    onChange={(e) => setTokenSelect(e.target.value as 'simple' | 'default')}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                    <option value="default">Default</option>
                                                    <option value="simple">Simple</option>
                                                </select>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Simple mode: Single unified section with inline filters
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hidden Chains */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hide Chains</h3>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {availableChains.map((chain) => (
                                                <label key={chain.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={hiddenChains.includes(chain.id)}
                                                        onChange={() => toggleHiddenChain(chain.id)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {chain.name} ({chain.id})
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hidden Protocols */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hide Protocols</h3>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {availableProtocols.map((protocol) => (
                                                <label key={protocol} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={hiddenProtocols.includes(protocol)}
                                                        onChange={() => toggleHiddenProtocol(protocol)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm text-gray-700">{protocol}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preselected Inputs */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preselected Inputs</h3>

                                        {/* Add new input */}
                                        <div className="space-y-2 mb-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Token ID (e.g., uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newInputTokenId}
                                                    onChange={(e) => setNewInputTokenId(e.target.value)}
                                                    placeholder="uni:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                                                    className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    value={newInputAmount}
                                                    onChange={(e) => setNewInputAmount(e.target.value)}
                                                    placeholder="1.0"
                                                    className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <button
                                                onClick={addPreselectedInput}
                                                className="w-full px-3 py-2 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600 transition-colors"
                                                style={{ backgroundColor: "#3b82f6", color: "white" }}>
                                                Add Input Token
                                            </button>

                                            {/* Quick examples */}
                                            <div className="text-xs text-gray-600 mb-2">Quick examples:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {exampleTokens.inputs.map((token) => (
                                                    <button
                                                        key={token.id}
                                                        onClick={() => {
                                                            setNewInputTokenId(token.id);
                                                            setNewInputAmount("1.0");
                                                        }}
                                                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                                                        title={token.id}>
                                                        {token.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Current inputs */}
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {Object.entries(preselectedInputs).map(([tokenId, amount]) => (
                                                <div key={tokenId} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-mono truncate">{tokenId}</div>
                                                        <div className="text-gray-600">Amount: {amount}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => removePreselectedInput(tokenId)}
                                                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                        style={{ backgroundColor: "#ef4444", color: "white" }}>
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preselected Outputs */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preselected Outputs</h3>

                                        {/* Add new output */}
                                        <div className="space-y-2 mb-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                                    Token ID (e.g., base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newOutputTokenId}
                                                    onChange={(e) => setNewOutputTokenId(e.target.value)}
                                                    placeholder="base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"
                                                    className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Weight (0.0 - 1.0)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="1"
                                                    value={newOutputWeight}
                                                    onChange={(e) => setNewOutputWeight(e.target.value)}
                                                    placeholder="0.5"
                                                    className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <button
                                                onClick={addPreselectedOutput}
                                                className="w-full px-3 py-2 bg-green-500 text-white text-xs rounded-md hover:bg-green-600 transition-colors"
                                                style={{ backgroundColor: "#10b981", color: "white" }}>
                                                Add Output Token
                                            </button>

                                            {/* Quick examples */}
                                            <div className="text-xs text-gray-600 mb-2">Quick examples:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {exampleTokens.outputs.map((token) => (
                                                    <button
                                                        key={token.id}
                                                        onClick={() => {
                                                            setNewOutputTokenId(token.id);
                                                            setNewOutputWeight("0.5");
                                                        }}
                                                        className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                                                        title={token.id}>
                                                        {token.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Current outputs */}
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {Object.entries(preselectedOutputs).map(([tokenId, weight]) => (
                                                <div key={tokenId} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-mono truncate">{tokenId}</div>
                                                        <div className="text-gray-600">Weight: {weight}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => removePreselectedOutput(tokenId)}
                                                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                        style={{ backgroundColor: "#ef4444", color: "white" }}>
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Widget Display */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Widget Preview</h3>
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            {isWidgetMounted && <HaikuWidget widgetKey="dev-widget-key-12345" config={previewConfig} />}
                                        </div>
                                    </div>

                                    {/* Component Code */}
                                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">Component Code</h3>
                                            <button
                                                onClick={copyConfig}
                                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                                                style={{ backgroundColor: "#3b82f6", color: "white" }}>
                                                Copy
                                            </button>
                                        </div>
                                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">{generateComponentSnippet()}</pre>
                                        <div className="mt-2 text-xs text-gray-600">
                                            💡 Click "Copy" for your ready-to-use Haiku widget React component
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <DevApp />
    </React.StrictMode>
);
