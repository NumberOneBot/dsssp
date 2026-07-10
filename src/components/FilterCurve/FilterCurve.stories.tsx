import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { FilterCurve } from '.'
import { FrequencyResponseGraph, type FilterType } from '../..'

const meta: Meta<typeof FilterCurve> = {
  title: 'Components/FilterCurve',
  component: FilterCurve,
  decorators: [
    (Story) => (
      <FrequencyResponseGraph
        width={800}
        height={400}
      >
        <Story />
      </FrequencyResponseGraph>
    )
  ],
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    filter: { control: { type: 'object' } },
    index: { control: { type: 'number' } },
    active: { control: { type: 'boolean' } },
    color: { control: { type: 'color' } },
    activeColor: { control: { type: 'color' } },
    lineWidth: { control: { type: 'range', min: 0.1, max: 4, step: 0.1 } },
    activeLineWidth: {
      control: { type: 'range', min: 0.1, max: 4, step: 0.1 }
    },
    resolutionFactor: {
      control: { type: 'range', min: 1, max: 50, step: 0.5 }
    },
    animate: { control: { type: 'boolean' } },
    easing: {
      control: { type: 'select' },
      options: ['linear', 'easeIn', 'easeOut', 'easeInOut']
    },
    duration: { control: { type: 'range', min: 0, max: 1000, step: 50 } }
  }
}
export default meta

export type Story = StoryObj<typeof meta>

const defaultProps = {
  filter: { freq: 500, gain: 6, q: 0.7, type: 'PEAK' as FilterType }
}

export const Peak: Story = {
  args: {
    ...defaultProps
  }
}

export const Notch: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 1, type: 'NOTCH' }
  }
}

export const LowShelf1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0, type: 'LOWSHELF1' }
  }
}

export const LowShelf2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0.7, type: 'LOWSHELF2' }
  }
}

export const HighShelf1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0, type: 'HIGHSHELF1' }
  }
}

export const HighShelf2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0.7, type: 'HIGHSHELF2' }
  }
}

export const LowPass1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0, type: 'LOWPASS1' }
  }
}

export const LowPass2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'LOWPASS2' }
  }
}

export const HighPass1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0, type: 'HIGHPASS1' }
  }
}

export const HighPass2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'HIGHPASS2' }
  }
}

export const BandPass: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'BANDPASS' }
  }
}

export const Gain: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0, type: 'GAIN' }
  }
}

export const Bypass: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0.7, type: 'BYPASS' },
    showBypass: true
  }
}

export const CustomColorAndWidth: Story = {
  args: {
    ...defaultProps,
    color: '#FFFF00',
    activeColor: '#00FF00',
    active: false,
    lineWidth: 3,
    activeLineWidth: 5
  }
}
