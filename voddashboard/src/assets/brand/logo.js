export const logo = [
  '599 116',
  `  <defs>
    <!-- Gradient for letters -->
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff7e5f" />
      <stop offset="100%" stop-color="#feb47b" />
    </linearGradient>

    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#86a8e7" />
      <stop offset="100%" stop-color="#7f7fd5" />
    </linearGradient>

    <!-- Pattern for styling -->
    <pattern id="pattern1" patternUnits="userSpaceOnUse" width="10" height="10">
      <circle cx="2" cy="2" r="1.5" fill="white" />
    </pattern>
  </defs>

  <g fill="url(#gradient1)" stroke="black" stroke-width="2">
    <!-- T -->
    <path d="M10 20 H50 V30 H30 V80 H20 V30 H10 Z" transform="scale(1.2)"/>
    <!-- H -->
    <path d="M60 20 V80 H70 V50 H90 V80 H100 V20 H90 V40 H70 V20 H60 Z" />
    <!-- Corrected F -->
    <path d="M110 20 V80 H140 V70 H120 V50 H140 V40 H120 V20 H110 Z" transform="scale(1,-1) translate(0,-100)" />
    <!-- I -->
    <path d="M150 20 H160 V80 H150 Z" />
    <!-- L -->
    <path d="M170 20 V80 H200 V70 H180 V20 Z" />
    <!-- M -->
    <path d="M220 20 V80 H230 L250 40 L270 80 H280 V20 H270 V60 L250 30 L230 60 V20 H220 Z" transform="scale(1,-1) translate(0,-100)" />
  </g>

  <!-- Decorative Overlay -->
  <g fill="url(#pattern1)">
    <path d="M10 20 H50 V30 H30 V80 H20 V30 H10 Z" />
    <path d="M60 20 V80 H70 V50 H90 V80 H100 V20 H90 V40 H70 V20 H60 Z" />
    <path d="M110 20 V80 H140 V70 H120 V50 H140 V40 H120 V20 H110 Z" />
    <path d="M150 20 H160 V80 H150 Z" />
    <path d="M170 20 V80 H200 V70 H180 V20 Z" />
    <path d="M220 20 V80 H230 L250 40 L270 80 H280 V20 H270 V60 L250 30 L230 60 V20 H220 Z" />
  </g>`,
]
