import type { Meta, StoryObj } from '@storybook/react-vite'
import '@fontsource/iosevka-etoile'

import { FrequencyResponseGraph } from '.'
import { type GraphTheme } from '../..'

const meta = {
  title: 'Container/FrequencyResponseGraph',
  component: FrequencyResponseGraph,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    scale: {
      control: { type: 'object' }
    },
    theme: {
      control: { type: 'object' }
    }
  }
} satisfies Meta<typeof FrequencyResponseGraph>

export default meta

type Story = StoryObj<typeof meta>

const defaultProps = {
  width: 800,
  height: 400
}

export const Default: Story = {
  args: {
    ...defaultProps
  }
}

export const CustomScale: Story = {
  args: {
    ...defaultProps,
    scale: {
      minFreq: 10,
      maxFreq: 20000,
      sampleRate: 48000,
      minGain: -8,
      maxGain: 8,
      dbSteps: 2,
      octaveTicks: 6,
      octaveLabels: [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 40000]
    }
  }
}

export const CustomTheme: Story = {
  args: {
    ...defaultProps,
    theme: {
      background: {
        grid: {
          lineColor: '#2885AE',
          lineWidth: { minor: 0.5, major: 1.5, center: 1.5, border: 0 }
        },
        gradient: {
          start: '#0d1417',
          stop: '#24353e',
          direction: 'HORIZONTAL'
        },
        label: {
          fontSize: 10,
          fontFamily: '"Iosevka Etoile", monospace',
          color: '#7DDEBB'
        }
      }
    } as GraphTheme
  }
}
