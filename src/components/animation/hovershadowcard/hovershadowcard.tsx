type HoverShadowCardProps = {
  children: React.ReactNode
  shadowColor?: string
}

export function HoverShadowCard({
  children,
  shadowColor = "rgba(59,130,246,0.5)",
}: HoverShadowCardProps) {
  return (
    <div className="group relative inline-block">
      {/* тень */}
      <div
        className="
          absolute inset-0 rounded-2xl
          opacity-0 blur-2xl
          transition-all duration-300
          group-hover:opacity-100
          group-hover:scale-105
        "
        style={{
          background: shadowColor,
        }}
      />

      {/* контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}