'use client'

import type React from 'react'
import { createContext, useMemo } from 'react'

import {
  type GraphScale,
  type GraphTheme,
  type LogScaleFunction
} from '../../types'

type GraphContextProps = {
  width: number
  height: number
  theme: GraphTheme
  scale: GraphScale
  logScale: LogScaleFunction
  svgRef: React.RefObject<SVGSVGElement | null>
}

export const GraphContext = createContext<GraphContextProps | undefined>(
  undefined
)

export const GraphProvider = ({
  children,
  svgRef,
  scale,
  logScale,
  height,
  width,
  theme
}: {
  children: React.ReactNode
  svgRef: React.RefObject<SVGSVGElement | null>
  theme: GraphTheme
  scale: GraphScale
  height: number
  width: number
  logScale: LogScaleFunction
}) => {
  // Memoize theme and scale separately to catch actual value changes
  const memoizedTheme = useMemo(() => theme, [JSON.stringify(theme)])

  const memoizedScale = useMemo(() => scale, [JSON.stringify(scale)])

  const contextValue = useMemo(
    () => ({
      svgRef,
      theme: memoizedTheme,
      scale: memoizedScale,
      logScale,
      height,
      width
    }),
    [svgRef, memoizedTheme, memoizedScale, logScale, height, width]
  )

  return (
    <GraphContext.Provider value={contextValue}>
      {children}
    </GraphContext.Provider>
  )
}
