import { createContext, useContext, useReducer } from "react"

const initialState = {
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
    if (state[action.key] !== undefined) {
      return { ...state, [action.key]: action.value }
    }
    return state
  }
  return state
}

export const ArcBubbleContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bubbleReducer, initialState)

  const handleIntValueChange = key => e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key, value })
  }

  const handleFloatValueChange = key => e => {
    const value = parseFloat(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key, value })
  }

  const handleBoolValueChange = key => e => {
    const value = e.target.checked
    dispatch({ type: 'VALUE_CHANGE', key, value })
  }

  return (
    <ArcBubbleContext.Provider
      value={{
        state,
        handleIntValueChange,
        handleFloatValueChange,
        handleBoolValueChange,
      }}
    >
      {children}
    </ArcBubbleContext.Provider>
  )
}

export const useArcBubbleContext = () => useContext(ArcBubbleContext)