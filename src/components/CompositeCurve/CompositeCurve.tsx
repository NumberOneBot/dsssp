import { useMemo, useRef } from 'react'
import {
  calcBiQuadCoefficients,
  calcCompositeMagnitudes,
  calcMagnitudes
} from '../../math'
import { type GraphFilter, type Magnitude } from '../../types'
import { useGraph, FrequencyResponseCurve } from '..'
import type { DefaultCurveProps } from '../types'

const getFilterKey = (filter: GraphFilter) =>
  `${filter.type}_${filter.freq}_${filter.q}_${filter.gain}`

type CompositeCurveProps = DefaultCurveProps & {
  /**
   * Array of filters to combine into a single frequency response curve
   */
  filters: GraphFilter[]
  /**
   * Adjusts the resolution of the curve by reducing the number of points based on the graph's width.
   * Lower values = more points = smoother curve but slower performance.
   * Recommended to increase this value when rendering more than 10 filters.
   * @default 2
   */
  resolutionFactor?: number
}
/**
 * Renders a composite frequency response curve by combining multiple filter responses.
 * Uses magnitude caching to optimize performance when filters change.
 *
 * Supports custom styling through color, opacity and line width props.
 * For better performance with many filters, adjust resolutionFactor.
 */
export const CompositeCurve = ({
  filters,
  resolutionFactor = 2,

  color,
  dotted,
  opacity,
  lineWidth,
  gradientId,

  style,
  easing,
  animate,
  duration, // ms
  className
}: CompositeCurveProps) => {
  const { scale, width } = useGraph()
  const { minFreq, maxFreq, sampleRate } = scale

  // Per-filter magnitude cache persisted across renders: dragging one filter
  // recomputes only that filter's curve, not the whole set. The key combines
  // the filter params with the graph geometry/scale, so a resize or scale
  // change rebuilds the affected entries instead of reusing stale point counts.
  const cache = useRef<Map<string, Magnitude[]>>(new Map()).current

  const compositeMagnitudes = useMemo(() => {
    const steps = width / resolutionFactor
    const geometryKey = `${steps}_${minFreq}_${maxFreq}_${sampleRate}`
    const activeKeys = new Set<string>()

    const magnitudes: Magnitude[][] = []
    filters.forEach((filter) => {
      const key = `${getFilterKey(filter)}@${geometryKey}`
      activeKeys.add(key)

      let entry = cache.get(key)
      if (!entry) {
        const { type, freq, gain, q } = filter
        const vars = calcBiQuadCoefficients(type, freq, gain, q, sampleRate)
        entry = calcMagnitudes(vars, steps, minFreq, maxFreq, sampleRate) || []
        cache.set(key, entry)
      }
      if (entry.length) magnitudes.push(entry)
    })

    // drop entries whose filter or geometry is no longer on screen
    cache.forEach((_, key) => {
      if (!activeKeys.has(key)) cache.delete(key)
    })

    return calcCompositeMagnitudes(magnitudes)
  }, [cache, filters, width, resolutionFactor, minFreq, maxFreq, sampleRate])

  if (!compositeMagnitudes.length) return null

  return (
    <>
      <use href="#centerLine" />
      <FrequencyResponseCurve
        magnitudes={compositeMagnitudes}
        color={color}
        dotted={dotted}
        opacity={opacity}
        lineWidth={lineWidth}
        gradientId={gradientId}
        style={style}
        easing={easing}
        animate={animate}
        duration={duration}
        className={className}
      />
    </>
  )
}
