import { useCallback, useEffect, useRef, useState } from 'react'
import useThrottle from './useThrottle'

const Bubble = ({
  width,
  height,
  bubbleMaxRadius = 75,
  bubbleMinRadius = 40,
  strokeWidth = 10,
  bubbleDensity = 1.3,
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

  const getCircumferenceLength = useCallback(({ circumference, at }) => {
    if (at > circumference) return at % circumference
    if (at < 0) return circumference + (at % circumference)
    return at
  }, [])

  const getPointInBetween = useCallback((a, b) => {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    }
  }, [])

  const returnArrow = useCallback(() => {
    if (!rootRef.current) return null
    const circumference = rootRef.current.getTotalLength()
    const connectsAt = circumference * 0.6
    const arrowWidth = 150
    const handleOffset = 30
    const c = { x: strokeWidth, y: strokeWidth }
    const a = rootRef.current.getPointAtLength(getCircumferenceLength({ circumference, at: connectsAt + arrowWidth }))
    const a1 = rootRef.current.getPointAtLength(getCircumferenceLength({ circumference, at: connectsAt + arrowWidth - handleOffset }))
    const b = rootRef.current.getPointAtLength(getCircumferenceLength({ circumference, at: connectsAt - arrowWidth }))
    const b1 = rootRef.current.getPointAtLength(getCircumferenceLength({ circumference, at: connectsAt - arrowWidth + handleOffset }))
    const ca = getPointInBetween(c, a1)
    const cb = getPointInBetween(c, b1)
    return {
      d: `
        M ${a.x},${a.y}
        C ${a1.x},${a1.y}
          ${ca.x},${ca.y}
          ${c.x},${c.y}
        C ${cb.x},${cb.y}
          ${b1.x},${b1.y}
          ${b.x},${b.y}
        Z
      `
    }
  }, [
    width,
    height,
    strokeWidth
  ])

  const returnLayout = useCallback(() => ({
    strokeWidth,
    bubbles: returnBubbles(),
    root: returnRoot(),
    svg: returnSvg(),
    arrow: returnArrow(),
  }), [
    returnBubbles,
    returnRoot,
    returnSvg,
    returnArrow,
    strokeWidth,
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
        {/* <defs>
          <mask id="mask-inner">
            {layout?.root && (
              <ellipse
                {...layout.root}
                style={{ fill: 'white' }}
              />
            )}
            {(layout?.bubbles || []).map(bubble => (
              <circle {...bubble} style={{ fill: 'white' }} />
            ))}
          </mask>
          <clipPath id="clippath" clipPathUnits="objectBoundingBox">
            <polygon points="400,50 400,320, 140,300" />
          </clipPath>
        </defs> */}
        <ellipse
          ref={rootRef}
          cx={width / 2}
          cy={height / 2}
          rx={(width / 2) - (bubbleMaxRadius + strokeWidth)}
          ry={(height / 2) - (bubbleMaxRadius + strokeWidth)}
          style={{ fill: 'none', stroke: 'none' }}
        />
        {layout.strokeWidth > 0 && (
          <g className="outer">
            {layout?.root && (
              <ellipse
                {...layout.root}
                rx={layout.root.rx + layout.strokeWidth}
                ry={layout.root.ry + layout.strokeWidth}
              />
            )}
            {(layout?.bubbles || []).map(bubble => (
              <circle {...bubble} r={bubble.r + layout.strokeWidth} />
            ))}
            {layout?.arrow && (
              <path
                {...layout.arrow}
                strokeWidth={strokeWidth * 2}
                strokeLinejoin='round'
              />
            )}
          </g>
        )}
        <g className="inner">
          {layout?.root && (
            <ellipse
              {...layout.root}
            />
          )}
          {(layout?.bubbles || []).map(bubble => (
            <circle {...bubble} />
          ))}
          {layout?.arrow && (
            <path
              {...layout.arrow}
            />
          )}
        </g>
        {/* <polygon points="400,50 400,320, 140,300" /> */}
        {/* <g mask="url(#mask-inner)">
          <text x="50%" y="50%" fill="#000" text-anchor="middle">
            {'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'}
          </text>
        </g> */}
        <g className="dev">
          {layout?.root && (
            <>
              <ellipse
                {...layout.root}
              />
              <ellipse
                {...layout.root}
                rx={layout.root.rx + bubbleMaxRadius}
                ry={layout.root.ry + bubbleMaxRadius}
              />
              <ellipse
                {...layout.root}
                rx={layout.root.rx + bubbleMinRadius}
                ry={layout.root.ry + bubbleMinRadius}
              />
            </>
          )}
          {layout?.arrow && (
            <path
              {...layout.arrow}
            />
          )}
        </g>
      </svg>
      {/* <div className='clippedContent'>
        <div>
          <p>{'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.'}</p>
        </div>
      </div> */}
      {/* <div
        className="content"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          background: 'rgba(255,0,0,0.1)'
        }}>
          <div style={{
            width: '50%',
            height: '100%',
            float: 'left',
            shapeMargin: bubbleMaxRadius,
            shapeOutside: `url('shape-outside-circle-left.png')`,
          }} />
          <div style={{
            width: '50%',
            height: '100%',
            float: 'right',
            shapeMargin: bubbleMaxRadius,
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
        </div> */}
    </div>
  )
}

export default Bubble