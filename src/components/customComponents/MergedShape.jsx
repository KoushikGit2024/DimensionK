const MergedShape = ({ fill = "#ffffff", children, style: containerStyle, ...props }) => (
  <div
    style={{
      position: 'relative',
      width: 1920,
      height: 1080,
      ...containerStyle,
    }}
    {...props}
  >
      {/* Container dimensions: 420px × 300px 
      .clipped-element {
        clip-path: path('M 42 10 L 178 10 A 32 32 0 0 1 210 42 L 210 258 A 32 32 0 0 1 178 290 L 42 290 A 32 32 0 0 1 10 258 L 10 42 A 32 32 0 0 1 42 10 Z M 210 80 L 378 80 A 32 32 0 0 1 410 112 L 410 188 A 32 32 0 0 1 378 220 L 210 220 L 210 220 L 210 80 L 210 80 Z M 210 48 C 210 71.872 215.76 80 242 80 H 210 Z M 210 252 C 210 228.128 215.76 220 242 220 H 210 Z');
        width: 420px;
        height: 300px;
      } */}
      {/* Shape 1 */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 0,
          width: 960,
          height: 1080,
          backgroundColor: fill,
          borderRadius: '32px 32px 32px 0px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Shape 2 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 480,
          width: 960,
          height: 600,
          backgroundColor: fill,
          borderRadius: '32px 0px 0px 32px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Shape 3 */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 30,
          width: 400,
          height: 400,
          backgroundColor: fill,
          borderRadius: '32px 32px 32px 32px',
        }}
      >
        {/* Add content here */}
      </div>
      {/* Negative Space 1 - Content container for empty region */}
      <div
        style={{
          position: 'absolute',
          left: 420,
          top: 430,
          width: 540,
          height: 50,
          // Transparent container for content in negative space
        }}
      >
        {/* Add content here */}
      </div>
      {/* Bridge 1 */}
      <svg
        style={{
          position: 'absolute',
          left: 928,
          top: 448,
          width: 32,
          height: 32,
          pointerEvents: 'none',
        }}
        viewBox="-32 0 32 32"
      >
        <path d="M 0 0 C 0 23.872 -5.76 32 -32 32 H 0 Z" fill={fill} />
      </svg>
    {children}
  </div>
);

export default MergedShape;