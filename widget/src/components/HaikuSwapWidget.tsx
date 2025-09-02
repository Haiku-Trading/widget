import React from 'react';
import { HaikuProvider } from '../providers/HaikuProvider';
import { SwapContainer } from './SwapContainer';
import { HaikuConfig } from '../types/config';

export interface HaikuSwapWidgetProps extends HaikuConfig {
  className?: string;
  style?: React.CSSProperties;
}

export function HaikuSwapWidget(props: HaikuSwapWidgetProps) {
  const { className, style, ...config } = props;

  return (
    <HaikuProvider config={config}>
      <div className={className} style={style}>
        <SwapContainer />
      </div>
    </HaikuProvider>
  );
}
