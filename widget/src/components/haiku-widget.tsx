import { WidgetHttpProvider } from "../providers/widget-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { ConfigProvider } from "../providers/config-provider";
import { SwapContainerWithPreselectedTokens } from "./preselected-tokens-handler";
import { WidgetConfig } from "../types/config";

interface HaikuWidgetProps {
  config?: WidgetConfig;
}

export function HaikuWidget({ config }: HaikuWidgetProps) {
  return (
    <ConfigProvider config={config}>
      <ThemeProvider theme={config?.theme}>
        <WidgetHttpProvider>
          <SwapContainerWithPreselectedTokens />
        </WidgetHttpProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}
