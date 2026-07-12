import { useGraph } from '.'

export const GraphFrequencyGrid = () => {
  const {
    height,
    logScale,
    scale: { octaveLabels, octaveTicks, majorTicks },
    theme: {
      background: {
        grid: { dotted, lineColor, lineWidth },
        label: { color: labelColor, fontSize, fontFamily }
      }
    }
  } = useGraph()

  const ticks = octaveTicks ? logScale.ticks(octaveTicks) : [0, 0]
  const strokeDasharray = '1,2'

  return (
    // decorative frequency grid + octave labels — hidden from assistive tech
    <g aria-hidden="true">
      {ticks.slice(1, -1).map((tick) => {
        const tickX = logScale.x(tick)

        const width = majorTicks.includes(tick)
          ? lineWidth.major
          : lineWidth.minor

        return (
          <line
            key={tick}
            x1={tickX}
            x2={tickX}
            y1="0"
            y2="100%"
            stroke={lineColor}
            strokeWidth={width}
            {...(dotted ? { strokeDasharray } : {})}
          />
        )
      })}

      {octaveLabels.map((octave) => {
        const octaveX = logScale.x(octave)
        return (
          <text
            key={octave}
            y={height - 4}
            x={octaveX + (octave > 10_000 ? -4 : 4)}
            textAnchor={octave > 10_000 ? 'end' : 'start'}
            fill={labelColor}
            fontSize={fontSize}
            fontFamily={fontFamily}
          >
            {(octave < 1_000 ? octave : `${octave / 1000}k`) + 'Hz'}
          </text>
        )
      })}
    </g>
  )
}
