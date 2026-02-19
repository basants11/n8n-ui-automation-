'use client'

import { useState } from 'react'
import { NodeEditModal, NodeFormData } from '@/components/node/NodeEditModal'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Plus, Workflow, Settings, Zap, ArrowRight } from 'lucide-react'

export default function NodeModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedNodes, setSavedNodes] = useState<NodeFormData[]>([])

  const handleSave = (data: NodeFormData) => {
    console.log('Saved node data:', data)
    setSavedNodes(prev => [...prev, data])
  }

  const getActionLabel = (value: string) => {
    const labels: Record<string, string> = {
      send_email: 'Send an email',
      send_sms: 'Send a text message',
      send_slack: 'Send to Slack',
      webhook: 'Call a webhook',
      notify: 'Send notification',
    }
    return labels[value] || value
  }

  const getAccountLabel = (value: string) => {
    const labels: Record<string, string> = {
      gmail: 'Gmail',
      outlook: 'Outlook',
      slack: 'Slack',
      twilio: 'Twilio',
      discord: 'Discord',
    }
    return labels[value] || value
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Workflow Builder</h1>
            <p className="text-muted-foreground">Create and manage your automation nodes</p>
          </div>

          {/* Quick Start Card */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Quick Start
            </h2>
            <p className="text-muted-foreground mb-6">
              Click the button below to open the node editor and create your first automation step.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Node</span>
            </button>
          </div>

          {/* Saved Nodes */}
          {savedNodes.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-blue-400" />
                Your Nodes ({savedNodes.length})
              </h2>
              <div className="space-y-3">
                {savedNodes.map((node, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">{getActionLabel(node.action)}</p>
                        <p className="text-sm text-muted-foreground">
                          Using {getAccountLabel(node.account)}
                          {node.delay && ` • Wait ${node.delay} ${node.delayUnit}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {savedNodes.length === 0 && (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No nodes yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by adding your first automation node
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Your First Node</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Node Edit Modal */}
      <NodeEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </DashboardLayout>
  )
}
