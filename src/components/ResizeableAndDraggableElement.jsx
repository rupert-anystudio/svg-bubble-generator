import { useCallback, useState } from "react"
import { Rnd } from "react-rnd"

const ResizeableAndDraggableElement = ({ children }) => {
  const [layout, setLayout] = useState({
    width: 600,
    height: 300,
    x: 10,
    y: 10,
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // background: "rgba(255,255,255,0.2)",
        // overflow: 'hidden',
        outline: '1px dashed rgba(255,255,255,0.2)'
      }}
      size={{ width: layout.width, height: layout.height }}
      position={{ x: layout.x, y: layout.y }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onResize={handleResize}
      minWidth={300}
      minHeight={300}
    >
      {children(layout)}
    </Rnd>
  )
}

export default ResizeableAndDraggableElement