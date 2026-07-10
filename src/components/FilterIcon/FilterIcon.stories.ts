import type { Meta, StoryObj } from '@storybook/react-vite'

import { FilterIcon } from '.'
import { filterTypes } from '../..'

const meta: Meta<typeof FilterIcon> = {
  title: 'Components/FilterIcon',
  component: FilterIcon,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: { type: 'color' }
    },

    gain: {
      control: { type: 'select' },
      options: [1, -1]
    },
    type: {
      control: { type: 'select' },
      options: Object.keys(filterTypes)
    },
    size: {
      control: { type: 'range', min: 10, max: 100, step: 1 }
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

const defaultProps = {
  // color: '#FFFFFF',
  // size: 24
}

export const Peak: Story = {
  args: {
    ...defaultProps,
    type: 'PEAK'
  },
  parameters: {
    docs: {
      source: {
        state: 'open'
      }
    }
  }
}

export const Notch: Story = {
  args: {
    ...defaultProps,
    type: 'NOTCH'
  }
}

export const LowPass: Story = {
  args: {
    ...defaultProps,
    type: 'LOWPASS1'
  }
}

export const HighPass: Story = {
  args: {
    ...defaultProps,
    type: 'HIGHPASS1'
  }
}

export const LowShelf: Story = {
  args: {
    ...defaultProps,
    type: 'LOWSHELF1'
  }
}

export const HighShelf: Story = {
  args: {
    ...defaultProps,
    type: 'HIGHSHELF1'
  }
}

export const BandPass: Story = {
  args: {
    ...defaultProps,
    type: 'BANDPASS'
  }
}

export const Bypass: Story = {
  args: {
    ...defaultProps,
    type: 'BYPASS'
  }
}

export const Gain: Story = {
  args: {
    ...defaultProps,
    type: 'GAIN'
  }
}

export const WithFilterObject: Story = {
  args: {
    ...defaultProps,
    filter: { type: 'PEAK', freq: 1000, gain: -4, q: 1 }
  }
}
