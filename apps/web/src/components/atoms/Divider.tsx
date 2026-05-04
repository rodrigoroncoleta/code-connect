interface DividerProps {
  label?: string
}

export function Divider({ label }: DividerProps) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-[#3a3a3a]" />
      {label && <span className="text-xs text-[#9ca3af] whitespace-nowrap">{label}</span>}
      <div className="flex-1 h-px bg-[#3a3a3a]" />
    </div>
  )
}
