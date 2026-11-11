export default function ZacessMark({ className }: { className?: string }) {
  return (
    <svg viewBox="8 8 48 48" className={className} role="img" aria-label="Zacess">
      <path d="M20 10H38L47 19V51Q47 54 44 54H20Q17 54 17 51V13Q17 10 20 10Z" className="fill-foreground" />
      <path d="M38 10V16Q38 19 41 19H47Z" className="fill-muted-foreground" />
      <rect x="22" y="23" width="20" height="3.5" rx="1.75" className="fill-background" />
      <rect x="22" y="45" width="13" height="3.5" rx="1.75" className="fill-background" />
      <rect x="12" y="30.5" width="40" height="11" rx="2.5" fill="#FFD400" />
      <rect x="22" y="34.25" width="20" height="3.5" rx="1.75" fill="#111111" />
    </svg>
  )
}
