interface AuthTemplateProps {
  banner: React.ReactNode
  children: React.ReactNode
}

export function AuthTemplate({ banner, children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#1a1a1a] rounded-2xl overflow-hidden flex" style={{ minHeight: '560px' }}>
        <div className="hidden md:block w-2/5 flex-shrink-0">
          {banner}
        </div>
        <div className="flex-1 flex items-center justify-center p-10">
          {children}
        </div>
      </div>
    </div>
  )
}
