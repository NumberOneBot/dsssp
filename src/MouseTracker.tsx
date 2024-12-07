import React, { useEffect, useRef, useState } from 'react'

import { useGraph } from './FrequencyGraphProvider'
import { calcFrequency, calcMagnitude, fastFloor } from './math'
import { type MouseTrackerProps } from './types'
import { getMousePosition } from './utils'

export const MouseTracker = ({
  lineWidth,
  lineColor,
  backgroundColor
}: MouseTrackerProps) => {
  const {
    scale,
    svgRef,
    theme: {
      background: { tracker }
    }
  } = useGraph()

  const { minDB, maxDB, height, width, minFreq, maxFreq } = scale

  const strokeDasharray = '1,3'
  const color = lineColor || tracker.lineColor
  const strokeWidth = lineWidth || tracker.lineWidth
  const fillColor = backgroundColor || tracker.backgroundColor

  const [freqWidth, setFreqWidth] = useState(0)
  const [gainWidth, setGainWidth] = useState(0)
  const [freqLabel, setFreqLabel] = useState(0)
  const [gainLabel, setGainLabel] = useState(0)
  const [trackMouse, setTrackMouse] = useState(false)
  const [mouse, setMouse] = useState({ x: -50, y: -50 })

  const freqLabelRef = useRef<SVGTextElement | null>(null)
  const gainLabelRef = useRef<SVGTextElement | null>(null)

  const mouseMove = (e: MouseEvent) => {
    const { x, y } = getMousePosition(e)
    setMouse({ x, y })

    const newGain = calcMagnitude(y, minDB, maxDB, height).toFixed(1)
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

  useEffect(() => {
    if (!svgRef.current) return
    svgRef.current.addEventListener('mouseenter', () => setTrackMouse(true))
    svgRef.current.addEventListener('mouseleave', () => setTrackMouse(false))
    svgRef.current?.addEventListener('mousemove', mouseMove)
  }, [svgRef])

  useEffect(() => {
    setTrackMouse(true)
  }, [])

  if (!trackMouse) return null

  return (
    <React.Fragment>
      <rect
        width={freqWidth + 6}
        height="14"
        fill={backgroundColor}
        stroke={color}
        x={mouse.x - freqWidth / 2 - 3}
        y={height - 15}
      ></rect>
      <text
        ref={freqLabelRef}
        x={mouse.x - freqWidth / 2}
        y={height - 5}
        fill={color}
        fontSize="10px"
      >
        {freqLabel}
      </text>

      <rect
        width={gainWidth + 7}
        height="14"
        fill={fillColor}
        stroke={color}
        x={0}
        y={mouse.y - 7}
      ></rect>
      <text
        ref={gainLabelRef}
        x={3}
        y={mouse.y + 3}
        fill={color}
        fontSize="10px"
      >
        {gainLabel > 0 ? `+${gainLabel}` : gainLabel}
      </text>

      <line
        x1={gainWidth + 7}
        x2={width}
        y1={mouse.y}
        y2={mouse.y}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />

      <line
        x1={mouse.x}
        x2={mouse.x}
        y1={0}
        y2={height - 16}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round"
      />
    </React.Fragment>
  )
}
