import { useEffect, useRef, useState } from 'react'
import './BubbleGenerator.css'

const CHILD_RADIUS_MIN = 40
const CHILD_RADIUS_MAX = 65
const CHILD_AMOUNT = 10

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

  useEffect(() => {
    const newChildCircles = getChildCircles(rootRef.current)
    setChildCircles(newChildCircles)
  }, [setChildCircles])

  const handleGenerateClick = e => {
    e.preventDefault()
    const newChildCircles = getChildCircles(rootRef.current)
    setChildCircles(newChildCircles)
  }

  return (
    <>
      <h1>{'Svg Bubble Generator'}</h1>
      <svg className="svgBubble" viewBox="0 0 500 500" width="500px" height="500px">
        {/* <rect className="root" x={100} y={100} width={300} height={300} rx={20} ref={rootRef} /> */}
        <ellipse className="root" cx={250} cy={250} rx={180} ry={80} ref={rootRef}  />
        {/* <circle className="root" cx={250} cy={250} r={180} ref={rootRef}  /> */}
        {childCircles && (
          <>
            {childCircles.map(childCircle => {
              return (
                <circle className="child" {...childCircle} />
              )
            })}
          </>
        )}
      </svg>
      <button onClick={handleGenerateClick}>Generate!</button>
    </>
  )
}

export default BubbleGenerator