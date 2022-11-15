import { useCallback, useState } from "react"
import { Rnd } from "react-rnd"

const ResizeableAndDraggableElement = ({
  children,
  width = 600,
  height = 300,
  x = 0,
  y = 0,
  minWidth = 300,
  minHeight = 300,
}) => {
  const [layout, setLayout] = useState({
    width,
    height,
    x,
    y,
  })

  const handleDragStop = useCallback((e, d) => {
    setLayout(prev => ({
      ...prev,
      ...d,
    }))
  }, [setLayout])

  const handleResizeStop = useCallback((e, direction, ref, delta, position) => {
    setLayout(prev => ({
      ...prev,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      ...position,
    }))
  }, [setLayout])

  const handleResize = useCallback((e, direction, ref, delta, position) => {
    setLayout(prev => ({
      ...prev,
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      ...position,
    }))
  }, [setLayout])

  return (
    <Rnd
      style={{
        outline: '1px dashed rgba(255,255,255,0.2)',
      }}
      size={{ width: layout.width, height: layout.height }}
      position={{ x: layout.x, y: layout.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onResize={handleResize}
      minWidth={minWidth}
      minHeight={minHeight}
      dragHandleClassName='bubble'
    >
      {children(layout)}
    </Rnd>
  )
}

export default ResizeableAndDraggableElement