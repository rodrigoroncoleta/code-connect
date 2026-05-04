interface LabelProps {
  htmlFor?: string
  children: React.ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[#e5e5e5] mb-1">
      {children}
    </label>
  )
}
