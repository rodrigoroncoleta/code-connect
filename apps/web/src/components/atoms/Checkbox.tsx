interface CheckboxProps {
  id?: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
}

export function Checkbox({ id, checked, onChange, label }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none text-sm text-[#e5e5e5]">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#3a3a3a] bg-[#2a2a2a] accent-[#22c55e] cursor-pointer"
      />
      {label}
    </label>
  )
}
