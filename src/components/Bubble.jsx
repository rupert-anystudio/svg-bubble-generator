import { useCallback, useEffect, useRef, useState } from 'react'
import useThrottle from './useThrottle'

const Bubble = ({
  width,
  height,
  bubbleMaxRadius = 65,
  bubbleMinRadius = 40,
  strokeWidth = 10,
  bubbleDensity = 1.2,
}) => {
  const rootRef = useRef()

  const returnSvg = useCallback(() => ({
    width,
    height,
    viewBox: `0 0 ${width} ${height}`,
  }), [
    width,
    height,
  ])

  const returnRoot = useCallback(() => {
    if (!rootRef.current) return null
    return {
      cx: width / 2,
      cy: height / 2,
      rx: (width / 2) - (bubbleMaxRadius + strokeWidth),
      ry: (height / 2) - (bubbleMaxRadius + strokeWidth),
    }
  }, [
    width,
    height,
    bubbleMaxRadius,
    strokeWidth,
  ])

  const returnBubbles = useCallback(() => {
    if (!rootRef.current) return []
    const circumference = rootRef.current.getTotalLength()
    const averageBubbleDiameter = ((bubbleMaxRadius + bubbleMinRadius) / 2) * 2
    const averageBubbleAmount = Math.ceil(circumference / (averageBubbleDiameter / bubbleDensity))
    const segmentLength = circumference / averageBubbleAmount
    const distributionOffset = Math.random() * segmentLength
    return Array
      .from({length: averageBubbleAmount}, (v, i) => i)
      .map(step => {
        const position = rootRef.current.getPointAtLength(segmentLength * step + distributionOffset)
        const radius = Math.random() * (bubbleMaxRadius - bubbleMinRadius) + bubbleMinRadius
        return { key: step, cx: position.x, cy: position.y, r: radius }
      })
  }, [
    bubbleMaxRadius,
    bubbleMinRadius,
    bubbleDensity,
  ])

  const returnLayout = useCallback(() => ({
    bubbles: returnBubbles(),
    root: returnRoot(),
    svg: returnSvg(),
  }), [
    returnBubbles,
    returnRoot,
    returnSvg,
  ])

  const [layoutUnoptimized, setLayout] = useState(returnLayout())
  const layout = useThrottle(layoutUnoptimized, 80)

  useEffect(() => {
    setLayout(returnLayout())
    // const timeout = setTimeout(updateLayout, 0)
    // return () => clearInterval(timeout)
  }, [returnLayout])

  return (
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
        {...layout.svg}
      >
        <ellipse
          ref={rootRef}
          cx={width / 2}
          cy={height / 2}
          rx={(width / 2) - (bubbleMaxRadius + strokeWidth)}
          ry={(height / 2) - (bubbleMaxRadius + strokeWidth)}
          style={{ fill: 'none', stroke: 'none' }}
        />
        <g className="outer">
          {layout?.root && (
            <ellipse
              {...layout.root}
              rx={layout.root.rx + strokeWidth}
              ry={layout.root.ry + strokeWidth}
            />
          )}
          {(layout?.bubbles || []).map(bubble => (
            <circle {...bubble} r={bubble.r + strokeWidth} />
          ))}
        </g>
        <g className="inner">
          {layout?.root && (
            <ellipse
              {...layout.root}
            />
          )}
          {(layout?.bubbles || []).map(bubble => (
            <circle {...bubble} />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default Bubble