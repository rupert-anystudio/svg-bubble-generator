import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLayoutEffect } from 'react'

function returnCappedLength(length, totalLength) {
  if (length > totalLength) return length % totalLength
  if (length < 0) return totalLength + (length % totalLength)
  return length
}

function returnPointBetweenPoints(start, end) {
  const x = (start.x + end.x) / 2
  const y = (start.y + end.y) / 2
  return { x, y }
}

function returnEllipseAroundBox({width, height, offset }) {
  const rx = width / Math.SQRT2 + offset
  const ry = height / Math.SQRT2 + offset
  return {
    rx,
    ry,
  }
}

function returnSvgAroundEllipse(ellipse, padding) {
  const width = ellipse.rx * 2 + padding * 2
  const height = ellipse.ry * 2 + padding * 2
  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
  }
}

function returnCenterOfSvg(svg) {
  return {
    x: svg.width / 2,
    y: svg.height / 2,
  }
}

function getAngle({ x, y }) {
  var angle = Math.atan2(y, x);
  var degrees = 180 * angle / Math.PI;
  return (360 + Math.round(degrees)) % 360;
}

function useStage({ width, height, padding, offset }) {

  const returnStage = useCallback(() => {
    const ellipse = returnEllipseAroundBox({ width, height, offset })
    const svg = returnSvgAroundEllipse(ellipse, padding)
    const center = returnCenterOfSvg(svg)
    return {
      ellipse,
      svg,
      center,
    }
  }, [width, height, padding, offset])

  const [stage, setStage] = useState(returnStage())

  useEffect(() => {
    setStage(returnStage())
  }, [returnStage])

  return stage
}

