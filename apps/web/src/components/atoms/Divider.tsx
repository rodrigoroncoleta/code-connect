interface DividerProps {
  label?: string
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-muted" />
      {label && <span className="text-sm text-offwhite whitespace-nowrap">{label}</span>}
      <div className="flex-1 h-px bg-muted" />
    </div>
  )
}
