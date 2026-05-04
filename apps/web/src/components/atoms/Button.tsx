interface ButtonProps {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export function Button({ variant = 'primary', children, type = 'button', onClick }: ButtonProps) {
  const base = 'w-full rounded-md font-bold py-3 px-6 transition-colors cursor-pointer flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-accent text-accent-text hover:bg-accent-hover',
    ghost: 'bg-transparent border border-muted/40 text-offwhite hover:border-accent',
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}
