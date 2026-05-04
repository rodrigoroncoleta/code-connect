interface AuthBannerProps {
  src: string
  alt?: string
}

export function AuthBanner({ src, alt = '' }: AuthBannerProps) {
  return (
    <div className="relative h-full w-full rounded-2xl overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
