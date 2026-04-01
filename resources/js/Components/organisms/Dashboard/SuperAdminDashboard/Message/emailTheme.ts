// resources/js/theme/emailTheme.ts
import { MantineThemeOverride } from '@mantine/core';

const emailTheme: MantineThemeOverride = {
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 'md',
  primaryColor: 'blue',

  colors: {
    blue: [
      '#e3f2fd',
      '#bbdefb',
      '#90caf9',
      '#64b5f6',
      '#42a5f5',
      '#2196f3',
      '#1e88e5',
      '#1976d2',
      '#1565c0',
      '#0d47a1',
    ],
  },

  components: {
    Card: {
      styles: {
        root: {
          border: '1px solid #eaeaea',
        },
      },
    },
    Modal: {
      defaultProps: {
        overlayBlur: 3,
        transitionProps: { transition: 'slide-up', duration: 250 },
      },
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: '#f9f9f9',
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
};

export default emailTheme;
