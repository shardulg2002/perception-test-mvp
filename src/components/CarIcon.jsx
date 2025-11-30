/**
 * Car SVG Component
 * Simple car icon for the perception test
 */
export default function CarIcon({ width = 60, height = 30, color = "#3B82F6" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 60 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car body */}
      <rect x="5" y="15" width="50" height="12" rx="2" fill={color} />
      
      {/* Car top/cabin */}
      <path
        d="M15 15 L20 8 L40 8 L45 15 Z"
        fill={color}
      />
      
      {/* Windows */}
      <rect x="22" y="10" width="8" height="4" rx="1" fill="#E0F2FE" opacity="0.7" />
      <rect x="32" y="10" width="8" height="4" rx="1" fill="#E0F2FE" opacity="0.7" />
      
      {/* Wheels */}
      <circle cx="15" cy="27" r="3" fill="#1F2937" />
      <circle cx="45" cy="27" r="3" fill="#1F2937" />
      
      {/* Wheel centers */}
      <circle cx="15" cy="27" r="1.5" fill="#6B7280" />
      <circle cx="45" cy="27" r="1.5" fill="#6B7280" />
      
      {/* Headlight */}
      <circle cx="54" cy="20" r="1.5" fill="#FCD34D" />
    </svg>
  );
}
