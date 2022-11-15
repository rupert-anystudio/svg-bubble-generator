import { useCallback, useEffect, useRef, useState } from 'react'
import { Rnd } from "react-rnd"

const style = {
  display: "block",
}

const Bubble = ({ options }) => {
  const rootRef = useRef(null)
  const [bubbles, setBubbles] = useState(null)
  const [dimensions, setDimensions] = useState({
    width: 600,
    height: 400,
    x: 10,
    y: 10
  })

  const getViewportWidth = () => dimensions?.width ?? 400
  const getViewportHeight = () => dimensions?.height ?? 400
  const getBubbleRadiusMax = () => options?.bubble?.radiusMax ?? 80
  const getBubbleRadiusMin = () => options?.bubble?.radiusMin ?? 50
  const getBubbleAmount = () => options?.bubble?.amount ?? 1.2
  const getBubbleStrokeWidth = () => options?.strokeWidth ?? 5

  const rootElemProps = {
    cx: dimensions.width / 2,
    cy: dimensions.height / 2,
    rx: (dimensions.width / 2) - (getBubbleRadiusMax() + getBubbleStrokeWidth()),
    ry: (dimensions.height / 2) - (getBubbleRadiusMax() + getBubbleStrokeWidth()),
  }

  function returnRandomCircleRadius() {
    return (Math.random() * (getBubbleRadiusMax() - getBubbleRadiusMin())) + getBubbleRadiusMin()
  }

  function returnBubblesForElemnet() {
    const rootElement = rootRef.current
    if (!rootElement) return []
    const circumference = rootElement.getTotalLength()
    const averageBubbleDiameter = ((getBubbleRadiusMax() + getBubbleRadiusMin()) / 2) * 2
    const averageBubbleAmount = Math.ceil(circumference / (averageBubbleDiameter / getBubbleAmount()))
    const segmentLength = circumference / averageBubbleAmount
    const distributionOffset = Math.random() * segmentLength
    const bubbles = Array
      .from({length: averageBubbleAmount}, (v, i) => i)
      .map(step => {
        const position = rootElement.getPointAtLength(segmentLength * step + distributionOffset)
        const radius = returnRandomCircleRadius()
        return { key: step, cx: position.x, cy: position.y, r: radius }
      })
    return bubbles
  }

  const generateBubble = useCallback(() => {
    const newBubbles = returnBubblesForElemnet()
    setBubbles(newBubbles)
  }, [setBubbles])

  useEffect(() => {
    generateBubble()
  }, [generateBubble, options, dimensions])

  const handleGenerateClick = e => {
    e.preventDefault()
    generateBubble()
  }

  return (
    <>
      {/* <Rnd
        style={style}
        size={{ width: dimensions.width, height: dimensions.height }}
        position={{ x: dimensions.x, y: dimensions.y }}
        onDragStop={(e, d) => {
          setDimensions(prev => ({ ...prev, x: d.x, y: d.y }));
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setDimensions(prev => ({
            ...prev,
            width: ref.style.width,
            height: ref.style.height,
          }));
        }}
      > */}
      <div
        className="bubble"
        size={{ width: dimensions.width, height: dimensions.height }}
        onClick={handleGenerateClick}
      >
        <svg
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          width={dimensions.width}
          height={dimensions.height}
        >
          <g className="outer">
            <ellipse
              {...rootElemProps}
              rx={rootElemProps.rx + getBubbleStrokeWidth()}
              ry={rootElemProps.ry + getBubbleStrokeWidth()}
            />
            {bubbles && (
              <>
                {bubbles.map(bubble => (
                  <circle {...bubble} r={bubble.r + getBubbleStrokeWidth()} />
                ))}
              </>
            )}
          </g>
          <g className="inner">
            <ellipse
              {...rootElemProps}
              ref={rootRef}
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
        <div className="content" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '50%',
            height: '100%',
            float: 'left',
            shapeMargin: getBubbleRadiusMax(),
            shapeOutside: `url('shape-outside-circle-left.png')`,
          }} />
          <div style={{
            width: '50%',
            height: '100%',
            float: 'right',
            shapeMargin: getBubbleRadiusMax(),
            shapeOutside: `url('shape-outside-circle-right.png')`,
          }} />
          <p style={{
            margin: 0,
            height: '100%',
            textAlign: 'center',
            fontSize: '30px',
          }}>
            <span>
              {'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'}
            </span>
            <span>
              {'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur'}
            </span>
          </p>
        </div>
      </div>
      {/* </Rnd> */}
    </>
  )
}

export default Bubble