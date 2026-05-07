import type { ReactNode } from 'react'
import { Sidebar } from '../organisms/Sidebar'

interface FeedLayoutProps {
  children: ReactNode
}

export function FeedLayout({ children }: FeedLayoutProps) {
  return (
    <div className="flex items-start justify-between gap-8 py-14 px-4 max-w-[1280px] mx-auto min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
