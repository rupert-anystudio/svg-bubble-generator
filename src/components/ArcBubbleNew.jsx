import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const SVG_PADDING = 100
const ELLIPSE_OFFSET = -50
const MIN_SEGMENT_LENGTH = 70
const BUBBLE_VARIATION = 0

function returnCappedLength(length, circumference) {
  if (length > circumference) return length % circumference
  if (length < 0) return circumference + (length % circumference)
  return length
}

function returnEllipse(dimensions) {
  const rx = dimensions.width / Math.SQRT2 + (ELLIPSE_OFFSET / 2)
  const ry = dimensions.height / Math.SQRT2 + (ELLIPSE_OFFSET / 2)
  return {
    rx,
    ry,
    style: {
      fill: 'none',
      stroke: 'orange',
      strokeWidth: 1,
    }
  }
}

function returnSvg(dimensions, ellipse) {
  const width = ellipse.rx * 2 + SVG_PADDING * 2
  const height = ellipse.ry * 2 + SVG_PADDING * 2
  return {
    viewBox: `0 0 ${width} ${height}`,
    width,
    height,
    style: {
      width,
      height,
      marginTop: (height - dimensions.height) * -0.5,
      marginRight: (width - dimensions.width) * -0.5,
      marginBottom: (height - dimensions.height) * -0.5,
      marginLeft: (width - dimensions.width) * -0.5,
      pointerEvents: 'none',
      outline: '1px solid blue',
    }
  }
}

function returnCenter(svg) {
  return {
    x: svg.width / 2,
    y: svg.height / 2,
  }
}

const ArcBubble = ({
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef(null)
  const ellipseRef = useRef(null)

  const [layout, setLayout] = useState({})
  useEffect(() => {
    const dimensions = { width, height }
    const ellipse = returnEllipse(dimensions)
    const svg = returnSvg(dimensions, ellipse)
    const center = returnCenter(svg)
    setLayout({ svg, ellipse, center })
  }, [width, height])

  useEffect(() => {
    console.log({ layout })
  }, [layout])

  const randomNumbers = useRef({})

  const returnPoints = useCallback(() => {
    if (!ellipseRef.current) return []

    const ellipseLength = ellipseRef.current.getTotalLength()
    const amount = Math.ceil(ellipseLength / MIN_SEGMENT_LENGTH)
    const minLength = ellipseLength / amount

    const parts = Array
      .from({ length: amount }, (value, index) => {
        let deviation = randomNumbers.current[index]
        if (!deviation) {
          deviation = Math.random()
          randomNumbers.current[index] = deviation
        }
        return {
          index,
          deviation,
        }
      })

    let usedLength = 0

    const segments = parts.reduce((acc, curr) => {
      const alreadyUsedLength = usedLength
      const availableLength = ellipseLength - alreadyUsedLength
      if (availableLength <= 0) return acc
      const { index, deviation } = curr
      let segmentLength = minLength + (deviation * BUBBLE_VARIATION)
      // if (availableLength <= (minLength + BUBBLE_VARIATION)) {
      //   segmentLength = availableLength
      // }
      const pointLength = alreadyUsedLength + segmentLength
      usedLength = pointLength
      acc.push({
        index,
        key: index,
        segmentLength,
        pointLength,
      })
      return acc
    }, [])

    const squish = ellipseLength / usedLength
    const offset = ellipseLength * 0.5 - segments[segments.length - 1].segmentLength * 0.5

    return segments.map((segment) => {
      const { pointLength, segmentLength } = segment
      const endLength = (pointLength) * squish + offset
      const startLength = (pointLength - segmentLength) * squish + offset
      const end = ellipseRef.current.getPointAtLength(returnCappedLength(endLength, ellipseLength))
      const start = ellipseRef.current.getPointAtLength(returnCappedLength(startLength, ellipseLength))
      const v = {
        x: end.x - start.x,
        y: end.y - start.y
      }
      return {
        ...segment,
        end,
        start,
        vector: v,
        distance: Math.sqrt(v.x*v.x+v.y*v.y),
      }
    })
  }, [
    layout,
  ])

  const [points, setPoints] = useState(returnPoints())

  useLayoutEffect(() => {
    setPoints(returnPoints())
  }, [returnPoints])

  console.log({ points })

  return (
    <div
      className="bubble"
      style={{
        position: 'relative',
        width,
        height,
        outline: '1px solid red',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {layout.svg && (
        <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          {...layout.svg}
        >
          <ellipse
            ref={ellipseRef}
            cx={layout.center.x}
            cy={layout.center.y}
            {...layout.ellipse}
          />
          {points.map(p => (
            <circle key={p.index} cx={p.end.x} cy={p.end.y} r={4} style={{ fill: 'orange' }} />
          ))}
        </svg>
      )}
    </div>
  )
}

export default ArcBubble