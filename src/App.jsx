import Bubble from './components/Bubble'
import ResizeableAndDraggableElement from './components/ResizeableAndDraggableElement'

function App() {
  return (
    <div className="app">
      <ResizeableAndDraggableElement>
        {layout => (
          <Bubble
            width={layout.width}
            height={layout.height}
            bubbleMaxRadius={65}
            bubbleMinRadius={40}
            strokeWidth={15}
            bubbleDensity={1.2}
          />
        )}
      </ResizeableAndDraggableElement>
    </div>
  )
}

export default App
