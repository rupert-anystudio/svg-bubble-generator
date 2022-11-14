import Bubble from "./Bubble"
import ResizeableAndDraggableElement from "./ResizeableAndDraggableElement"

const BubbleContainer = ({
  x,
  y,
  width,
  height,
  minWidth,
  minHeight,
  bubbleMaxRadius,
  bubbleMinRadius,
  strokeWidth,
  bubbleDensity,
}) => {
  const resizingProps = {
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
  }
  const bubbleProps = {
    bubbleMaxRadius,
    bubbleMinRadius,
    strokeWidth,
    bubbleDensity,
  }
  return (
    <ResizeableAndDraggableElement {...resizingProps}>
      {layout => (
        <Bubble
          width={layout.width}
          height={layout.height}
          {...bubbleProps}
        />
      )}
    </ResizeableAndDraggableElement>
  )
}

export default BubbleContainer