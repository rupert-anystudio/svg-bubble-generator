import { AppContextProvider } from './components/AppContext'
import AppControls from './components/AppControls'
import DemoBubble from './components/DemoBubble'

function App() {
  return (
    <AppContextProvider>
      <div className="app">
        <div className="controls">
        {/* <div className="row">
          <AppControls />
        </div>   */}
        </div>
        <div className="stage">
          <DemoBubble />
        </div>
      </div>
    </AppContextProvider>
  )
}

export default App
