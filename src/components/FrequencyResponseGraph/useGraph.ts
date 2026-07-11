import { useContext } from 'react'

import { GraphContext } from '.'

export const useGraph = () => {
  const context = useContext(GraphContext)
  if (context === undefined) {
    throw new Error('useGraph must be used within a <FrequencyResponseGraph>')
  }
  return context
}
