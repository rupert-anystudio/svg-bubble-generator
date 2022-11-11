import { useCallback, useEffect, useRef, useState } from 'react'
import './BubbleGenerator.css'

const CHILD_RADIUS_MIN = 40
const CHILD_RADIUS_MAX = 65
const CHILD_AMOUNT = 10
const STROKE_WIDTH = 5

function getChildCircles(circleEl) {
  const circleLength = circleEl.getTotalLength()
  const lengthSegment = circleLength / CHILD_AMOUNT
  return Array
    .from({length: CHILD_AMOUNT}, (v, i) => i)
    .map(step => {
      const position = circleEl.getPointAtLength(lengthSegment * step)
      const radius = (Math.random() * (CHILD_RADIUS_MAX - CHILD_RADIUS_MIN)) + CHILD_RADIUS_MIN
      return { key: step, cx: position.x, cy: position.y, r: radius }
    })
}

const BubbleGenerator = () => {
  const rootRef = useRef(null)
  const [childCircles, setChildCircles] = useState(null)

  const generateBubble = useCallback(() => {
    const newChildCircles = getChildCircles(rootRef.current)
    setChildCircles(newChildCircles)
  }, [setChildCircles])

  useEffect(() => {
    generateBubble()
  }, [generateBubble])

  const handleGenerateClick = e => {
    e.preventDefault()
    generateBubble()
  }

  return (
    <>
      <svg
        viewBox="0 0 500 500"
        width="500px"
        height="500px"
        onClick={handleGenerateClick}
      >
        <g fill="blue">
          <ellipse
            cx={250}
            cy={250}
            rx={180}
            ry={80}
            ref={rootRef}
          />
          {childCircles && (
            <>
              {childCircles.map(({ r, ...childCircle }) => (
                <circle {...childCircle} r={r + STROKE_WIDTH} />
              ))}
            </>
          )}
        </g>
        <g fill="white">
          <ellipse
            cx={250}
            cy={250}
            rx={180}
            ry={80}
            ref={rootRef}
          />
          {childCircles && (
            <>
              {childCircles.map(childCircle => (
                <circle {...childCircle} />
              ))}
            </>
          )}
        </g>
      </svg>
    </>
  )

  return (
    <>
      <svg
        viewBox="0 0 500 500"
        width="500px"
        height="500px"
        onClick={handleGenerateClick}
      >
        <defs>
          <clipPath id="bubbleshape">
            <ellipse
              cx={250}
              cy={250}
              rx={180}
              ry={80}
              ref={rootRef}
            />
            {childCircles && (
              <>
                {childCircles.map(childCircle => (
                  <circle {...childCircle} />
                ))}
              </>
            )}
          </clipPath>
                
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation=""/>
            <feOffset dx="3" dy="3"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <rect
            className="bubble"
            width="100%"
            height="100%"
            clipPath="url(#bubbleshape)"
          />
        </g>
      </svg>
    </>
  )
}

export default BubbleGenerator