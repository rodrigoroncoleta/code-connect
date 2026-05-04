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
      className="w-full rounded-md bg-[#2a2a2a] border border-[#3a3a3a] px-4 py-3 text-[#e5e5e5] placeholder-[#9ca3af] focus:outline-none focus:border-[#22c55e] transition-colors"
    />
  )
}
