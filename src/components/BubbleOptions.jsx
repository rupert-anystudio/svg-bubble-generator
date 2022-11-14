const BubbleOptions = ({ children }) => {
  const options = {
    viewport: {
      width: 900,
      height: 600,
    },
    bubble: {
      amount: 1,
      radiusMax: 80,
      radiusMin: 70,
    },
    strokeWidth: 3,
  }
  return <>
    <div className='controls'>
      <fieldset>
        <section>
          <label htmlFor="bubbleRadiusMax">Bubble Max Radius</label>
          <input id="bubbleRadiusMax" type="range" min="1" max="200" />
          <strong>{options?.bubble?.radiusMax}</strong>
        </section>
        <section>
          <label htmlFor="bubbleRadiusMin">Bubble Min Radius</label>
          <input id="bubbleRadiusMin" type="range" min="1" max="200" />
          <strong>{options?.bubble?.radiusMin}</strong>
        </section>
      </fieldset>
      <fieldset>
        <section>
          <label htmlFor="viewportWidth">Viewport Width</label>
          <input id="viewportWidth" type="range" min="1" max="2000" />
          <strong>{options?.viewport?.width}</strong>
        </section>
        <section>
          <label htmlFor="viewportHeight">Viewport Height</label>
          <input id="viewportHeight" type="range" min="1" max="2000" />
          <strong>{options?.viewport?.height}</strong>
        </section>
      </fieldset>
      <fieldset>
        <section>
          <label htmlFor="strokeWidth">Stroke Width</label>
          <input id="strokeWidth" type="range" min="1" max="2000" />
          <strong>{options?.strokeWidth}</strong>
        </section>
      </fieldset>
    </div>
    <div className="stage">
      {children(options)}
    </div>
  </>
}

export default BubbleOptions