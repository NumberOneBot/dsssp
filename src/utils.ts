import { type FilterType } from './types'

export const getMousePosition = (e: MouseEvent) => {
  const CTM = (e.target as SVGGraphicsElement).getScreenCTM()
  if (!CTM) return { x: e.clientX, y: e.clientY }
  return {
    x: (e.clientX - CTM.e) / CTM.a,
    y: (e.clientY - CTM.f) / CTM.d
  }
}

export const getZeroGain = (type: FilterType) =>
  [
    'LOWPASS1',
    'LOWPASS2',
    'HIGHPASS1',
    'HIGHPASS2',
    'BANDPASS',
    'NOTCH'
  ].includes(type)

export const getZeroQ = (type: FilterType) =>
  [
    'LOWSHELF1',
    'LOWSHELF2',
    'HIGHSHELF1',
    'HIGHSHELF2',
    'HIGHPASS1',
    'LOWPASS1',
    'GAIN'
  ].includes(type)

export const getIconStyles = (
  type: FilterType | undefined | null,
  gain: number = 0
) =>
  (String(type).includes('SHELF') && gain > 0) ||
  (type === 'PEAK' && gain < 0) ||
  (type === 'GAIN' && gain < 0)
    ? { transform: 'scale(1, -1)' }
    : {}

export const getIconSymbol = (type: FilterType) => {
  switch (type) {
    case 'PEAK':
      return '&#xE908;'
    case 'HIGHSHELF1':
    case 'HIGHSHELF2':
      return '&#xE903;'
    case 'LOWSHELF1':
    case 'LOWSHELF2':
      return '&#xE905;'
    case 'HIGHPASS1':
    case 'HIGHPASS2':
      return '&#xE906;'
    case 'LOWPASS1':
    case 'LOWPASS2':
      return '&#xE904;'
    case 'BANDPASS':
      return '&#xE900;'
    case 'NOTCH':
      return '&#xE907;'
    case 'GAIN':
      return '&#xE902;'
    case 'BYPASS': // EMPTY / VOID / NULL / UNDEFINED
    default:
      return '&#xE901;'
  }
}
