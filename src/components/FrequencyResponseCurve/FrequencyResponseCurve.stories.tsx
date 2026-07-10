import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { FrequencyResponseCurve } from '.'
import { FrequencyResponseGraph } from '../..'
import magnitudes from './magnitudes.json'

const meta: Meta<typeof FrequencyResponseCurve> = {
  title: 'Components/FrequencyResponseCurve',
  component: FrequencyResponseCurve,
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
    magnitudes: { control: { type: 'object' } },
    dotted: { control: { type: 'boolean' } },
    color: { control: { type: 'color' } },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    lineWidth: { control: { type: 'range', min: 0.1, max: 4, step: 0.1 } },
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

const defaultProps = { magnitudes }

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
    color: '#3399FF'
  }
}
