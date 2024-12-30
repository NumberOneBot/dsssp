import { type CSSProperties } from 'react'

import { calcCurve } from '../../math'
import { type GraphFilter } from '../../types'
import {
  type FrequencyResponseCurveProps,
  FrequencyResponseCurve,
  useGraph
} from '../..'
import { FilterPin } from '.'

export type FilterCurveProps = Omit<
  FrequencyResponseCurveProps,
  'magnitudes' | 'dotted'
> & {
  /**
   * Filter to render
   */
  filter: GraphFilter
  /**
   * Index of the color in the theme colors array to use if no `color` prop is provided
   */
  index?: number
  /**
   * Show vertical pin to connect the curve to the FilterPoint
   */
  showPin?: boolean
  /**
   * Active state (trigger it manually to highlight the curve along with hovered FilterPoint)
   */
  active?: boolean

  /**
   * Curve color
   * @default theme.colors[index].curve || theme.filters.defaultColor || '#00FF00'
   */
  color?: string
  /**
   * Active curve color
   * @default theme.colors[index].active || color || theme.filters.defaultColor || '#00FF00'
   */
  activeColor?: string
  /**
   * Curve opacity
   * @default theme.curve.opacity.normal || 0.5
   */
  opacity?: CSSProperties['opacity']
  /**
   * Active curve opacity
   * @default theme.curve.opacity.active || 0.7
   */
  activeOpacity?: CSSProperties['opacity']
  /**
   * Curve line width
   * @default theme.curve.width.normal || 1.5
   */
  lineWidth?: number
  /**
   * Active curve line width
   * @default theme.curve.width.active || 1.5
   */
  activeLineWidth?: number
}

/**
 * This component renders the frequency response curve of a given filter on the graph.
 * It displays the filter's shape and can optionally show a vertical pin to connect it with specific types of `FilterPoint`'s, such as `NOTCH`, `LOWPASS`, `HIGHPASS`.
 *
 * Uses `defaultColor` from the theme as a fallback when filter colors are not specified.
 */
export const FilterCurve = ({
  filter,
  color,
  index = 0,
  lineWidth,
  opacity,

  gradientId,
  showPin = true,
  active = false,

  activeColor,
  activeLineWidth,
  activeOpacity
}: FilterCurveProps) => {
  const {
    scale,
    width,
    theme: {
      filters: { curve, defaultColor, colors }
    }
  } = useGraph()

  const { vars, magnitudes } = calcCurve(filter, scale, width, 1) || {}
  if (!vars || !magnitudes?.length) return null

  const normalColor = color || colors[index]?.curve || defaultColor
  const curveColor = active
    ? activeColor || colors[index]?.active || normalColor
    : normalColor

  const curveOpacity = active
    ? activeOpacity || curve.opacity.active
    : opacity || curve.opacity.normal

  const curveWidth = active
    ? activeLineWidth || curve.width.active
    : lineWidth || curve.width.normal

  return (
    <>
      {showPin && (
        <FilterPin
          vars={vars}
          filter={filter}
          color={curveColor}
          opacity={curveOpacity}
          width={curveWidth}
        />
      )}
      <FrequencyResponseCurve
        magnitudes={magnitudes}
        color={curveColor}
        opacity={curveOpacity}
        lineWidth={curveWidth}
        gradientId={gradientId}
      />
    </>
  )
}
