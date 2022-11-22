import { useCallback, useReducer } from "react"
import { Rnd } from "react-rnd"

const initialLayout = {
  x: 40,
  y: 260,
  width: 1040,
  height: 600,
}

function layoutReducer(state, action) {
  if (action.type === 'LAYOUT_CHANGE') {
    return {
      ...state,
      x: action?.value?.x ?? state.x,
      y: action?.value?.y ?? state.y,
      width: action?.value?.width ?? state.width,
      height: action?.value?.height ?? state.height,
    }
  }
  if (action.type === 'VALUE_CHANGE') {
    if (action.key === 'bubbleMaxRadius') {
      const bubbleMaxRadius = action.value ?? state.bubbleMaxRadius
      const bubbleMinRadius = bubbleMaxRadius - state.radiusOffset
      if (bubbleMinRadius < 0) {
        const radiusOffset = state.radiusOffset + bubbleMinRadius
        return { ...state, bubbleMaxRadius, bubbleMinRadius: 0, radiusOffset  }
      }
      return { ...state, bubbleMaxRadius, bubbleMinRadius }
    }
    if (action.key === 'bubbleMinRadius') {
      const bubbleMinRadius = action.value ?? state.bubbleMinRadius
      const bubbleMaxRadius = state.bubbleMaxRadius < bubbleMinRadius ? bubbleMinRadius : state.bubbleMaxRadius
      const radiusOffset = bubbleMaxRadius - bubbleMinRadius
      return { ...state, bubbleMinRadius, bubbleMaxRadius, radiusOffset }
    }
    if (action.key === 'radiusOffset') {
      const radiusOffset = action.value ?? state.radiusOffset
      const bubbleMinRadius = state.bubbleMaxRadius - radiusOffset
      if (bubbleMinRadius < 0) return state
      return { ...state, bubbleMinRadius, radiusOffset }
    }
    if (action.key === 'strokeWidth') {
      return { ...state, strokeWidth: action.value ?? state.strokeWidth }
    }
    if (action.key === 'bubbleDensity') {
      return { ...state, bubbleDensity: action.value ?? state.bubbleDensity }
    }
    return state
  }
  return state
}


const DraggableAndResizeable = ({
  children,
  minWidth,
  minHeight,
  x = 40,
  y = 260,
  width = 1040,
  height = 600,
  dragHandleClassName,
}) => {
  const [layout, dispatch] = useReducer(layoutReducer, {
    x,
    y,
    width,
    height,
  })

  const handleDragStop = useCallback((e, position) => {
    dispatch({ type: 'LAYOUT_CHANGE', value: { x: position.x, y: position.y } })
  }, [dispatch])

  const handleResize = useCallback((e, direction, ref, delta, position) => {
    dispatch({ type: 'LAYOUT_CHANGE', value: { width: ref.offsetWidth, height: ref.offsetHeight, x: position.x, y: position.y } })
  }, [dispatch])

  return (
    <Rnd
      size={{ width: layout.width, height: layout.height }}
      position={{ x: layout.x, y: layout.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResize}
      onResize={handleResize}
      minWidth={minWidth}
      minHeight={minHeight}
      dragHandleClassName={dragHandleClassName}
    >
      {children(layout)}
    </Rnd>
  )
}

export default DraggableAndResizeable