'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Search, 
  MessageSquare, 
  User,
  Zap,
  ChevronDown
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export function Header() {
  const { user, settings, updateSettings, setAssistantOpen } = useAppStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Beginner Mode Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-muted-foreground">Beginner</span>
          <button
            onClick={() => updateSettings({ beginnerMode: !settings.beginnerMode })}
            className={cn(
              'w-10 h-5 rounded-full transition-colors relative',
              settings.beginnerMode ? 'bg-purple-500' : 'bg-white/20'
            )}
          >
            <motion.div
              animate={{ x: settings.beginnerMode ? 20 : 2 }}
              className="w-4 h-4 bg-white rounded-full absolute top-0.5"
            />
          </button>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={() => setAssistantOpen(true)}
          className="relative p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-purple-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">{user?.name}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl p-2 z-50"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full capitalize">
                    {user?.plan} Plan
                  </span>
                </div>
                <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Account Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Billing
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