const ArcBubble = ({
  width = 600,
  height = 400,
  children,
  minSegmentsLength,
  maxVariation,
  showHelpers,
  randomShift,
  offset,
  padding,
  seed,
  fontSize,
}) => {
  const ellipseRef = useRef(null)
  const [layout, setLayout] = useState(null)
  const stage = useStage({ width, height, padding, offset })

  const returnTotalLength = useCallback(() => {
    if (!ellipseRef.current) return undefined
    return ellipseRef.current.getTotalLength()
  }, [])

  const returnPointAtLength = useCallback(length => {
    const totalLength = returnTotalLength()
    if (!totalLength) return null
    const cappedLength = returnCappedLength(length, totalLength)
    return ellipseRef.current.getPointAtLength(cappedLength)
  }, [returnTotalLength])

  const returnVector = useCallback((start, end) => ({ x: end.x - start.x, y: end.y - start.y }), [])

  const returnDistance = useCallback((start, end) => Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)), [])

  const returnSegments = useCallback(totalLength => {
    if (!totalLength) return []
    const segmentAmount = Math.ceil(totalLength / minSegmentsLength)
    // const segmentAmount = 20
    const segmentLength = totalLength / segmentAmount
    return Array.from({ length: segmentAmount }, (v, i) => segmentLength)
  }, [minSegmentsLength])

  const deviations = useRef({})
  const returnDeviation = useCallback((index) => {
    let deviation = deviations.current[index]
    if (!deviation) {
      deviation = Math.random()
      deviations.current[index] = deviation
    }
    return deviation
  }, [])

  const shifts = useRef({})
  const returnShift = useCallback((index) => {
    let shift = shifts.current[index]
    if (!shift) {
      const x = Math.random() * 2 + -1
      const y = Math.random() * 2 + -1
      shift = { x, y }
      shifts.current[index] = shift
    }
    return shift
  }, [])

  const returnEndPoints = useCallback(segments => segments.map((segmentLength, index) => {
    const baseLength = segmentLength * (index + 1)
    const deviation = returnDeviation(index)
    const pointLength = baseLength + (maxVariation * deviation)
    const point = returnPointAtLength(pointLength)
    const shift = returnShift(index)
    return {
      x: point.x + shift.x * randomShift,
      y: point.y + shift.y * randomShift,
    }
  }), [returnPointAtLength, returnDeviation, returnShift, maxVariation, randomShift])

  const returnShapeSegments = useCallback((points, center) => {
    if (!center) return []
    return points.map((currentPoint, index) => {
      const prevPoint = index === 0 ? points[points.length - 1] : points[index - 1]
      const midPoint = returnPointBetweenPoints(prevPoint, currentPoint)
      const normal = returnVector(center, midPoint)
      return {
        start: prevPoint,
        mid: midPoint,
        end: currentPoint,
        normal,
        distance: returnDistance(prevPoint, currentPoint),
      }
    })
  }, [returnDistance])

  const returnBubbleShape = useCallback((shapeSegments) => {
    if (!shapeSegments || !shapeSegments.length) return null
    return shapeSegments
      .map((p, i) => {
        const rotation = getAngle(p.normal)
        let segment = '0,1'
        // segment = i % 2 !== 0 ? '0,1' : '0,0'
        const dampening = 1.1
        const radius = (p.distance / 2) * dampening
        const ra = radius * 1
        const rb = radius * 1
        const end = `${p.end.x},${p.end.y}`
        const arc = `A ${ra},${rb} ${rotation} ${segment} ${end}`
        if (i === 0) return `M ${p.start.x},${p.start.y} ${arc}`
        if (i === shapeSegments.length - 1) return `${arc} Z`
        return arc
      })
      .filter(Boolean)
      .join(' ')
  }, [])

  const renderLayout = useCallback(() => {
    const totalLength = returnTotalLength()
    const segments = returnSegments(totalLength)
    const endPoints = returnEndPoints(segments)
    const shapeSegments = returnShapeSegments(endPoints, stage.center)
    const d = returnBubbleShape(shapeSegments)
    setLayout(prevLayout => ({
      ...prevLayout,
      endPoints,
      shapeSegments,
      d,
    }))
  }, [
    returnTotalLength,
    returnSegments,
    returnEndPoints,
    returnShapeSegments,
    returnBubbleShape,
    randomShift,
    stage,
  ])

  useLayoutEffect(() => {
    deviations.current = {}
    shifts.current = {}
  }, [seed])

  useEffect(() => {
    renderLayout()
  }, [stage, seed, renderLayout])
  console.log(layout)

  return (
    <div
      className="bubble"
      style={{
        width,
        height,
        fontSize: Math.sqrt(width * height, 2) * fontSize * 0.01,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        {...stage.svg}
      >
        <defs>
          <ellipse
            ref={ellipseRef}
            cx={stage.center.x}
            cy={stage.center.y}
            {...stage.ellipse}
          />
        </defs>
        {layout && (
          <>
            <path className="shape" d={layout.d} />
            {showHelpers && (
              <g className="helpers">
                <ellipse
                  className="line"
                  cx={stage.center.x}
                  cy={stage.center.y}
                  {...stage.ellipse}
                />
                {layout.shapeSegments.map((s, i) => (
                  <React.Fragment key={i}>
                    {/* <line className="line" x1={s.start.x} y1={s.start.y} x2={s.end.x} y2={s.end.y} /> */}
                    <circle className="radius" cx={s.mid.x} cy={s.mid.y} r={s.distance / 2} />
                    <circle className="vertex" cx={s.end.x} cy={s.end.y} r={6} />
                    <circle className="dot" cx={s.mid.x} cy={s.mid.y} r={3} />
                  </React.Fragment>
                ))}
                <rect
                  className="area"
                  width={stage.svg.width}
                  height={stage.svg.height}
                  x={0}
                  y={0}
                />
                <rect
                  className="area"
                  width={width}
                  height={height}
                  x={(stage.svg.width - width) / 2}
                  y={(stage.svg.height - height) / 2}
                />
                <line
                  className="line"
                  x1={stage.center.x}
                  x2={stage.center.x}
                  y1={stage.center.y - 15}
                  y2={stage.center.y + 15}
                />
                <line
                  className="line"
                  x1={stage.center.x - 15}
                  x2={stage.center.x + 15}
                  y1={stage.center.y}
                  y2={stage.center.y}
                />
                <path className="outline" d={layout.d} />
              </g>
            )}
          </>
        )}
      </svg>
      <div className='children'>
        {children}
      </div>
    </div>
  )
}

export default ArcBubble