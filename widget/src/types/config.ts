export interface HaikuConfig {
  apiKey: string;
  baseUrl?: string;
  theme?: 'light' | 'dark' | 'auto';
  defaultChainId?: number;
  supportedChains?: number[];
  customStyles?: {
    primaryColor?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
}

export interface WidgetConfig {
  config: HaikuConfig;
}
