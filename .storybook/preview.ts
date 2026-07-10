import type { Preview } from '@storybook/react-vite'
import theme from './theme'

const preview: Preview = {
  parameters: {
    docs: {
      theme
    },
    backgrounds: {
      options: {
        dark: { name: 'dark', value: '#000000' },
        light: { name: 'light', value: '#FFFFFF' }
      }
    },
    toolbar: {
      show: false
    },
    html: {
      prettier: {
        tabWidth: 2,
        useTabs: false,
        htmlWhitespaceSensitivity: 'strict'
      },
      highlighter: {
        showLineNumbers: true, // default: false
        wrapLines: true // default: true
      }
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Getting Started',
          'Demo Project',
          'Foundations',
          ['Audio Filters', 'Themes', 'Colors', 'Icons'],
          'Container',
          'Components',
          [
            'FrequencyResponseCurve',
            'CompositeCurve',
            'FilterCurve',
            'FilterPoint',
            'FilterGradient',
            'FilterIcon',
            'PointerTracker'
          ],
          'Roadmap'
        ]
      }
    }
  },

  initialGlobals: {
    backgrounds: {
      value: 'dark'
    }
  }
}

export default preview
