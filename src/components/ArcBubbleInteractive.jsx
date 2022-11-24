import ArcBubble from "./ArcBubbleNew"
import { ArcBubbleContextProvider, useArcBubbleContext } from "./ArcBubbleContext"
import DraggableAndResizeable from "./DraggableAndResizeable"

const Controls = () => {
  const {
    state,
    handleIntValueChange,
    handleFloatValueChange,
    handleBoolValueChange
   } = useArcBubbleContext()
  const {
    minSegmentsLength,
    maxVariation,
    showHelpers,
    randomShift,
    padding,
    offset,
    seed,
    fontSize,
  } = state

  return (
    <div className="controls">
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
  const { state } = useArcBubbleContext()
  return (
    <ArcBubble {...props} {...state} />
  )
}

const ArcBubbleInteractive = ({
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  children,
}) => {
  return (
    <ArcBubbleContextProvider>
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