import BubbleOptions from './components/BubbleOptions'
import Bubble from './components/Bubble'

function App() {
  return (
    <div className="app">
      <BubbleOptions>
        {options => (
          <Bubble options={options} />
        )}
      </BubbleOptions>
    </div>
  )
}

export default App
