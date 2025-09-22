import { WidgetHttpProvider } from "../providers/widget-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { ConfigProvider } from "../providers/config-provider";
import { SwapContainer } from "./swap";
import { WidgetConfig } from "../types/config";

interface HaikuWidgetProps {
  config?: WidgetConfig;
}

export function HaikuWidget({ config }: HaikuWidgetProps) {
  return (
    <ConfigProvider config={config}>
      <ThemeProvider theme={config?.theme}>
        <WidgetHttpProvider>
          <SwapContainer />
        </WidgetHttpProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
}
