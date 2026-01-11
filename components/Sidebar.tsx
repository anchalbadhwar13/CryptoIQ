'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TrendingUp, AlertTriangle, Gamepad2, BookOpen, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Learning Hub', href: '/dashboard', icon: BookOpen },
  { name: 'Risk Lab', href: '/risk-lab', icon: AlertTriangle },
  { name: 'Market Watch', href: '/market', icon: TrendingUp },
  { name: 'Simulator', href: '/game', icon: Gamepad2 },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/10 z-40">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-neon-green rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-cyber-dark">$</span>
          </div>
          <span className="text-xl font-bold gradient-text">CoinCoach</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150',
                  isActive
                    ? 'bg-cyber-cyan/20 border border-cyber-cyan/40'
                    : 'hover:bg-cyber-navy/60'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors duration-150 mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
