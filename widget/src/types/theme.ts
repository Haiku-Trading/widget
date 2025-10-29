export interface ColorPalette {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    successColor?: string;
    warningColor?: string;
    errorColor?: string;
    backgroundColor?: string;
    button?: string;
    paper?: string;
    borderColor?: string;
    mutedBackground?: string;
    primaryText?: string;
    secondaryText?: string;
    swapButton?: string;
    iconsHeader?: string;
    swapIcon?: string;
}

export interface WidgetTheme {
    mode?: "light" | "dark" | "auto";
    light?: ColorPalette;
    dark?: ColorPalette;
}

export interface ThemeProviderProps {
    theme?: WidgetTheme;
    children: React.ReactNode;
}
