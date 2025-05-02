import { createTheme } from '@mantine/core';
import { themeToVars } from '@mantine/vanilla-extract';

export const theme = createTheme( {
    primaryColor: 'primary',
    colors: {
      primary: [
        '#f3e3e7',
        '#e3bdc6',
        '#d296a5',
        '#c16f84',
        '#b14963',
        '#a02242',
        '#841c36',
        '#68162b',
        '#4c101f',
        '#300a14',
      ],
      secondary: [
        '#f7e8e8',
        '#ebc8c7',
        '#dfa7a7',
        '#d38786',
        '#c86666',
        '#bc4645',
        '#9b3a39',
        '#7a2e2d',
        '#592121',
        '#381515',
      ],
      success: [
        '#e8f2ef',
        '#c8dfd9',
        '#a9ccc3',
        '#89b9ac',
        '#69a696',
        '#499380',
        '#3c796a',
        '#2f6053',
        '#23463d',
        '#162c26',
      ],
      warning: [
        '#fcefe2',
        '#f8d9b9',
        '#f5c28f',
        '#f1ac66',
        '#ed953d',
        '#e97f14',
        '#c06911',
        '#97530d',
        '#6f3c0a',
        '#462606',
      ],
      danger: [
        '#fbe6e1',
        '#f6c2b6',
        '#f09f8c',
        '#eb7c62',
        '#e55837',
        '#e0350d',
        '#b92c0b',
        '#922208',
        '#6a1906',
        '#431004',
      ],
      default: [
        '#f1efed',
        '#ddd8d5',
        '#c9c2bc',
        '#b5aba3',
        '#a1958b',
        '#8d7e72',
        '#74685e',
        '#5c524a',
        '#433c36',
        '#2a2622',
      ],
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
    radius: {
      xs: 8,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
    },
    spacing: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    components: {
      Button: {
        defaultProps: {
          radius: 'sm',
        },
      },
    },
  }
);
export const vars = themeToVars(theme);

// mantine.theme.ts
import type { MantineThemeOverride } from '@mantine/core';

