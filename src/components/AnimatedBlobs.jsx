const AnimatedBlobs = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
    <svg className="absolute w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blurMe">
          <feGaussianBlur in="SourceGraphic" stdDeviation="80" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <g filter="url(#blurMe)">
        <circle className="blob1" cx="20%" cy="30%" r="150" />
        <circle className="blob2" cx="70%" cy="60%" r="200" />
        <circle className="blob3" cx="50%" cy="20%" r="100" />
        <circle className="blob4" cx="80%" cy="15%" r="120" />
      </g>
    </svg>
  </div>
);

export default AnimatedBlobs;
