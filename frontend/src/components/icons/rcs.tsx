import type { SVGProps } from 'react'

const RcsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M6.846 18.62a3.1 3.1 0 0 0-.788-1.611C4.183 15.543 3 13.394 3 11c0-4.418 4.03-8 9-8s9 3.582 9 8-4.03 8-9 8c-.845 0-1.664-.104-2.44-.297a.26.26 0 0 0-.279.109 7 7 0 0 1-.404.555 6 6 0 0 1-.763.802c-.519.448-1.107.774-1.722.824l-.062.004c-.041.003-.065-.045-.04-.079l.034-.048a3.06 3.06 0 0 0 .522-2.25m-2.184-.167C2.456 16.658 1 14.01 1 11 1 5.262 6.153 1 12 1s11 4.262 11 10-5.153 10-11 10q-.904 0-1.772-.13c-.292.338-.62.666-.983.96-.69.557-1.65 1.105-2.813 1.165-1.88.096-2.68-1.992-1.758-3.256a1.065 1.065 0 0 0-.012-1.286"
      clipRule="evenodd"
    />
    <text
      x="2em"
      y="1.9em"
      fill="currentColor"
      dominantBaseline="central"
      fontFamily="Inter, Arial, sans-serif"
      fontSize="6"
      fontWeight="800"
      letterSpacing="0.05em"
      textAnchor="middle"
    >
      RCS
    </text>
  </svg>
)

export { RcsIcon }
