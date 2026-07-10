import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react-vite'
import '@fontsource/monaspace-krypton'

import { FilterPoint } from '.'
import { FrequencyResponseGraph, type GraphFilter } from '../..'

const meta: Meta<typeof FilterPoint> = {
  title: 'Components/FilterPoint',
  component: FilterPoint,
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
    dragX: { control: { type: 'boolean' } },
    dragY: { control: { type: 'boolean' } },
    active: { control: { type: 'boolean' } },
    radius: { control: { type: 'range', min: 10, max: 40, step: 1 } },
    lineWidth: { control: { type: 'range', min: 0.1, max: 4, step: 0.1 } },
    color: { control: { type: 'color' } },
    activeColor: { control: { type: 'color' } },
    zeroColor: { control: { type: 'color' } },
    dragColor: { control: { type: 'color' } },
    background: { control: { type: 'color' } },
    activeBackground: { control: { type: 'color' } },
    zeroBackground: { control: { type: 'color' } },
    dragBackground: { control: { type: 'color' } },
    backgroundOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 }
    },
    dragBackgroundOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 }
    },
    activeBackgroundOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 }
    },
    showIcon: { control: { type: 'boolean' } },
    label: { control: { type: 'text' } },
    labelFontSize: { control: { type: 'range', min: 10, max: 40, step: 1 } },
    labelFontFamily: { control: { type: 'text' } },
    labelColor: { control: { type: 'color' } },
    onChange: { action: 'onChange' },
    onEnter: { action: 'onEnter' },
    onLeave: { action: 'onLeave' },
    onDrag: { action: 'onDrag' }
  }
}

export default meta

export type Story = StoryObj<typeof meta>

const filter: GraphFilter = { freq: 500, gain: 2, q: 0.7, type: 'PEAK' }

const defaultProps = {
  filter
}

export const Default: Story = {
  args: {
    ...defaultProps
  }
}

export const WithLabel: Story = {
  args: {
    ...defaultProps,
    label: 'A',
    labelColor: '#FFFFFF',
    labelFontSize: 24,
    labelFontFamily: "'Monaspace Krypton', monospace"
  }
}

export const WithIcon: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 2, q: 0.7, type: 'PEAK' },
    showIcon: true,
    labelColor: 'inherit'
  }
}

export const ZeroGain: Story = {
  args: {
    ...defaultProps,
    filter: { freq: 500, gain: 0, q: 0.7, type: 'PEAK' }
  }
}

export const CustomColorsAndOpacity: Story = {
  args: {
    ...defaultProps,
    color: '#FFFF00',
    background: '#FFFF00',
    backgroundOpacity: 0.5,
    activeColor: '#00FF00',
    activeBackground: '#00FF00',
    activeBackgroundOpacity: 0.7,
    dragColor: '#FF0000',
    dragBackground: '#FF0000',
    dragBackgroundOpacity: 0.3,
    zeroColor: '#660099',
    zeroBackground: '#660099'
  }
}
