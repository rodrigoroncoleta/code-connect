interface InputProps {
  id?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function Input({ id, type = 'text', placeholder, value, onChange }: InputProps) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded bg-muted px-4 py-2 text-surface placeholder-surface/60 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
    />
  )
}
