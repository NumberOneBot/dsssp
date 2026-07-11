import { useEffect, useMemo, useState, useCallback } from 'react'
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

  const [magnitudesCache, setMagnitudesCache] = useState<
    Record<string, Magnitude[]>
  >({})

  const memoizedGetFilterKey = useCallback((filter: GraphFilter) => {
    return getFilterKey(filter)
  }, [])

  const activeKeys = useMemo(() => {
    return new Set<string>(filters.map((f) => memoizedGetFilterKey(f)))
  }, [filters, memoizedGetFilterKey])

  const updateCache = useCallback(() => {
    const newCache: Record<string, Magnitude[]> = { ...magnitudesCache }

    Object.keys(newCache).forEach((cachedKey) => {
      if (!activeKeys.has(cachedKey)) {
        delete newCache[cachedKey]
      }
    })

    filters.forEach((filter) => {
      const key = memoizedGetFilterKey(filter)
      if (!newCache[key]) {
        const { type, freq, gain, q } = filter
        const steps = width / resolutionFactor
        const vars = calcBiQuadCoefficients(type, freq, gain, q, sampleRate)
        newCache[key] =
          calcMagnitudes(vars, steps, minFreq, maxFreq, sampleRate) || []
      }
    })

    setMagnitudesCache(newCache)
  }, [filters])

  useEffect(() => {
    updateCache()
  }, [updateCache])

  const compositeMagnitudes = useMemo(() => {
    const allMags = Object.values(magnitudesCache).filter((m) => m.length)
    return calcCompositeMagnitudes(allMags)
  }, [magnitudesCache])

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
