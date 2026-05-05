type MaterialIconProps = {
  name: string
  className?: string
  filled?: boolean
  label?: string
}

/**
 * Renders a Google Material Symbols Outlined glyph (font loaded in theme.css).
 */
export function MaterialIcon({
  name,
  className,
  filled,
  label,
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ''}`.trim()}
      style={
        filled
          ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
          : undefined
      }
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      {name}
    </span>
  )
}
