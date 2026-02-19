'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/utils'

const mockExecutions = [
  {
    id: '1',
    workflowName: 'Email to Slack Notification',
    status: 'success' as const,
    startedAt: '2024-01-15T10:30:00Z',
    finishedAt: '2024-01-15T10:30:15Z',
    duration: 15,
  },
  {
    id: '2',
    workflowName: 'Invoice Processing',
    status: 'failed' as const,
    startedAt: '2024-01-15T10:25:00Z',
    finishedAt: '2024-01-15T10:25:30Z',
    duration: 30,
    error: 'Failed to connect to Google Drive API. Please check your credentials.',
  },
  {
    id: '3',
    workflowName: 'Social Media Scheduler',
    status: 'pending' as const,
    startedAt: '2024-01-15T10:20:00Z',
  },
  {
    id: '4',
    workflowName: 'Lead Generation Bot',
    status: 'success' as const,
    startedAt: '2024-01-15T10:15:00Z',
    finishedAt: '2024-01-15T10:15:45Z',
    duration: 30,
  },
  {
    id: '5',
    workflowName: 'Email to Slack Notification',
    status: 'success' as const,
    startedAt: '2024-01-15T10:00:00Z',
    finishedAt: '2024-01-15T10:00:12Z',
    duration: 12,
  },
]

export default function AnalyticsPage() {
  const [executions] = useState(mockExecutions)
  const [selectedExecution, setSelectedExecution] = useState<typeof mockExecutions[0] | null>(null)

  const successCount = executions.filter(e => e.status === 'success').length
  const failedCount = executions.filter(e => e.status === 'failed').length
  const pendingCount = executions.filter(e => e.status === 'pending').length
  const successRate = ((successCount / (successCount + failedCount)) * 100).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Monitor your workflow executions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Executions</p>
              <p className="text-3xl font-bold mt-1">{executions.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Successful</p>
              <p className="text-3xl font-bold mt-1 text-green-400">{successCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-3xl font-bold mt-1 text-red-400">{failedCount}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-3xl font-bold mt-1">{successRate}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Executions List */}
      <div className="glass-card">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold">Recent Executions</h2>
        </div>
        
        <div className="divide-y divide-white/5">
          {executions.map((execution, index) => (
            <motion.div
              key={execution.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedExecution(execution)}
              className={cn(
                'p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-white/5',
                selectedExecution?.id === execution.id && 'bg-white/5'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  execution.status === 'success' && 'bg-green-500/20',
                  execution.status === 'failed' && 'bg-red-500/20',
                  execution.status === 'pending' && 'bg-yellow-500/20'
                )}>
                  {execution.status === 'success' && (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                  {execution.status === 'failed' && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  {execution.status === 'pending' && (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                
                <div>
                  <p className="font-medium">{execution.workflowName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(execution.startedAt)}
                    {execution.duration && ` • ${execution.duration}s`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  execution.status === 'success' && 'bg-green-500/20 text-green-400',
                  execution.status === 'failed' && 'bg-red-500/20 text-red-400',
                  execution.status === 'pending' && 'bg-yellow-500/20 text-yellow-400'
                )}>
                  {execution.status === 'success' && 'Success'}
                  {execution.status === 'failed' && 'Failed'}
                  {execution.status === 'pending' && 'Pending'}
                </span>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Error Details Modal */}
      {selectedExecution?.status === 'failed' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
          onClick={() => setSelectedExecution(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold">Execution Failed</h3>
                <p className="text-sm text-muted-foreground">{selectedExecution.workflowName}</p>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-400">{selectedExecution.error}</p>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="font-medium">What happened?</h4>
              <p className="text-sm text-muted-foreground">
                The workflow failed to connect to Google Drive. This is usually caused by:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Invalid or expired credentials</li>
                <li>• Missing permissions</li>
                <li>• Network connectivity issues</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedExecution(null)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
