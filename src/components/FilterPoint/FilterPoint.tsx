/* eslint-disable no-param-reassign */
import { useMemo, useRef, useState, type CSSProperties } from 'react'

import {
  calcFrequency,
  calcMagnitude,
  getCenterLine,
  limitRange,
  scaleMagnitude,
  stripTail
} from '../../math'
import { type GraphFilter } from '../../types'
import {
  getIconStyles,
  getIconSymbol,
  getPointerPosition,
  getZeroGain
} from '../../utils'
import { useGraph } from '../..'

import '../../icons/font.css'

// gains within ±this (dB) snap to exactly 0
const gainSnapDb = 0.05

export type FilterChangeEvent = GraphFilter & {
  index: number
  ended?: boolean
}

export type FilterPointProps = {
  /**
   * Filter parameters object defining type, frequency, gain and Q values
   */
  filter: GraphFilter
  /**
   * Index in the theme colors array
   * @default -1
   */
  index?: number
  /**
   * Enable horizontal (frequency) dragging
   * @default true
   */
  dragX?: boolean
  /**
   * Enable vertical (gain) dragging
   * @default true
   */
  dragY?: boolean
  /**
   * Enable Q adjustment with mouse wheel
   * @default true
   */
  wheelQ?: boolean
  /**
   * Point radius in pixels
   * @default theme.point.radius
   */
  radius?: number
  /**
   * Manual active/hover state
   * @default false
   */
  active?: boolean
  /**
   * Point stroke width
   * @default theme.point.lineWidth
   */
  lineWidth?: number
  /**
   * Show filter type icon instead of label
   * @default false
   */
  showIcon?: boolean
  /**
   * Custom label text
   * @default ''
   */
  label?: string
  /**
   * Label font family
   * @default theme.point.label.fontFamily
   */
  labelFontFamily?: string
  /**
   * Label font size in pixels
   * @default theme.point.label.fontSize
   */
  labelFontSize?: number
  /**
   * Label text color
   * @default theme.point.label.color
   */
  labelColor?: CSSProperties['color']
  /**
   * Point stroke color
   * @default theme.colors[index].point || theme.filters.defaultColor
   */
  color?: CSSProperties['color']
  /**
   * Point stroke color when gain is zero
   * @default theme.filters.zeroPoint.color
   */
  zeroColor?: CSSProperties['color']
  /**
   * Point stroke color while dragging
   * @default theme.colors[index].drag || color
   */
  dragColor?: CSSProperties['color']
  /**
   * Point stroke color when active/hovered
   * @default theme.colors[index].active || color
   */
  activeColor?: CSSProperties['color']
  /**
   * Point fill color
   * @default theme.colors[index].background || color
   */
  background?: CSSProperties['color']
  /**
   * Point fill color when gain is zero
   * @default theme.filters.zeroPoint.background
   */
  zeroBackground?: CSSProperties['color']
  /**
   * Point fill color while dragging
   * @default theme.colors[index].drag || background
   */
  dragBackground?: CSSProperties['color']
  /**
   * Point fill color when active/hovered
   * @default theme.colors[index].activeBackground || background
   */
  activeBackground?: CSSProperties['color']
  /**
   * Point fill opacity
   * @default theme.point.backgroundOpacity.normal
   */
  backgroundOpacity?: CSSProperties['opacity']
  /**
   * Point fill opacity while dragging
   * @default theme.point.backgroundOpacity.drag
   */
  dragBackgroundOpacity?: CSSProperties['opacity']
  /**
   * Point fill opacity when active/hovered
   * @default theme.point.backgroundOpacity.active
   */
  activeBackgroundOpacity?: CSSProperties['opacity']

  /**
   * Additional CSS classes to apply to the filter point
   */
  className?: string
  /**
   * Additional inline styles to apply to the filter point
   */
  style?: CSSProperties

  // Event Handlers
  /**
   * Called when filter parameters change during drag
   * @param filterEvent Updated filter parameters with index
   */
  onChange?: (filterEvent: FilterChangeEvent) => void
  /**
   * Called when mouse enters the point
   * @param filterEvent Current filter parameters with index
   */
  onEnter?: (filterEvent: FilterChangeEvent) => void
  /**
   * Called when mouse leaves the point
   * @param filterEvent Current filter parameters with index
   */
  onLeave?: (filterEvent: FilterChangeEvent) => void
  /**
   * Called when drag state changes
   * @param dragState True when dragging starts, false when it ends
   */
  onDrag?: (dragState: boolean) => void
}

