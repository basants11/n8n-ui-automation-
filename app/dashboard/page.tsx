'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Sparkles, 
  Play, 
  Pause, 
  Edit3, 
  Trash2,
  MoreVertical,
  Clock,
  Activity,
  Zap
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Sample workflows data
const sampleWorkflows = [
  {
    id: '1',
    name: 'Email to Slack Notification',
    description: 'When new email arrives, send notification to Slack channel',
    status: 'active' as const,
    lastRun: '2024-01-15T10:30:00Z',
    nodeCount: 3,
  },
  {
    id: '2',
    name: 'Invoice Processing',
    description: 'Extract data from invoices and save to Google Sheets',
    status: 'active' as const,
    lastRun: '2024-01-14T15:45:00Z',
    nodeCount: 5,
  },
  {
    id: '3',
    name: 'Social Media Scheduler',
    description: 'Schedule and post content to multiple social platforms',
    status: 'inactive' as const,
    lastRun: '2024-01-10T09:00:00Z',
    nodeCount: 4,
  },
  {
    id: '4',
    name: 'Lead Generation Bot',
    description: 'Capture leads from forms and add to CRM',
    status: 'active' as const,
    lastRun: '2024-01-15T08:00:00Z',
    nodeCount: 6,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState(sampleWorkflows)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const toggleStatus = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'inactive' as const : 'active' as const }
        : w
    ))
  }

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id))
    setActiveMenu(null)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Workflows</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor your automations</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link href="/workflow/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Automation
          </motion.button>
        </Link>
        
        <Link href="/ai-builder">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glow-button flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Build with AI
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-gradient rounded-xl" />
          </motion.button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground">Active Workflows</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-muted-foreground">Total Executions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Workflows List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {workflows.map((workflow) => (
          <motion.div
            key={workflow.id}
            variants={itemVariants}
            className="glass-card-hover p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  workflow.status === 'active' 
                    ? 'bg-green-500/20' 
                    : 'bg-gray-500/20'
                )}>
                  <Activity className={cn(
                    'w-5 h-5',
                    workflow.status === 'active' ? 'text-green-400' : 'text-gray-400'
                  )} />
                </div>
                
                <div>
                  <h3 className="font-semibold">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      workflow.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    )}>
                      {workflow.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {workflow.nodeCount} nodes
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last run: {formatRelativeTime(workflow.lastRun)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(workflow.id)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    workflow.status === 'active'
                      ? 'text-yellow-400 hover:bg-yellow-500/20'
                      : 'text-green-400 hover:bg-green-500/20'
                  )}
                >
                  {workflow.status === 'active' ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                
                <Link href={`/workflow/${workflow.id}`}>
                  <button className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors">
                    <Edit3 className="w-5 h-5" />
                  </button>
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === workflow.id ? null : workflow.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-white/5 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenu === workflow.id && (
                    <div className="absolute right-0 top-full mt-2 w-40 glass-card rounded-xl p-1 z-10">
                      <button
                        onClick={() => deleteWorkflow(workflow.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {workflows.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Zap className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No workflows yet</h3>
          <p className="text-muted-foreground mb-6">Create your first automation to get started</p>
          <Link href="/ai-builder">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glow-button inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Build with AI
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  )
}
