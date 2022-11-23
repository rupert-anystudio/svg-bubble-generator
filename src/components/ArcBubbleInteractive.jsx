import ArcBubble from "./ArcBubbleNew"
import { ArcBubbleContextProvider, useArcBubbleContext } from "./ArcBubbleContext"
import DraggableAndResizeable from "./DraggableAndResizeable"

const Controls = () => {
  const context = useArcBubbleContext()
  const {
    minSegmentsLength,
    maxVariation,
    showHelpers,
    isConcave,
    dampener,
    dispatch,
  } = context

  const handleIntValueChange = key => e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key, value })
  }

  const handleBoolValueChange = key => e => {
    const value = e.target.checked
    dispatch({ type: 'VALUE_CHANGE', key, value })
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 280px 280px',
        gridGap: 0,
        position: 'absolute',
        bottom: '100%',
        left: 0,
        paddingBottom: 20,
        right: 0,
      }}
    >
      <fieldset>
        <section>
          <label htmlFor="minSegmentsLength">minSegmentsLength</label>
          <input id="minSegmentsLength" type="range" min="10" max="200" value={minSegmentsLength} onChange={handleIntValueChange('minSegmentsLength')} />
          <strong>{minSegmentsLength}</strong>
        </section>
        <section>
          <label htmlFor="maxVariation">maxVariation</label>
          <input id="maxVariation" type="range" min="0" max="800" value={maxVariation} onChange={handleIntValueChange('maxVariation')} />
          <strong>{maxVariation}</strong>
        </section>
        <section>
          <label htmlFor="dampener">dampener</label>
          <input id="dampener" type="range" min="0" max="1000" value={dampener} onChange={handleIntValueChange('dampener')} />
          <strong>{dampener}</strong>
        </section>
        {/* <section>
          <label htmlFor="isConcave">isConcave</label>
          <input id="isConcave" type="checkbox" checked={isConcave} onChange={handleBoolValueChange('isConcave')} />
          <strong>{isConcave}</strong>
        </section> */}
        <section>
          <label htmlFor="showHelpers">showHelpers</label>
          <input id="showHelpers" type="checkbox" checked={showHelpers} onChange={handleBoolValueChange('showHelpers')} />
          <strong>{showHelpers}</strong>
        </section>
      </fieldset>
    </div>
  )
}

const ArcBubbleContainer = props => {
  const {
    minSegmentsLength,
    maxVariation,
    showHelpers,
    isConcave,
    dampener,
  } = useArcBubbleContext()
  return (
    <ArcBubble
      {...props}
      {...{
        minSegmentsLength,
        maxVariation,
        showHelpers,
        isConcave,
        dampener,
      }}
    />
  )
}

const ArcBubbleInteractive = ({
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  minSegmentsLength,
  maxVariation,
  showHelpers,
  isConcave,
  dampener,
}) => {
  return (
    <ArcBubbleContextProvider
      initialValue={{
        minSegmentsLength,
        maxVariation,
        showHelpers,
        isConcave,
        dampener,
      }}
    >
      <DraggableAndResizeable
        {...{
          x,
          y,
          width,
          height,
          minWidth,
          minHeight,
          dragHandleClassName: 'bubble',
        }}
      >
        {layout => (
          <>
            <Controls />
            <ArcBubbleContainer {...layout} />
          </>
        )}
      </DraggableAndResizeable>
    </ArcBubbleContextProvider>
  )
}

export default ArcBubbleInteractive