export const ALLOW: { rule: string; file: string; reason: string }[] = [
  { rule: "glued-arrow", file: "app/lab/LabContent.tsx", reason: "the lab terminal prints shell output where an arrow marks a result line; it is terminal text, not link text" },
  { rule: "glued-arrow", file: "app/lab/_terminal/games.tsx", reason: "the on-screen d-pad buttons show the arrow key each one stands for, with an aria-label naming the direction" },
  { rule: "chart-hex", file: "components/analytics/IsometricContributionCalendar.tsx", reason: "a three.js circuit-board scene whose board and LED colours are materials, not data series; WebGL cannot read the CSS palette" },
]
