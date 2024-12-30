import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react'
import '@fontsource/monaspace-krypton'

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
    }
  }
}
export default meta

type Story = StoryObj<typeof meta>

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
    filter: { freq: 500, gain: 0, q: 1, type: 'NOTCH' },
    showPin: false
  }
}

export const LowShelf1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0, type: 'LOWSHELF1' },
    showPin: false
  }
}

export const LowShelf2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0.7, type: 'LOWSHELF2' },
    showPin: false
  }
}

export const HighShelf1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0, type: 'HIGHSHELF1' },
    showPin: false
  }
}

export const HighShelf2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0.7, type: 'HIGHSHELF2' },
    showPin: false
  }
}

export const LowPass1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0, type: 'LOWPASS1' },
    showPin: false
  }
}

export const LowPass2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'LOWPASS2' },
    showPin: false
  }
}

export const HighPass1: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0, type: 'HIGHPASS1' },
    showPin: false
  }
}

export const HighPass2: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'HIGHPASS2' },
    showPin: false
  }
}

export const BandPass: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'BANDPASS' },
    showPin: false
  }
}

export const Gain: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 8, q: 0, type: 'GAIN' },
    showPin: false
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
