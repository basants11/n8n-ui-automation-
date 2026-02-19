'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useAppStore } from '@/store/useAppStore'
import { AssistantSidebar } from '@/components/assistant/AssistantSidebar'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed, assistantOpen } = useAppStore()

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
      >
        <Header />
        
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* AI Assistant Sidebar */}
      <AssistantSidebar />
    </div>
  )
}
