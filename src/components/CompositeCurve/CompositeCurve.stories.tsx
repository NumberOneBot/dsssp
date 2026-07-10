import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { CompositeCurve } from '.'
import { FrequencyResponseGraph, type GraphFilter } from '../..'

const meta: Meta<typeof CompositeCurve> = {
  title: 'Components/CompositeCurve',
  component: CompositeCurve,
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
    filters: { control: { type: 'object' } },
    dotted: { control: { type: 'boolean' } },
    color: { control: { type: 'color' } },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    lineWidth: { control: { type: 'range', min: 0.1, max: 4, step: 0.1 } },
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

type Story = StoryObj<typeof meta>

const filters: GraphFilter[] = [
  { freq: 400, gain: 6, q: 1, type: 'PEAK' },
  { freq: 600, gain: -8, q: 3, type: 'PEAK' },
  { freq: 1200, gain: 2, q: 0.7, type: 'HIGHSHELF2' }
]

const defaultProps = { filters }

export const Default: Story = {
  args: {
    ...defaultProps
  }
}

export const CustomStyleAndColor: Story = {
  args: {
    ...defaultProps,
    dotted: true,
    opacity: 0.5,
    lineWidth: 1,
    color: '#FF9933'
  }
}

export const SimplifiedResolution: Story = {
  args: {
    ...defaultProps,
    resolutionFactor: 20
  }
}
