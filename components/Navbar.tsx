'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-64 right-0 h-16 glass-card border-b border-white/10 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 hover:bg-cyber-navy/60 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:text-cyber-cyan transition-colors border-b-2 border-transparent hover:border-cyber-cyan">
            Learn
          </Link>
          <Link href="/risk-lab" className="text-sm font-medium hover:text-cyber-cyan transition-colors border-b-2 border-transparent hover:border-cyber-cyan">
            Risk Watch
          </Link>
        </div>
      </div>
    </nav>
  )
}
