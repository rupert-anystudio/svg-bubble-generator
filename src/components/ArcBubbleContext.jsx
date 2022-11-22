import { createContext, useContext, useReducer } from "react"

const initialContext = {
  minSegmentsLength: 120,
  maxVariation: 80,
  showHelpers: false,
  isConcave: false,
  dampener: 10,
}

const ArcBubbleContext = createContext()

function bubbleReducer(state, action) {
  if (action.type === 'VALUE_CHANGE') {
    if (action.key === 'minSegmentsLength') {
      return { ...state, minSegmentsLength: action.value }
    }
    if (action.key === 'maxVariation') {
      return { ...state, maxVariation: action.value }
    }
    if (action.key === 'dampener') {
      return { ...state, dampener: action.value }
    }
    if (action.key === 'isConcave') {
      return { ...state, isConcave: action.value }
    }
    if (action.key === 'showHelpers') {
      return { ...state, showHelpers: action.value }
    }
    // if (action.key === 'bubbleMinRadius') {
    //   const bubbleMinRadius = action.value ?? state.bubbleMinRadius
    //   const bubbleMaxRadius = state.bubbleMaxRadius < bubbleMinRadius ? bubbleMinRadius : state.bubbleMaxRadius
    //   const radiusOffset = bubbleMaxRadius - bubbleMinRadius
    //   return { ...state, bubbleMinRadius, bubbleMaxRadius, radiusOffset }
    // }
    // if (action.key === 'radiusOffset') {
    //   const radiusOffset = action.value ?? state.radiusOffset
    //   const bubbleMinRadius = state.bubbleMaxRadius - radiusOffset
    //   if (bubbleMinRadius < 0) return state
    //   return { ...state, bubbleMinRadius, radiusOffset }
    // }
    // if (action.key === 'strokeWidth') {
    //   return { ...state, strokeWidth: action.value ?? state.strokeWidth }
    // }
    // if (action.key === 'bubbleDensity') {
    //   return { ...state, bubbleDensity: action.value ?? state.bubbleDensity }
    // }
    return state
  }
  return state
}

export const ArcBubbleContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bubbleReducer, initialContext)

  return (
    <ArcBubbleContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </ArcBubbleContext.Provider>
  )
}

export const useArcBubbleContext = () => useContext(ArcBubbleContext)