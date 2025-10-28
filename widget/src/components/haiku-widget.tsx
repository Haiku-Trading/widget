import { WidgetHttpProvider } from "../providers/widget-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { ConfigProvider } from "../providers/config-provider";
import { WidgetKeyProvider } from "../providers/widget-key-provider";
import { SwapContainerWithPreselectedTokens } from "./preselected-tokens-handler";
import { WidgetConfig } from "../types/config";

interface HaikuWidgetProps {
  widgetKey: string; // Required widget key for authentication
  config?: WidgetConfig;
}

export function HaikuWidget({ widgetKey, config }: HaikuWidgetProps) {
  return (
    <WidgetKeyProvider widgetKey={widgetKey}>
      <ConfigProvider config={config}>
        <ThemeProvider theme={config?.theme}>
          <WidgetHttpProvider>
            <SwapContainerWithPreselectedTokens />
          </WidgetHttpProvider>
        </ThemeProvider>
      </ConfigProvider>
    </WidgetKeyProvider>
  );
}