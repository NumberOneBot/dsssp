/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import {
  type BiQuadCoefficients,
  type FilterType,
  type GraphFilter,
  type GraphPoint,
  type GraphScale,
  type LogScaleFunction,
  type Magnitude
} from './types'

export const fastFloor = (x: number) => x >> 0
export const fastRound = (x: number) => (x + (x > 0 ? 0.5 : -0.5)) >> 0
export const stripTail = (x: number) => fastRound(x * 100) / 100

export const getLogScaleFn = (
  minFreq: number,
  maxFreq: number,
  width: number
): LogScaleFunction => {
  const logMinFreq = Math.log10(minFreq)
  const logMaxFreq = Math.log10(maxFreq)
  const logRange = logMaxFreq - logMinFreq

  const x = (freq: number) => {
    const logFreq = Math.log10(freq)
    const x = ((logFreq - logMinFreq) / logRange) * width
    return x
  }

  const ticks = (number: number) => {
    const ticks = []
    const decades = fastFloor(logMaxFreq - logMinFreq)

    for (let i = 0; i <= decades; i++) {
      const decadeStart = 10 ** (fastFloor(Math.log10(minFreq)) + i)
      if (decadeStart >= minFreq) ticks.push(decadeStart)
      for (let j = 2; j <= number - 1; j++) {
        const tick = fastFloor(decadeStart * j)

        if (tick <= maxFreq) {
          ticks.push(tick)
        }
      }
    }
    return ticks
  }

  return { x, ticks }
}

