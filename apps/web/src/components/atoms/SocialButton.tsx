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
      <div className="w-12 h-12 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center hover:border-[#22c55e] transition-colors">
        <img src={src} alt={label} className="w-6 h-6 object-contain" />
      </div>
      <span className="text-xs text-[#9ca3af]">{label}</span>
    </button>
  )
}
