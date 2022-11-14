import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

function returnBubbles({
  bubbleMaxRadius,
  bubbleMinRadius,
  bubbleDensity,
  rootElement,
}) {
  if (!rootElement) return []
  const circumference = rootElement.getTotalLength()
  const averageBubbleDiameter = ((bubbleMaxRadius + bubbleMinRadius) / 2) * 2
  const averageBubbleAmount = Math.ceil(circumference / (averageBubbleDiameter / bubbleDensity))
  const segmentLength = circumference / averageBubbleAmount
  const distributionOffset = Math.random() * segmentLength
  return Array
    .from({length: averageBubbleAmount}, (v, i) => i)
    .map(step => {
      const position = rootElement.getPointAtLength(segmentLength * step + distributionOffset)
      const radius = Math.random() * (bubbleMaxRadius - bubbleMinRadius) + bubbleMinRadius
      return { key: step, cx: position.x, cy: position.y, r: radius }
    })
}

const Bubble = ({
  width,
  height,
  bubbleMaxRadius = 65,
  bubbleMinRadius = 40,
  strokeWidth = 5,
  bubbleDensity = 1.2,
}) => {
  const rootRef = useRef()
  const [bubbles, setBubbles] = useState([])
  // const measuredRoot = useCallback(node => {
  //   if (node !== null) {
  //     const length = node.getTotalLength()
  //     console.log({ length })
  //   }
  // }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!rootRef.current) return
      const newBubbles = returnBubbles({
        bubbleMaxRadius,
        bubbleMinRadius,
        bubbleDensity,
        rootElement: rootRef.current
      })
      setBubbles(newBubbles)
    }, 0)
    return () => clearInterval(timeout)
  }, [width, height, bubbleMaxRadius, bubbleMinRadius, bubbleDensity ])

  return (
    <>
      <div
        className="bubble"
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
        >
          <g className="outer">
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={(width / 2) - (bubbleMaxRadius)}
              ry={(height / 2) - (bubbleMaxRadius)}
            />
            {bubbles && (
              <>
                {bubbles.map(bubble => (
                  <circle {...bubble} r={bubble.r + strokeWidth} />
                ))}
              </>
            )}
          </g>
          <g className="inner">
            <ellipse
              ref={rootRef}
              cx={width / 2}
              cy={height / 2}
              rx={(width / 2) - (bubbleMaxRadius + strokeWidth)}
              ry={(height / 2) - (bubbleMaxRadius + strokeWidth)}
            />
            {bubbles && (
              <>
                {bubbles.map(bubble => (
                  <circle {...bubble} />
                ))}
              </>
            )}
          </g>
        </svg>
      </div>
    </>
  )
}

export default Bubble