interface ButtonProps {
  variant?: 'primary' | 'ghost'
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

export function Button({ variant = 'primary', children, type = 'button', onClick, disabled }: ButtonProps) {
  const base = 'w-full rounded-md font-bold py-3 px-6 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-accent text-accent-text hover:bg-accent-hover cursor-pointer',
    ghost: 'bg-transparent border border-muted/40 text-offwhite hover:border-accent cursor-pointer',
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}
