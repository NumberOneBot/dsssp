import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { PointerTracker } from '.'
import { FrequencyResponseGraph } from '../..'

const meta = {
  title: 'Components/PointerTracker',
  component: PointerTracker,
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
    lineWidth: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
    lineColor: { control: { type: 'color' } },
    backgroundColor: { control: { type: 'color' } },
    gainPrecision: { control: { type: 'number' } }
  }
} satisfies Meta<typeof PointerTracker>

export default meta

type Story = StoryObj<typeof meta>

const defaultProps = {
  lineWidth: 0.6,
  lineColor: '#7B899D',
  backgroundColor: '#070C18',
  gainPrecision: 1
}

export const Default: Story = {
  args: {
    ...defaultProps
  }
}
