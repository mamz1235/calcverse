
export interface ThemePalette {
  primary: string;
  secondary: string;
  bgMain: string;
  bgCard: string;
  border: string;
  textMain: string;
  textMuted: string;
}

export interface ThemeDef {
  id: string;
  name: string;
  description: string;
  mode: 'light' | 'dark' | 'system'; // 'system' means it supports both, others force a mode
  colors: {
    light: ThemePalette;
    dark: ThemePalette;
  };
  radius: string; // CSS value for border-radius
  fontFamily?: string;
}
