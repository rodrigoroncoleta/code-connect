interface TagProps {
  label: string
  onRemove?: () => void
}

export function Tag({ label, onRemove }: TagProps) {
  return (
    <span className="flex items-center gap-1 bg-muted/30 text-offwhite text-xs px-2 py-1 rounded">
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="material-icons text-[14px] leading-none hover:text-accent cursor-pointer"
          aria-label={`Remover filtro ${label}`}
        >
          close
        </button>
      )}
    </span>
  )
}
