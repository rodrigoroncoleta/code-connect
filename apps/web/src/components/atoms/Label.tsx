interface LabelProps {
  htmlFor?: string
  children: React.ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-lg font-normal text-offwhite mb-1">
      {children}
    </label>
  )
}
