import { AppContextProvider } from './components/AppContext'
import ArcBubbleInteractive from './components/ArcBubbleInteractive'

function App() {
  return (
    <AppContextProvider>
      <div className="app">
        <div className="stage">
          <ArcBubbleInteractive>
            {'Memoizing the children tells React that it only needs to re-render them when deferredQuery changes and not when query changes. This caveat is not unique to useDeferredValue, and its the same pattern you would use with similar hooks that use debouncing or throttling.'}
          </ArcBubbleInteractive>
        </div>
      </div>
    </AppContextProvider>
  )
}

export default App