/**
 * Interactive control point for filter parameters manipulation.
 * Provides drag-and-drop frequency/gain control and Q-factor adjustment via mouse wheel.
 *
 * Features:
 * - Horizontal/vertical dragging
 * - Mouse wheel Q control
 * - Multiple states (hover, drag, active)
 * - Optional filter type icon or custom label
 *
 * Uses `defaultColor` from the theme as a fallback when filter colors are not specified.
 *
 */
export const FilterPoint = ({
  filter,
  index = -1,
  dragX = true,
  dragY = true,
  wheelQ = true,
  active = false, // manual `hovered` state
  showIcon = false,
  label = '',
  labelFontSize,
  labelFontFamily,
  labelColor,
  radius,
  lineWidth,

  color,
  zeroColor,
  dragColor,
  activeColor,

  background,
  zeroBackground,
  dragBackground,
  activeBackground,

  backgroundOpacity,
  dragBackgroundOpacity,
  activeBackgroundOpacity,
  className,
  style,

  onChange,
  onEnter,
  onLeave,
  onDrag
}: FilterPointProps) => {
  const {
    svgRef,
    scale,
    logScale,
    height,
    width,
    theme: {
      filters: { zeroPoint, colors, defaultColor, point }
    }
  } = useGraph()
  const { minGain, maxGain, minFreq, maxFreq } = scale
  const { freq: filterFreq, gain: filterGain, q: filterQ, type } = filter

  const circleRef = useRef<SVGCircleElement | null>(null)
  const labelRef = useRef<SVGTextElement | null>(null)

  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)

  const [zeroGain, passFilter] = useMemo(
    () => [getZeroGain(type), type.includes('PASS') || type === 'NOTCH'],
    [type]
  )

  const x = logScale.x(filterFreq)
  const centerY = getCenterLine(minGain, maxGain, height)
  const y = !passFilter
    ? scaleMagnitude(filterGain, minGain, maxGain, height)
    : centerY

  let offset: { x: number; y: number } = { x: 0, y: 0 }

  let cx: number
  let cy: number
  const moveFreq = useRef(filterFreq)
  const moveGain = useRef(filterGain)

  const dragMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault() // Prevent scrolling on touch
    e.stopPropagation()
    if (!circleRef.current) return
    const svgBounds = svgRef.current?.getBoundingClientRect()
    if (!svgBounds) return

    const { x, y } = getPointerPosition(e)
    const offsetX = x - (svgBounds.left ?? 0)
    const offsetY = y - (svgBounds.top ?? 0)

    if (dragX) {
      cx = limitRange(offsetX - offset.x, 0, width)
      circleRef.current.setAttributeNS(null, 'cx', String(cx))
      labelRef.current?.setAttributeNS(null, 'x', String(cx))
      moveFreq.current = stripTail(
        limitRange(calcFrequency(cx, width, minFreq, maxFreq), minFreq, maxFreq)
      )
    }
    if (dragY) {
      if (zeroGain) {
        cy = centerY
      } else {
        cy = limitRange(offsetY - offset.y, 0, height)
      }
      circleRef.current.setAttributeNS(null, 'cy', String(cy))
      labelRef.current?.setAttributeNS(null, 'y', String(cy))
      const gain = stripTail(calcMagnitude(cy, minGain, maxGain, height))
      moveGain.current = gain < gainSnapDb && gain > -gainSnapDb ? 0 : gain
    }

    onChange?.({
      index,
      ...filter,
      freq: moveFreq.current,
      ...(!passFilter ? { gain: moveGain.current } : {})
    })
  }

  const dragEnd = (e: MouseEvent | TouchEvent) => {
    e.preventDefault() // Prevent scrolling on touch
    e.stopPropagation()
    const svg = svgRef.current
    const circleEl = circleRef.current
    if (!svg || !circleEl) return

    const touchEvent = 'touches' in e

    circleEl.setAttribute(
      'fill-opacity',
      String(
        touchEvent
          ? (backgroundOpacity ?? point.backgroundOpacity.normal)
          : (activeBackgroundOpacity ?? point.backgroundOpacity.active)
      )
    )

    svg.removeEventListener('mousemove', dragMove)
    svg.removeEventListener('mouseup', dragEnd)
    svg.removeEventListener('mouseleave', dragEnd)
    // Remove touch listeners as well
    circleEl.removeEventListener('touchmove', dragMove)
    circleEl.removeEventListener('touchend', dragEnd)
    circleEl.removeEventListener('touchcancel', dragEnd)

    setDragging(false)
    onChange?.({
      index,
      ...filter,
      freq: moveFreq.current,
      gain: moveGain.current,
      ended: true
    })
    onDrag?.(false)
  }

  const dragStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault() // Prevent scrolling on touch
    e.stopPropagation()
    const svg = svgRef.current
    const circleEl = circleRef.current
    if (!svg || !circleEl) return

    setDragging(true)
    const svgBounds = svg.getBoundingClientRect()
    const { x, y } = getPointerPosition(e)
    const { left, top } = svgBounds

    offset = {
      x: x - left - parseFloat(circleEl.getAttributeNS(null, 'cx') || '0'),
      y: y - top - parseFloat(circleEl.getAttributeNS(null, 'cy') || '0')
    }

    circleEl.setAttribute(
      'fill-opacity',
      String(dragBackgroundOpacity || point.backgroundOpacity.drag)
    )

    svg.addEventListener('mousemove', dragMove)
    svg.addEventListener('mouseup', dragEnd)
    svg.addEventListener('mouseleave', dragEnd)
    circleEl.addEventListener('touchmove', dragMove)
    circleEl.addEventListener('touchend', dragEnd)
    circleEl.addEventListener('touchcancel', dragEnd)

    onDrag?.(true)
  }

  const handleMouseEnter = () => {
    setHovered(true)
    onEnter?.({ ...filter, index })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    onLeave?.({ ...filter, index })
  }

  const scrollQ = (e: WheelEvent) => {
    e.preventDefault()
    let newQ = filterQ
    newQ += e.deltaY > 0 ? 0.1 : -0.1
    newQ = stripTail(limitRange(newQ, 0.1, 20))
    onChange?.({ index, ...filter, q: newQ, ended: true })
  }

  if (wheelQ) circleRef.current?.addEventListener('wheel', scrollQ)

  if (type === 'BYPASS') return null

  const strokeWidth = lineWidth || point.lineWidth
  const pointColor = color || colors?.[index]?.point || defaultColor
  const bgColor = background || colors?.[index]?.background || pointColor

  const zeroValue = filterGain === 0 && !zeroGain

  const strokeColor = zeroValue
    ? zeroColor || zeroPoint.color
    : dragging
      ? dragColor || colors?.[index]?.drag || pointColor
      : active || hovered
        ? activeColor || colors?.[index]?.active || pointColor // fallback to regular point color if active color is not defined
        : pointColor

  const fillColor = zeroValue
    ? zeroBackground || zeroPoint.background
    : dragging
      ? dragBackground || colors?.[index]?.dragBackground || bgColor
      : active || hovered
        ? activeBackground || colors?.[index]?.activeBackground || bgColor
        : bgColor

  const fillOpacity =
    active || hovered
      ? (activeBackgroundOpacity ?? point.backgroundOpacity?.active)
      : (backgroundOpacity ?? point.backgroundOpacity?.normal)

  if (label || showIcon) {
    labelColor ||= point.label.color
    labelFontSize ||= point.label.fontSize
    labelFontFamily ||= point.label.fontFamily
    if (labelColor === 'inherit') labelColor = strokeColor
  }

  let labelStyle = {}
  if (showIcon) {
    label = getIconSymbol(type)
    labelFontFamily = 'dsssp'
    labelStyle = getIconStyles(type, filterGain)
  }

  return (
    <>
      <circle
        ref={circleRef}
        cx={x}
        cy={y}
        r={radius || point.radius}
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={(e) => dragStart(e as unknown as MouseEvent)}
        onTouchStart={(e) => dragStart(e as unknown as TouchEvent)}
        style={{ cursor: 'pointer', pointerEvents: 'auto', ...style }}
        className={className}
      />
      {Boolean(label) && (
        <text
          ref={labelRef}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={labelColor}
          fontSize={labelFontSize}
          fontFamily={labelFontFamily}
          style={{ ...labelStyle }}
          {...(showIcon
            ? { dangerouslySetInnerHTML: { __html: label } }
            : { children: label })}
        />
      )}
    </>
  )
}
