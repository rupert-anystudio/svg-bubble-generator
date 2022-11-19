import { createContext, useContext, useReducer } from "react"

const initialContext = {
}

const AppContext = createContext()

function appReducer(state, action) {
  return state
}

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialContext)
  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)