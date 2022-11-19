import { createContext, useContext, useReducer } from "react"

const initialContext = {
  bubbleMaxRadius: 75,
  radiusOffset: 35,
  bubbleMinRadius: 40,
  strokeWidth: 10,
  bubbleDensity: 1.3,
  x: 40,
  y: 260,
  width: 1040,
  height: 600,
  minWidth: 420,
  minHeight: 300,
}

const BubbleContext = createContext()

function bubbleReducer(state, action) {
  if (action.type === 'LAYOUT_CHANGE') {
    return {
      ...state,
      x: action?.value?.x ?? state.x,
      y: action?.value?.y ?? state.y,
      width: action?.value?.width ?? state.width,
      height: action?.value?.height ?? state.height,
    }
  }
  if (action.type === 'VALUE_CHANGE') {
    if (action.key === 'bubbleMaxRadius') {
      const bubbleMaxRadius = action.value ?? state.bubbleMaxRadius
      const bubbleMinRadius = bubbleMaxRadius - state.radiusOffset
      if (bubbleMinRadius < 0) {
        const radiusOffset = state.radiusOffset + bubbleMinRadius
        return { ...state, bubbleMaxRadius, bubbleMinRadius: 0, radiusOffset  }
      }
      return { ...state, bubbleMaxRadius, bubbleMinRadius }
    }
    if (action.key === 'bubbleMinRadius') {
      const bubbleMinRadius = action.value ?? state.bubbleMinRadius
      const bubbleMaxRadius = state.bubbleMaxRadius < bubbleMinRadius ? bubbleMinRadius : state.bubbleMaxRadius
      const radiusOffset = bubbleMaxRadius - bubbleMinRadius
      return { ...state, bubbleMinRadius, bubbleMaxRadius, radiusOffset }
    }
    if (action.key === 'radiusOffset') {
      const radiusOffset = action.value ?? state.radiusOffset
      const bubbleMinRadius = state.bubbleMaxRadius - radiusOffset
      if (bubbleMinRadius < 0) return state
      return { ...state, bubbleMinRadius, radiusOffset }
    }
    if (action.key === 'strokeWidth') {
      return { ...state, strokeWidth: action.value ?? state.strokeWidth }
    }
    if (action.key === 'bubbleDensity') {
      return { ...state, bubbleDensity: action.value ?? state.bubbleDensity }
    }
    return state
  }
  return state
}

export const BubbleContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bubbleReducer, initialContext)

  return (
    <BubbleContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </BubbleContext.Provider>
  )
}

export const useBubbleContext = () => useContext(BubbleContext)