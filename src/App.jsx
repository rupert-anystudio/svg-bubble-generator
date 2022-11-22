import { AppContextProvider } from './components/AppContext'
import ArcBubbleInteractive from './components/ArcBubbleInteractive'

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
          {/* <DemoBubble /> */}
          <ArcBubbleInteractive
            width={550}
            height={380}
            x={20}
            y={20}
            maxVariation={120}
            minSegmentsLength={80}
            dampener={20}
            style={{
              fill: 'white',
              stroke: 'none',
              // strokeWidth: 3,
            }}
          />
          {/* <ArcBubbleInteractive
            width={550}
            height={380}
            x={20}
            y={400}
            maxVariation={120}
            minSegmentsLength={40}
            dampener={2}
            style={{
              fill: 'black',
              stroke: 'white',
              strokeWidth: 6,
            }}
          />
          <ArcBubbleInteractive
            width={550}
            height={380}
            x={600}
            y={20}
            isConcave
            maxVariation={80}
            minSegmentsLength={40}
            dampener={6}
            style={{
              fill: 'orange',
              stroke: 'none',
            }}
          /> */}
        </div>
      </div>
    </AppContextProvider>
  )
}

export default App
