import { useEffect, useRef, useState, type CSSProperties } from 'react'

import { calcFrequency, calcMagnitude, fastFloor } from '../../math'
import { getPointerPosition } from '../../utils'
import { useGraph } from '../..'

export type PointerTrackerProps = {
  /**
   * Width of the crosshair guide lines
   * @default theme.background.tracker.lineWidth
   */
  lineWidth?: number
  /**
   * Color of the crosshair guide lines
   * @default theme.background.tracker.lineColor
   */
  lineColor?: CSSProperties['color']
  /**
   * Color of the frequency and gain labels
   * @default theme.background.tracker.labelColor
   */
  labelColor?: CSSProperties['color']
  /**
   * Background color of label containers
   * @default theme.background.tracker.backgroundColor
   */
  backgroundColor?: CSSProperties['color']
  /**
   * Number of decimal places for gain value display
   * @default 1
   */
  gainPrecision?: number
}

/**
 * Displays frequency and gain values at the current pointer position.
 * Shows crosshair guides and value labels that follow the pointer.
 **/
export const PointerTracker = ({
  lineWidth,
  lineColor,
  labelColor,
  backgroundColor,
  gainPrecision = 1
}: PointerTrackerProps) => {
  const {
    svgRef,
    width,
    height,
    scale: { minGain, maxGain, minFreq, maxFreq },
    theme: {
      background: {
        tracker,
        label: { fontSize, fontFamily }
      }
    }
  } = useGraph()

  const color = labelColor || tracker.labelColor
  const fillColor = backgroundColor || tracker.backgroundColor
  const strokeColor = lineColor || tracker.lineColor
  const strokeWidth = lineWidth || tracker.lineWidth
  const strokeDasharray = '1,2'

  const fontSizePadding = (fontSize || 0) + 3

  const [freqWidth, setFreqWidth] = useState(0)
  const [gainWidth, setGainWidth] = useState(0)
  const [freqLabel, setFreqLabel] = useState(0)
  const [gainLabel, setGainLabel] = useState(0)
  const [trackMouse, setTrackMouse] = useState(false)
  const [mouse, setMouse] = useState({ x: -50, y: -50 })

  const freqLabelRef = useRef<SVGTextElement | null>(null)
  const gainLabelRef = useRef<SVGTextElement | null>(null)

  const mouseMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault() // Prevent scrolling on touch
    const { x, y } = getPointerPosition(e)
    setMouse({ x, y })

    const newGain = calcMagnitude(y, minGain, maxGain, height).toFixed(
      gainPrecision
    )
    if (newGain !== String(gainLabel)) {
      setGainLabel(Number(newGain))
    }

    const newFreq = fastFloor(calcFrequency(x, width, minFreq, maxFreq))
    if (newFreq !== freqLabel) {
      setFreqLabel(newFreq)
    }
  }

  useEffect(() => {
    if (!freqLabelRef.current) return
    const w = fastFloor(freqLabelRef.current.getBBox().width)
    if (w !== freqWidth) {
      setFreqWidth(w)
    }
  }, [freqLabel])

  useEffect(() => {
    if (!gainLabelRef.current) return
    const w = fastFloor(gainLabelRef.current.getBBox().width)
    if (w !== gainWidth) {
      setGainWidth(w)
    }
  }, [gainLabel])

  const handleMouseEnter = () => setTrackMouse(true)
  const handleMouseLeave = () => setTrackMouse(false)
  const handleTouchStart = () => setTrackMouse(true)
  const handleTouchEnd = () => setTrackMouse(false)
  const handleTouchCancel = () => setTrackMouse(false)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.addEventListener('mouseenter', handleMouseEnter)
    svg.addEventListener('mouseleave', handleMouseLeave)
    svg.addEventListener('mousemove', mouseMove)
    svg.addEventListener('touchstart', handleTouchStart)
    svg.addEventListener('touchmove', mouseMove)
    svg.addEventListener('touchend', handleTouchEnd)
    svg.addEventListener('touchcancel', handleTouchCancel)

    return () => {
      svg.removeEventListener('mouseenter', handleMouseEnter)
      svg.removeEventListener('mouseleave', handleMouseLeave)
      svg.removeEventListener('mousemove', mouseMove)
      svg.removeEventListener('touchstart', handleTouchStart)
      svg.removeEventListener('touchmove', mouseMove)
      svg.removeEventListener('touchend', handleTouchEnd)
      svg.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [svgRef.current])

  useEffect(() => {
    setTrackMouse(true)
  }, [])

  if (!trackMouse) return null

  return (
    // hover coordinate readout — decorative, hidden from assistive tech
    <g aria-hidden="true">
      <rect
        width={freqWidth + 6}
        height={fontSizePadding}
        fill={fillColor}
        stroke={strokeColor}
        x={mouse.x - freqWidth / 2 - 3}
        y={height - fontSizePadding - 1}
      ></rect>
      <text
        ref={freqLabelRef}
        x={mouse.x - freqWidth / 2}
        y={height - 4}
        fill={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
      >
        {freqLabel}
      </text>

      <rect
        width={gainWidth + 6}
        height={fontSizePadding}
        fill={fillColor}
        stroke={strokeColor}
        x={0.5}
        y={mouse.y - 7}
      ></rect>
      <text
        ref={gainLabelRef}
        x={3}
        y={mouse.y + 3}
        fill={color}
        fontSize={fontSize}
        fontFamily={fontFamily}
      >
        {gainLabel > 0 ? `+${gainLabel}` : gainLabel}
      </text>

      <line
        x1={gainWidth + 7}
        x2={width}
        y1={mouse.y}
        y2={mouse.y}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />

      <line
        x1={mouse.x}
        x2={mouse.x}
        y1={0}
        y2={height - 14}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />
    </g>
  )
}