export function calcBiQuadCoefficients(
  type: FilterType,
  frequency: number,
  peakGain: number,
  Q: number = 0.707,
  sampleRate: number = 44100
): BiQuadCoefficients {
  let A0 = 0
  let A1 = 0
  let A2 = 0
  let B1 = 0
  let B2 = 0
  let norm

  // Clamping input values to valid ranges
  sampleRate = Math.max(1, sampleRate) // Minimum sample rate of 1 Hz
  frequency = Math.max(0, Math.min(frequency, sampleRate / 2)) // Nyquist limit
  Q = Math.max(0.0001, Q) // Avoid division by zero
  peakGain = Math.max(-120, Math.min(peakGain, 120)) // Limit gain range

  const V = 10 ** (Math.abs(peakGain) / 20)
  const K = Math.tan((Math.PI * frequency) / sampleRate)

  switch (type) {
    case 'NOTCH':
      norm = 1 / (1 + K / Q + K * K)
      A0 = (1 + K * K) * norm
      A1 = 2 * (K * K - 1) * norm
      A2 = A0
      B1 = A1
      B2 = (1 - K / Q + K * K) * norm
      break

    case 'PEAK':
      if (peakGain >= 0) {
        norm = 1 / (1 + (1 / Q) * K + K * K)
        A0 = (1 + (V / Q) * K + K * K) * norm
        A1 = 2 * (K * K - 1) * norm
        A2 = (1 - (V / Q) * K + K * K) * norm
        B1 = A1
        B2 = (1 - (1 / Q) * K + K * K) * norm
      } else {
        norm = 1 / (1 + (V / Q) * K + K * K)
        A0 = (1 + (1 / Q) * K + K * K) * norm
        A1 = 2 * (K * K - 1) * norm
        A2 = (1 - (1 / Q) * K + K * K) * norm
        B1 = A1
        B2 = (1 - (V / Q) * K + K * K) * norm
      }
      break

    case 'LOWSHELF1':
      if (peakGain >= 0) {
        norm = 1 / (K + 1)
        A0 = (K * V + 1) * norm
        A1 = (K * V - 1) * norm
        A2 = 0
        B1 = (K - 1) * norm
        B2 = 0
      } else {
        norm = 1 / (K * V + 1)
        A0 = (K + 1) * norm
        A1 = (K - 1) * norm
        A2 = 0
        B1 = (K * V - 1) * norm
        B2 = 0
      }
      break
    case 'LOWSHELF2':
      if (peakGain >= 0) {
        norm = 1 / (1 + Math.SQRT2 * K + K * K)
        A0 = (1 + Math.sqrt(2 * V) * K + V * K * K) * norm
        A1 = 2 * (V * K * K - 1) * norm
        A2 = (1 - Math.sqrt(2 * V) * K + V * K * K) * norm
        B1 = 2 * (K * K - 1) * norm
        B2 = (1 - Math.SQRT2 * K + K * K) * norm
      } else {
        norm = 1 / (1 + Math.sqrt(2 * V) * K + V * K * K)
        A0 = (1 + Math.SQRT2 * K + K * K) * norm
        A1 = 2 * (K * K - 1) * norm
        A2 = (1 - Math.SQRT2 * K + K * K) * norm
        B1 = 2 * (V * K * K - 1) * norm
        B2 = (1 - Math.sqrt(2 * V) * K + V * K * K) * norm
      }
      break

    case 'HIGHSHELF1':
      if (peakGain >= 0) {
        norm = 1 / (K + 1)
        A0 = (K + V) * norm
        A1 = (K - V) * norm
        A2 = 0
        B1 = (K - 1) * norm
        B2 = 0
      } else {
        norm = 1 / (K + V)
        A0 = (K + 1) * norm
        A1 = (K - 1) * norm
        A2 = 0
        B1 = (K - V) * norm
        B2 = 0
      }
      break
    case 'HIGHSHELF2':
      if (peakGain >= 0) {
        norm = 1 / (1 + Math.SQRT2 * K + K * K)
        A0 = (V + Math.sqrt(2 * V) * K + K * K) * norm
        A1 = 2 * (K * K - V) * norm
        A2 = (V - Math.sqrt(2 * V) * K + K * K) * norm
        B1 = 2 * (K * K - 1) * norm
        B2 = (1 - Math.SQRT2 * K + K * K) * norm
      } else {
        norm = 1 / (V + Math.sqrt(2 * V) * K + K * K)
        A0 = (1 + Math.SQRT2 * K + K * K) * norm
        A1 = 2 * (K * K - 1) * norm
        A2 = (1 - Math.SQRT2 * K + K * K) * norm
        B1 = 2 * (K * K - V) * norm
        B2 = (V - Math.sqrt(2 * V) * K + K * K) * norm
      }
      break

    case 'LOWPASS1':
      norm = 1 / (1 / K + 1)
      A0 = A1 = norm
      B1 = (1 - 1 / K) * norm
      A2 = B2 = 0
      break

    case 'LOWPASS2':
      norm = 1 / (1 + K / Q + K * K)
      A0 = K * K * norm
      A1 = 2 * A0
      A2 = A0
      B1 = 2 * (K * K - 1) * norm
      B2 = (1 - K / Q + K * K) * norm
      break

    case 'HIGHPASS1':
      norm = 1 / (K + 1)
      A0 = norm
      A1 = -norm
      B1 = (K - 1) * norm
      A2 = B2 = 0
      break

    case 'HIGHPASS2':
      norm = 1 / (1 + K / Q + K * K)
      A0 = 1 * norm
      A1 = -2 * A0
      A2 = A0
      B1 = 2 * (K * K - 1) * norm
      B2 = (1 - K / Q + K * K) * norm
      break

    case 'BANDPASS':
      norm = 1 / (1 + K / Q + K * K)
      A0 = (K / Q) * norm
      A1 = 0
      A2 = -A0
      B1 = 2 * (K * K - 1) * norm
      B2 = (1 - K / Q + K * K) * norm
      break

    case 'GAIN':
      // Apply gain without filtering
      const gain = 10 ** (peakGain / 20)
      A0 = gain
      A1 = 0
      A2 = 0
      B1 = 0
      B2 = 0
      break
    case 'BYPASS':
      A0 = 1
      A1 = 0
      A2 = 0
      B1 = 0
      B2 = 0
      break
    // case 'ONEPOLE_LP':
    //   B1 = Math.exp(-2.0 * Math.PI * (frequency / sampleRate))
    //   A0 = 1.0 - B1
    //   B1 = -B1
    //   A1 = A2 = B2 = 0
    //   break

    // case 'ONEPOLE_HP':
    //   B1 = -Math.exp(-2.0 * Math.PI * (0.5 - frequency / sampleRate))
    //   A0 = 1.0 + B1
    //   B1 = -B1
    //   A1 = A2 = B2 = 0
    //   break
    default:
      throw new Error(`calcBiQuadCoefficients: unknown filter type "${type}"`)
  }
  return { A0, A1, A2, B1, B2 }
}

export function calcMagnitudeForFrequency(
  vars: BiQuadCoefficients,
  frequency: number,
  sampleRate: number = 44100
) {
  const { A0, A1, A2, B1, B2 } = vars
  const phi = Math.sin((2 * Math.PI * frequency) / sampleRate / 2) ** 2
  let y =
    Math.log(
      (A0 + A1 + A2) ** 2 -
        4 * (A0 * A1 + 4 * A0 * A2 + A1 * A2) * phi +
        16 * A0 * A2 * phi * phi
    ) -
    Math.log(
      (1 + B1 + B2) ** 2 -
        4 * (1 * B1 + 4 * 1 * B2 + B1 * B2) * phi +
        16 * 1 * B2 * phi * phi
    )
  y = (y * 10) / Math.LN10
  if (y === Number.NEGATIVE_INFINITY || isNaN(y)) y = -200 // dB
  return y
}

export function calcAmplitudeForFrequency(gain: number) {
  const amplitude = 10 ** (gain / 20)
  return amplitude
}

