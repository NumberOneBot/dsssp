import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { type DefaultCurveProps, easingSplines } from '../types'
import { plotCurve, scaleMagnitudes } from '../../math'
import { type Magnitude } from '../../types'
import { useGraph } from '../..'

export type FrequencyResponseCurveProps = DefaultCurveProps & {
  /**
   * Array of magnitude values defining the curve shape
   */
  magnitudes: Magnitude[]
}

/**
 * Renders a frequency response curve from an array of magnitude values.
 * This is the basic curve component used internally by `CompositeCurve` and `FilterCurve`.
 * Can also be used directly to render custom frequency response curves.
 *
 * Uses `theme.curve` values as defaults for styling, when color/opacity/width are not specified.
 * Supports optional gradient fills and dotted line styles.
 */

export const FrequencyResponseCurve = ({
  magnitudes,
  dotted = false,
  color,
  opacity,
  lineWidth,
  gradientId,
  className,
  style,
  animate = false,
  easing = 'easeInOut',
  duration = 300 // ms
}: FrequencyResponseCurveProps) => {
  const {
    scale,
    width,
    height,
    theme: { curve }
  } = useGraph()

  const curveColor = color || curve.color
  const curveWidth = lineWidth || curve.width
  const curveOpacity = opacity || curve.opacity

  const { currentPath, initialPath } = useMemo(() => {
    const points = scaleMagnitudes(magnitudes, scale, width, height)
    const flatPoints = points.map((p) => ({ x: p.x, y: height / 2 }))

    const currentPath = plotCurve(points, scale, width, height)
    const initialPath = plotCurve(flatPoints, scale, width, height)

    return { currentPath, initialPath }
  }, [magnitudes, scale, width, height])

  const animateRef = useRef<SVGAnimateElement>(null)
  const [fromPath, setFromPath] = useState(initialPath)
  const [toPath, setToPath] = useState(initialPath)

  useLayoutEffect(() => {
    if (animate) {
      setFromPath(toPath)
      animateRef.current?.beginElement()
      // Delay updating the previous path by one frame to avoid flickering in Safari
      // This ensures that the animation starts from the current state and smoothly transitions to the new state
      requestAnimationFrame(() => {
        setToPath(currentPath)
      })
    }
  }, [currentPath, animate])

  return (
    <path
      aria-hidden="true"
      d={animate ? fromPath : currentPath}
      stroke={curveColor}
      strokeWidth={curveWidth}
      strokeOpacity={curveOpacity}
      strokeLinecap="round"
      {...(dotted ? { strokeDasharray: '1,3' } : {})}
      fill={gradientId ? `url(#${gradientId})` : 'none'}
      className={className}
      style={style}
    >
      {animate && (
        <animate
          ref={animateRef}
          from={fromPath}
          to={toPath}
          fill="freeze"
          repeatCount="1"
          attributeName="d"
          dur={`${duration}ms`}
          calcMode="spline"
          keyTimes="0;1"
          keySplines={easingSplines[easing]}
          additive="replace"
          accumulate="none"
        />
      )}
    </path>
  )
}
