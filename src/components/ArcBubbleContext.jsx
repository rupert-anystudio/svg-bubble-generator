import { createContext, useContext, useReducer } from "react"

const initialContext = {
  minSegmentsLength: 80,
  maxVariation: 40,
  showHelpers: false,
  isConcave: false,
  dampener: 10,
  randomShift: 15,
  offset: -25,
  padding: 70,
  seed: 0,
  fontSize: 7,
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
    if (action.key === 'randomShift') {
      return { ...state, randomShift: action.value }
    }
    if (action.key === 'offset') {
      return { ...state, offset: action.value }
    }
    if (action.key === 'padding') {
      return { ...state, padding: action.value }
    }
    if (action.key === 'seed') {
      return { ...state, seed: action.value }
    }
    if (action.key === 'fontSize') {
      return { ...state, fontSize: action.value }
    }
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