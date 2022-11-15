import { useBubbleContext } from "./BubbleContext"

const BubbleContainer = ({
  children,
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
  } = useBubbleContext()
  return children({
    width,
    height,
    x,
    y,
    bubbleMaxRadius,
    bubbleMinRadius,
    strokeWidth,
    bubbleDensity,
  })
}

export default BubbleContainer