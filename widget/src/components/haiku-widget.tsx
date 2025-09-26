import { WidgetHttpProvider } from "../providers/widget-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { ConfigProvider } from "../providers/config-provider";
import { SwapContainerWithPreselectedTokens } from "./preselected-tokens-handler";
import { WidgetConfig } from "../types/config";
import { React19Wrapper } from "./react-19-wrapper";

interface HaikuWidgetProps {
  config?: WidgetConfig;
}

export function HaikuWidget({ config }: HaikuWidgetProps) {
  return (
    <React19Wrapper>
      <ConfigProvider config={config}>
        <ThemeProvider theme={config?.theme}>
          <WidgetHttpProvider>
            <SwapContainerWithPreselectedTokens />
          </WidgetHttpProvider>
        </ThemeProvider>
      </ConfigProvider>
    </React19Wrapper>
  );
}