const Logo = ({ size = 40 }) => (
  <span className="relative inline-flex shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-gradient-to-br from-blue-600/15 to-violet-600/15" style={{ width: size, height: size }} aria-label="Kishan Kumar logo">
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 7v26M8 21l17-14M8 21l18 12" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500" />
      <path d="M28 14c-5 0-8 3-8 7s3 7 8 7" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" className="text-violet-500" />
    </svg>
  </span>
);
export default Logo;
