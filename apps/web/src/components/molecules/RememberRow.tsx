import { Checkbox } from '../atoms/Checkbox'

interface RememberRowProps {
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function RememberRow({ checked, onChange }: RememberRowProps) {
  return (
    <div className="flex items-center justify-between">
      <Checkbox id="remember" checked={checked} onChange={onChange} label="Lembrar-me" />
      <a href="#" className="text-sm text-[#9ca3af] underline hover:text-[#22c55e] transition-colors">
        Esqueci a senha
      </a>
    </div>
  )
}
