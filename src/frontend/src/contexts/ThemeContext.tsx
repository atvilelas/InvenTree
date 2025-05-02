import { msg } from '@lingui/core/macro';
import { Trans } from '@lingui/react';
import { MantineProvider, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ContextMenuProvider } from 'mantine-contextmenu';
import { AboutInvenTreeModal } from '../components/modals/AboutInvenTreeModal';
import { LicenseModal } from '../components/modals/LicenseModal';
import { QrModal } from '../components/modals/QrModal';
import { ServerInfoModal } from '../components/modals/ServerInfoModal';
import { useLocalState } from '../states/LocalState';
import { LanguageContext } from './LanguageContext';
import { colorSchema } from './colorSchema';

export function ThemeContext({
  children
}: Readonly<{ children: JSX.Element }>) {
  const [userTheme] = useLocalState((state) => [state.userTheme]);

  // Theme
  const myTheme = createTheme({
    primaryColor: 'primary',
    colors: {
      primary: [
        '#f3e3e7', '#e3bdc6', '#d296a5', '#c16f84', '#b14963',
        '#a02242', '#841c36', '#68162b', '#4c101f', '#300a14'
      ],
      secondary: [
        '#f7e8e8', '#ebc8c7', '#dfa7a7', '#d38786', '#c86666',
        '#bc4645', '#9b3a39', '#7a2e2d', '#592121', '#381515'
      ],
      success: [
        '#e8f2ef', '#c8dfd9', '#a9ccc3', '#89b9ac', '#69a696',
        '#499380', '#3c796a', '#2f6053', '#23463d', '#162c26'
      ],
      warning: [
        '#fcefe2', '#f8d9b9', '#f5c28f', '#f1ac66', '#ed953d',
        '#e97f14', '#c06911', '#97530d', '#6f3c0a', '#462606'
      ],
      danger: [
        '#fbe6e1', '#f6c2b6', '#f09f8c', '#eb7c62', '#e55837',
        '#e0350d', '#b92c0b', '#922208', '#6a1906', '#431004'
      ],
      // Optional: add gray or neutral shades if used in your UI
      gray: [
        '#f1efed', '#ddd8d5', '#c9c2bc', '#b5aba3', '#a1958b',
        '#8d7e72', '#74685e', '#5c524a', '#433c36', '#2a2622'
      ]
    },
    spacing: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.75rem'
    },
    radius: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.25rem'
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    },
    lineHeights: {
      xs: '1rem',
      sm: '1.25rem',
      md: '1.5rem',
      lg: '1.75rem',
      xl: '2rem'
    }
  });

  return (
    <MantineProvider theme={myTheme} colorSchemeManager={colorSchema}>
      <ContextMenuProvider>
        <LanguageContext>
          <ModalsProvider
            labels={{
              confirm: <Trans id={msg`Submit`.id} />,
              cancel: <Trans id={msg`Cancel`.id} />
            }}
            modals={{
              info: ServerInfoModal,
              about: AboutInvenTreeModal,
              license: LicenseModal,
              qr: QrModal
            }}
          >
            <Notifications />
            {children}
          </ModalsProvider>
        </LanguageContext>
      </ContextMenuProvider>
    </MantineProvider>
  );
}
