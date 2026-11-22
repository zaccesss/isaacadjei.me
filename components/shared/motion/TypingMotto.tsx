interface TypingMottoProps {
  text: string
  className?: string
}

export default function TypingMotto({ text, className }: TypingMottoProps) {
  return (
    <p className={`font-mono text-xs flex items-center gap-1.5 ${className ?? ""}`}>
      <span className="text-primary font-semibold shrink-0" aria-hidden="true">$</span>
      <span className="text-foreground/75">{text}</span>
    </p>
  )
}
