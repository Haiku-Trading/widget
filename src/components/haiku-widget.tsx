import { ConfigProvider } from "../providers/config-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { WidgetKeyProvider } from "../providers/widget-key-provider";
import { WidgetHttpProvider } from "../providers/widget-provider";
import { WidgetConfig } from "../types/config";
import { SwapContainerWithPreselectedTokens } from "./preselected-tokens-handler";

interface HaikuWidgetProps {
    widgetKey: string;
    config?: Partial<WidgetConfig>;
}

export const DEFAULT_CONFIG: WidgetConfig = {
    theme: {
        mode: "dark",
        light: {
            primaryColor: "#3B82F6",
            backgroundColor: "#FFFFFF",
            button: "#f5f5f5",
            borderColor: "#e2e8f0",
            mutedBackground: "#f5f5f5",
            primaryText: "#020817",
            secondaryText: "#666666",
            swapButton: "#f8fafc",
            iconsHeader: "#64748b",
            swapIcon: "#020817",
        },
        dark: {
            primaryColor: "#60A5FA",
            backgroundColor: "#0F172A",
            button: "#f5f5f5",
            borderColor: "#1d283a",
            mutedBackground: "#1e293b",
            primaryText: "#f8fafc",
            secondaryText: "#b2bdcc",
            swapButton: "#f8fafc",
            iconsHeader: "#94a3b8",
            swapIcon: "#020817",
        },
    },
    multiInput: true,
    multiOutput: true,
    lockedInputs: false,
    lockedOutputs: false,
};

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
    const result = { ...target };

    for (const key in source) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (sourceValue === undefined) {
            continue;
        }

        if (
            sourceValue &&
            typeof sourceValue === "object" &&
            !Array.isArray(sourceValue) &&
            targetValue &&
            typeof targetValue === "object" &&
            !Array.isArray(targetValue)
        ) {
            result[key] = deepMerge(targetValue, sourceValue);
        } else {
            result[key] = sourceValue as any;
        }
    }

    return result;
}

export function HaikuWidget({ widgetKey, config }: HaikuWidgetProps) {
    const mergedConfig = config ? deepMerge(DEFAULT_CONFIG, config) : DEFAULT_CONFIG;

    return (
        <WidgetKeyProvider widgetKey={widgetKey}>
            <ConfigProvider config={mergedConfig}>
                <ThemeProvider theme={mergedConfig.theme}>
                    <WidgetHttpProvider>
                        <SwapContainerWithPreselectedTokens />
                    </WidgetHttpProvider>
                </ThemeProvider>
            </ConfigProvider>
        </WidgetKeyProvider>
    );
}
