import React from 'react'

import { getCenterLine } from '../../math'
import { useGraph } from '.'

export const GraphGainGrid = () => {
  const {
    height,
    scale: { minGain, maxGain, dbSteps, dbLabels },
    theme: {
      background: {
        grid: { dotted, lineColor, lineWidth },
        label: { color: labelColor, fontSize, fontFamily }
      }
    }
  } = useGraph()

  if (!dbSteps) return null

  const steps = dbSteps || maxGain // default to maxGain if not provided, showing only the center line

  const dBs = Array.from(
    { length: (maxGain - minGain) / steps + 1 },
    (_, i) => {
      return maxGain - i * steps
    }
  )

  const centerY = getCenterLine(minGain, maxGain, height)
  const strokeDasharray = '1,2'

  return (
    // decorative dB grid + axis labels — hidden from assistive tech
    <g aria-hidden="true">
      {dBs.slice(0, -1).map((tick, index) => {
        if (index === 0) return null
        const tickY = `${(index / (dBs.length - 1)) * 100}%`
        const tickLabel = tick > 0 ? `+${tick}` : tick

        return (
          <React.Fragment key={tick}>
            <line
              x1="0"
              x2="100%"
              y1={tickY}
              y2={tickY}
              stroke={lineColor}
              strokeWidth={lineWidth.minor}
              {...(dotted ? { strokeDasharray } : {})}
            />
            {dbLabels && index !== 0 && index !== dBs.length - 1 && (
              <text
                x={3}
                y={tickY}
                fill={labelColor}
                fontSize={fontSize}
                fontFamily={fontFamily}
                textAnchor="start"
                transform="translate(0 -3)"
              >
                {tickLabel}
              </text>
            )}
          </React.Fragment>
        )
      })}
      <line
        id="centerLine"
        x1="0"
        x2="100%"
        y1={centerY}
        y2={centerY}
        stroke={lineColor}
        strokeWidth={lineWidth.center}
        {...(dotted ? { strokeDasharray } : {})}
      />
      {dbLabels && (
        <text
          y={12}
          x={5}
          fill={labelColor}
          fontSize={fontSize}
          fontFamily={fontFamily}
        >
          dB
        </text>
      )}
    </g>
  )
}
