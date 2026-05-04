interface ButtonProps {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export function Button({ variant = 'primary', children, type = 'button', onClick }: ButtonProps) {
  const base = 'w-full rounded-md font-bold py-3 px-6 transition-colors cursor-pointer flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-[#22c55e] text-black hover:bg-[#16a34a]',
    ghost: 'bg-transparent border border-[#3a3a3a] text-[#e5e5e5] hover:border-[#22c55e]',
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}
