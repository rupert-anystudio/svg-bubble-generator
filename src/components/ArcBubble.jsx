import { useCallback, useEffect, useRef, useState, useMemo } from 'react'

function clamp(num, min, max) {
  return num <= min
    ? min
    : num >= max
      ? max
      : num
}

const colors = [
  'red',
  'teal',
  'orange',
  'steel',
  'salmon',
  'blue',
  'yellow',
  'lightgreen',
  'peach',
  'sky'
]

function returnPathFromPoints(points, options = {}) {
  if (!points || !points.length) return ''
  const dampener = clamp(options?.dampener ?? 0, 0, 1000)
  const isConcave = !!options.isConcave
  const rotation = 0
  const segment = isConcave ? '0,0' : '0,1'
  return points
    .map((p, i) => {
      const radius = p.distance / 2 + dampener
      const start = `${p.start.x},${p.start.y}`
      const end = `${p.end.x},${p.end.y}`
      const arc = `A ${radius},${radius} ${rotation} ${segment} ${end}`
      if (i === 0) return `M ${start} ${arc}`
      if (i === points.length - 1) return `${arc} Z`
      return arc
    })
    .filter(Boolean)
    .join(' ')
}

const returnRootProps = ({ minSegmentsLength, maxVariation, width, height, isConcave, dampener }) => {
  let props = {
    cx: width / 2,
    cy: height / 2,
    rx: width / 2,
    ry: height / 2,
    style: { fill: 'none', stroke: 'none'},
  }
  if (!isConcave) {
    const maxRadius = (minSegmentsLength + maxVariation) / 2
    props = {
      ...props,
      cx: (width + minSegmentsLength + maxVariation) / 2,
      cy: (height + minSegmentsLength + maxVariation) / 2,
      rx: ((width + minSegmentsLength + maxVariation) / 2) - maxRadius,
      ry: ((height + minSegmentsLength + maxVariation) / 2) - maxRadius,
    }
  }
  return props
}

const ArcBubble = ({
  width = 600,
  height = 400,
  strokeWidth = 10,
  minSegmentsLength = 70,
  maxVariation = 90,
  showHelpers = false,
  isConcave = false,
  dampener = 20,
  style,
}) => {
  const svgRef = useRef()
  const rootRef = useRef()
  const pathRef = useRef()
  const randomNumbers = useRef({})

  const getCappedLength = useCallback((length, circumference) => {
    if (length > circumference) return length % circumference
    if (length < 0) return circumference + (length % circumference)
    return length
  }, [])

  const returnPoints = useCallback(() => {
    if (!rootRef.current) return []
    const fullLength = rootRef.current.getTotalLength()

    const amount = Math.ceil(fullLength / minSegmentsLength)
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
          at: index / (amount - 1),
        }
      })

    const minLength = fullLength / amount

    let usedLength = 0
    const segments = parts.reduce((acc, curr) => {
      const alreadyUsedLength = usedLength
      const availableLength = fullLength - alreadyUsedLength
      if (availableLength <= 0) return acc
      const { index, deviation } = curr
      let segmentLength = minLength + (deviation * maxVariation)
      // if (availableLength <= (minLength + maxVariation)) {
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

    const squish = fullLength / usedLength
    // const offset = ((segments[segments.length - 1]?.segmentLength ?? 0) * -0.5) + fullLength * 0.75
    const offset = fullLength * 0.5 - segments[segments.length - 1].segmentLength * 0.5

    return segments.map((segment) => {
      const { pointLength, segmentLength } = segment
      const endLength = (pointLength) * squish + offset
      const startLength = (pointLength - segmentLength) * squish + offset
      const end = rootRef.current.getPointAtLength(getCappedLength(endLength, fullLength))
      const start = rootRef.current.getPointAtLength(getCappedLength(startLength, fullLength))
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
    width,
    height,
    minSegmentsLength,
    maxVariation,
    isConcave,
  ])

  const [points, setPoints] = useState(returnPoints())

  useEffect(() => {
    setPoints(returnPoints())
  }, [returnPoints])

  const [pathProps, setPathProps] = useState({})

  useEffect(() => {
    setPathProps({
      d: returnPathFromPoints(points, { dampener, isConcave }),
    })
  }, [points, dampener, isConcave, style])

  const [viewBox, setViewBox] = useState(`0 0 ${width} ${height}`)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!pathRef.current) return
      if (!svgRef.current) return
      const svgRect = svgRef.current.getBoundingClientRect()
      const pathRect = pathRef.current.getBoundingClientRect()
      const box = {
        x: pathRect.x - svgRect.x,
        y: pathRect.y - svgRect.y,
        width: pathRect.width,
        height: pathRect.height,
      }
      const newViewBox = `${box.x} ${box.y} ${box.width} ${box.height}`
      setViewBox(newViewBox)
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [pathProps])

  const rootProps = returnRootProps({ minSegmentsLength, maxVariation, width, height, isConcave, dampener })

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
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 0 ${width + minSegmentsLength + maxVariation} ${height + minSegmentsLength + maxVariation}`}
        width={width + minSegmentsLength + maxVariation}
        height={height + minSegmentsLength + maxVariation}
        style={{
          marginLeft: (minSegmentsLength + maxVariation) * -0.5,
          marginTop: (minSegmentsLength + maxVariation) * -0.5,
          pointerEvents: 'none'
        }}
      >
        <ellipse
          ref={rootRef}
          {...rootProps}
        />
        <g>
          <path ref={pathRef} {...pathProps} className="bubblePath" />
        </g>
        {showHelpers && (
          <g className="dev">
            <path d={pathProps.d} />
            {points.map(p => {
              const isEven = p.index % 2 === 0
              const color = colors[p.index % (colors.length - 1)]
              const props = isEven
                ? { r: 20, style: { fill: 'none', stroke: color, strokeWidth: 3 }}
                : { r: 10, style: { fill: color, stroke: 'none' }}
              return (
                <g key={p.key}>
                  <circle cx={p.start.x} cy={p.start.y} {...props} />
                  <circle cx={p.end.x} cy={p.end.y} {...props} />
                </g>
              )
            })}
            <ellipse
              {...rootProps}
            />
          </g>
        )}
      </svg>
    </div>
  )
}

export default ArcBubble