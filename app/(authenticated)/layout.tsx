'use client'

import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import TradingChatbot from '@/components/TradingChatbot'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
      <TradingChatbot />
    </div>
  )
}
