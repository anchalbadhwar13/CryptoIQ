'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, TrendingUp, AlertTriangle, BarChart3, Gamepad2, BookOpen, User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Learning Hub', href: '/dashboard', icon: BookOpen, sub: true },
  { name: 'Risk Lab', href: '/risk-lab', icon: AlertTriangle },
  { name: 'Market Watch', href: '/market', icon: TrendingUp },
  { name: 'Simulator', href: '/game', icon: Gamepad2 },
  { name: 'Profile', href: '/dashboard', icon: User, sub: true },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-white/10 z-40"
    >
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
            const isActive = pathname === item.href || (item.sub && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-cyber-cyan/20 border border-cyber-cyan/40 shadow-cyber-glow'
                    : 'hover:bg-cyber-navy/60 hover:border hover:border-white/10'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all duration-200 mt-4 border border-transparent hover:border-red-500/40">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  )
}
