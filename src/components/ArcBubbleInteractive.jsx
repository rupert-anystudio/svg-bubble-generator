import ArcBubble from "./ArcBubbleNew"
import { ArcBubbleContextProvider, useArcBubbleContext } from "./ArcBubbleContext"
import DraggableAndResizeable from "./DraggableAndResizeable"

const Controls = () => {
  const context = useArcBubbleContext()
  const {
    minSegmentsLength,
    maxVariation,
    showHelpers,
    dispatch,
    randomShift,
    padding,
    offset,
    seed,
    fontSize,
  } = context

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
          <label htmlFor="seed">seed</label>
          <input id="seed" type="range" min="0" max="5" value={seed} onChange={handleIntValueChange('seed')} />
          <strong>{seed}</strong>
        </section>
        <section>
          <label htmlFor="randomShift">randomShift</label>
          <input id="randomShift" type="range" min="0" max="100" value={randomShift} onChange={handleIntValueChange('randomShift')} />
          <strong>{randomShift}</strong>
        </section>
        <section>
          <label htmlFor="offset">offset</label>
          <input id="offset" type="range" min="-200" max="200" value={offset} onChange={handleIntValueChange('offset')} />
          <strong>{offset}</strong>
        </section>
        <section>
          <label htmlFor="padding">padding</label>
          <input id="padding" type="range" min="0" max="200" value={padding} onChange={handleIntValueChange('padding')} />
          <strong>{padding}</strong>
        </section>
      </fieldset>
      <fieldset>
        <section>
          <label htmlFor="fontSize">fontSize</label>
          <input id="fontSize" type="range" min="1" max="20" step={0.01} value={fontSize} onChange={handleFloatValueChange('fontSize')} />
          <strong>{fontSize}</strong>
        </section>
        <section>
          <label htmlFor="minSegmentsLength">minSegmentsLength</label>
          <input id="minSegmentsLength" type="range" min="20" max="300" step={0.01} value={minSegmentsLength} onChange={handleFloatValueChange('minSegmentsLength')} />
          <strong>{minSegmentsLength}</strong>
        </section>
        <section>
          <label htmlFor="maxVariation">maxVariation</label>
          <input id="maxVariation" type="range" min="0" max="150" value={maxVariation} step={0.01} onChange={handleFloatValueChange('maxVariation')} />
          <strong>{maxVariation}</strong>
        </section>
        <section>
          <label htmlFor="showHelpers">showHelpers</label>
          <input id="showHelpers" type="checkbox" checked={showHelpers} onChange={handleBoolValueChange('showHelpers')} />
          <strong>{showHelpers}</strong>
        </section>
      </fieldset>
    </div>
  )
}

const ArcBubbleContainer = (props) => {
  const {
    minSegmentsLength,
    maxVariation,
    showHelpers,
    isConcave,
    dampener,
    randomShift,
    offset,
    padding,
    seed,
    fontSize,
  } = useArcBubbleContext()
  return (
    <ArcBubble
      {...{
        ...props,
        minSegmentsLength,
        maxVariation,
        showHelpers,
        isConcave,
        dampener,
        randomShift,
        offset,
        padding,
        seed,
        fontSize,
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
  children,
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
            <ArcBubbleContainer {...layout}>
              {children}
            </ArcBubbleContainer>
            <Controls />
          </>
        )}
      </DraggableAndResizeable>
    </ArcBubbleContextProvider>
  )
}

export default ArcBubbleInteractive