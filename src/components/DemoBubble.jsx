import Bubble from "./Bubble"
import { BubbleContextProvider, useBubbleContext } from "./BubbleContext"
import { Rnd } from "react-rnd"
import { useCallback } from "react"

const LayoutControls = () => {
  const context = useBubbleContext()
  const {
    dispatch,
    width,
    height,
  } = context

  const handleLayoutChange = key => e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'LAYOUT_CHANGE', value: { [key]: value } })
  }

  return (
    <fieldset>
      <section>
        <label htmlFor="width">width</label>
        <input id="width" type="range" min="0" max="2000" value={width} onChange={handleLayoutChange('width')} />
        <strong>{width}</strong>
      </section>
      <section>
        <label htmlFor="height">height</label>
        <input id="height" type="range" min="0" max="2000" value={height} onChange={handleLayoutChange('height')} />
        <strong>{height}</strong>
      </section>
    </fieldset>
  )
}

const StyleControls = () => {
  const context = useBubbleContext()
  const {
    bubbleDensity,
    strokeWidth,
    dispatch,
  } = context

  const handleBubbleDensityChange = e => {
    const value = parseFloat(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key: 'bubbleDensity', value })
  }

  const handleStrokeWidthChange = e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key: 'strokeWidth', value })
  }

  return (
    <fieldset>
      <section>
        <label htmlFor="bubbleDensity">Density</label>
        <input id="bubbleDensity" type="range" min="0.5" max="2" step="0.1" value={bubbleDensity} onChange={handleBubbleDensityChange} />
        <strong>{bubbleDensity}</strong>
      </section>
      <section>
        <label htmlFor="strokeWidth">Stroke Width</label>
        <input id="strokeWidth" type="range" min="0" max="50" value={strokeWidth} onChange={handleStrokeWidthChange} />
        <strong>{strokeWidth}</strong>
      </section>
    </fieldset>
  )
}

const RadiusControls = () => {
  const context = useBubbleContext()
  const {
    bubbleMaxRadius,
    bubbleMinRadius,
    radiusOffset,
    dispatch,
  } = context

  const handleBubbleMaxRadiusChange = e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key: 'bubbleMaxRadius', value })
  }

  const handleRadiusOffsetChange = e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key: 'radiusOffset', value })
  }

  const handleBubbleMinRadiusChange = e => {
    const value = parseInt(e.target.value)
    dispatch({ type: 'VALUE_CHANGE', key: 'bubbleMinRadius', value })
  }

  return (
    <fieldset>
      <section>
        <label htmlFor="bubbleMaxRadius">Max Radius</label>
        <input id="bubbleMaxRadius" type="range" min="10" max="150" value={bubbleMaxRadius} onChange={handleBubbleMaxRadiusChange} />
        <strong>{bubbleMaxRadius}</strong>
      </section>
      <section>
        <label htmlFor="bubbleMinRadius">Min Radius</label>
        <input id="bubbleMinRadius" type="range" min="10" max="150" value={bubbleMinRadius} onChange={handleBubbleMinRadiusChange} readOnly />
        <strong>{bubbleMinRadius}</strong>
      </section>
      <section>
        <label htmlFor="radiusOffset">Radius Variance</label>
        <input id="radiusOffset" type="range" min="0" max="200" value={radiusOffset} onChange={handleRadiusOffsetChange} />
        <strong>{radiusOffset}</strong>
      </section>
    </fieldset>
  )
}

const DemoBubble = ({
  minWidth,
  minHeight,
}) => {
  const {
    width,
    height,
    x,
    y,
    bubbleMaxRadius,
    bubbleMinRadius,
    strokeWidth,
    bubbleDensity,
    dispatch,
  } = useBubbleContext()

  const handleDragStop = useCallback((e, position) => {
    dispatch({ type: 'LAYOUT_CHANGE', value: { x: position.x, y: position.y } })
  }, [dispatch])

  const handleResize = useCallback((e, direction, ref, delta, position) => {
    dispatch({ type: 'LAYOUT_CHANGE', value: { width: ref.offsetWidth, height: ref.offsetHeight, x: position.x, y: position.y } })
  }, [dispatch])

  const rndProps = {
    style: {
      outline: '1px dashed rgba(255,255,255,0.2)',
    },
    size: { width, height },
    position: { x, y },
    onDragStop: handleDragStop,
    onResizeStop: handleResize,
    onResize: handleResize,
    minWidth,
    minHeight,
    dragHandleClassName: 'bubble',
  }

  const bubbleProps = {
    width,
    height,
    bubbleMaxRadius,
    bubbleMinRadius,
    strokeWidth,
    bubbleDensity,
  }

  return (
    <>
      <Rnd {...rndProps}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '280px 280px 280px',
          gridGap: 0,
          position: 'absolute',
          bottom: '100%',
          left: 0,
          marginBottom: 20,
          right: 0,
        }}>
          <LayoutControls />
          <StyleControls />
          <RadiusControls />
        </div>
        <Bubble {...bubbleProps} />
      </Rnd>
    </>
  )
}

const DemoBubbleContainer = () => {
  return (
    <BubbleContextProvider>
      <DemoBubble />
    </BubbleContextProvider>
  )
}

export default DemoBubbleContainer