export function calcStandardDeviation(values: number[]) {
  const mean = values.reduce((acc, val: number) => acc + val, 0) / values.length
  const squaredDiffs = values.map((val) => (val - mean) ** 2)
  const variance =
    squaredDiffs.reduce((acc, val: number) => acc + val, 0) / values.length
  const standardDeviation = Math.sqrt(variance)
  return standardDeviation
}

export const calcFrequency = (
  index: number,
  length: number,
  minFreq: number,
  maxFreq: number
) => {
  // logarithmic scale
  return (
    10 **
    (((Math.log10(maxFreq) - Math.log10(minFreq)) * index) / (length - 1) +
      Math.log10(minFreq))
  )
}

export function calcMagnitudes(
  vars: BiQuadCoefficients,
  steps: number,
  minFreq: number,
  maxFreq: number,
  sampleRate: number = 44100
): Magnitude[] {
  const magPlot = []

  for (let index = 0; index < steps; index++) {
    const frequency = calcFrequency(index, steps, minFreq, maxFreq)
    const magnitude = calcMagnitudeForFrequency(vars, frequency, sampleRate)
    // var amplitude = calcAmplitudeForFrequency(magnitude);
    // var deviation = Math.abs(magnitude) + Math.abs(amplitude - 1);
    magPlot.push({ frequency, magnitude /*, amplitude, deviation */ })
  }
  return magPlot
}

export const reducePoints = (points: GraphPoint[]) => {
  const uniquePoints = points.slice(0, -1).reduce((acc, point, idx: number) => {
    if (fastRound(point.y * 4) !== fastRound((points[idx - 1]?.y || 0) * 4)) {
      acc.push(point)
    }
    return acc
  }, [] as GraphPoint[])
  return [...uniquePoints, points.slice(-1)[0]]
}

export const getCenterLine = (
  minGain: number,
  maxGain: number,
  height: number
) => {
  const dbRange = maxGain - minGain
  return (maxGain / dbRange) * height
}

export const scaleMagnitude = (
  magnitude: number,
  minGain: number,
  maxGain: number,
  height: number
) => {
  const dbScale = height / (maxGain - minGain)
  const dbCenterLine = getCenterLine(minGain, maxGain, height)

  return dbCenterLine - magnitude * dbScale
}

export const calcMagnitude = (
  y: number,
  minGain: number,
  maxGain: number,
  height: number
) => {
  const dbScale = height / (maxGain - minGain)
  const dbCenterLine = getCenterLine(minGain, maxGain, height)

  return (dbCenterLine - y) / dbScale
}

export const scaleMagnitudes = (
  magnitudes: Magnitude[],
  scale: GraphScale,
  width: number,
  height: number
) => {
  const { minGain, maxGain } = scale
  const length = magnitudes.length - 1 // may be needed here

  return magnitudes.map((mag, i) => {
    return {
      x: fastRound((width / length) * i),
      y: stripTail(scaleMagnitude(mag.magnitude, minGain, maxGain, height))
    } as GraphPoint
  })
}

export const plotCurve = (
  points: GraphPoint[],
  scale: GraphScale,
  width: number,
  height: number
) => {
  const { minGain, maxGain } = scale
  const centerY = getCenterLine(minGain, maxGain, height)
  let path = `M -200 ${centerY}`
  points.map((point) => {
    path += ` L ${point.x} ${point.y > height + 2 ? height + 2 : point.y}`
  })
  path += ` L ${width + 200} ${centerY}`
  return path
}

export const calcFilterCoefficients = (
  filter: GraphFilter,
  sampleRate: number = 44100
) => {
  const { type, freq, gain, q } = filter
  return calcBiQuadCoefficients(type, freq, gain, q, sampleRate)
}

export const calcFilterMagnitudes = (
  vars: BiQuadCoefficients,
  scale: GraphScale,
  width: number,
  precisionDivider = 2
) => {
  const { minFreq, maxFreq, sampleRate } = scale
  const steps = width / precisionDivider
  const magnitudes = calcMagnitudes(vars, steps, minFreq, maxFreq, sampleRate)
  return magnitudes
}

export const calcCompositeMagnitudes = (magnitudes: Magnitude[][]) => {
  const compositeMags: Magnitude[] = []
  // Magnitudes array is empty or undefined
  if (!magnitudes?.length) return []
  // First sub-array of magnitudes is empty or undefined
  if (!magnitudes?.[0]?.length) return []

  for (let i = 0; i < magnitudes[0].length; i++) {
    const totalGain = magnitudes.reduce((sum, arr) => {
      const { magnitude } = arr[i] || {}
      if (magnitude === undefined) return sum
      // composite response = sum of the individual filter gains, in dB
      return sum + magnitude
    }, 0)

    const { frequency } = magnitudes[0][i] || {}
    if (frequency === undefined) continue

    compositeMags.push({
      frequency,
      magnitude: totalGain
    })
  }

  return compositeMags
}

export const limitRange = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
