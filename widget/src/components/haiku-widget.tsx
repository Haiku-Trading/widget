import { WidgetHttpProvider } from "../providers/widget-provider";
import { ThemeProvider } from "../providers/theme-provider";
import { SwapContainer } from "./swap";
import { WidgetTheme } from "../types/theme";

interface HaikuWidgetProps {
  theme?: WidgetTheme;
}

export function HaikuWidget({ theme }: HaikuWidgetProps) {
  return (
    <ThemeProvider theme={theme}>
      <WidgetHttpProvider>
        <SwapContainer />
      </WidgetHttpProvider>
    </ThemeProvider>
  );
}
