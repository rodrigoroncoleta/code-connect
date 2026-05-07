interface SocialButtonProps {
  src: string
  label: string
  onClick?: () => void
}

export function SocialButton({ src, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1 cursor-pointer bg-transparent border-none"
    >
      <div className="w-12 h-12 rounded-full bg-surface border border-muted/40 flex items-center justify-center hover:border-accent transition-colors">
        <img src={src} alt="" className="w-6 h-6 object-contain" />
      </div>
      <span className="text-xs text-muted">{label}</span>
    </button>
  )
}
