import React from 'react'
import { type Meta, type StoryObj } from '@storybook/react-vite'

import { FilterGradient } from '.'
import { FilterCurve, FrequencyResponseGraph, type GraphFilter } from '../..'

const meta: Meta<typeof FilterGradient> = {
  title: 'Components/FilterGradient',
  component: FilterGradient,
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
    id: { control: { type: 'text' } },
    filter: { control: { type: 'object' } },
    index: { control: { type: 'number' } },
    color: { control: { type: 'color' } }
  }
}
export default meta
type Story = StoryObj<typeof meta>

const filter1: GraphFilter = { freq: 500, gain: 6, q: 0.7, type: 'PEAK' }
const filter2: GraphFilter = { freq: 500, gain: 0, q: 1, type: 'NOTCH' }
const filter3: GraphFilter = { freq: 500, gain: 0, q: 1, type: 'HIGHPASS1' }
const filter4: GraphFilter = { freq: 500, gain: 8, q: 0, type: 'LOWSHELF1' }
const gradientId = 'gradient1'

const defaultProps = {
  filter: filter1,
  id: gradientId
}

export const Peak: Story = {
  args: {
    ...defaultProps
  },
  decorators: [
    (Story) => (
      <>
        <FilterCurve
          filter={filter1}
          gradientId="gradient1"
        />
        <Story />
      </>
    )
  ]
}

export const Notch: Story = {
  args: {
    ...defaultProps,
    filter: filter2,
    id: 'gradient2'
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <FilterCurve
          filter={filter2}
          gradientId="gradient2"
        />
      </>
    )
  ]
}

export const HighPass: Story = {
  args: {
    ...defaultProps,
    filter: filter3,
    id: 'gradient3'
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <FilterCurve
          filter={filter3}
          gradientId="gradient3"
        />
      </>
    )
  ]
}

export const LowShelf: Story = {
  args: {
    ...defaultProps,
    filter: filter4,
    id: 'gradient4'
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <FilterCurve
          filter={filter4}
          gradientId="gradient4"
        />
      </>
    )
  ]
}

export const CustomColorAndOpacity: Story = {
  args: {
    ...defaultProps,
    color: '#FFFF00',
    opacity: 0.3,
    id: 'gradient5'
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <FilterCurve
          filter={filter1}
          color="#FFFF00"
          gradientId="gradient5"
        />
      </>
    )
  ]
}

export const FillBackground: Story = {
  args: {
    ...defaultProps,
    color: '#00FFFF',
    opacity: 0.2,
    id: 'gradient6',
    fill: true
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <FilterCurve
          filter={filter1}
          color="#00FFFF"
          gradientId="gradient6"
        />
      </>
    )
  ]
}
