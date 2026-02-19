'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Send,
  Play,
  User,
  MessageSquare,
  Clock,
  Zap
} from 'lucide-react'

interface NodeEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: NodeFormData) => void
  nodeData?: NodeFormData
}

export interface NodeFormData {
  account: string
  action: string
  message: string
  delay: string
  delayUnit: 'minutes' | 'hours' | 'days'
}

const defaultFormData: NodeFormData = {
  account: '',
  action: '',
  message: '',
  delay: '',
  delayUnit: 'minutes'
}

const actionOptions = [
  { value: 'send_email', label: 'Send an email' },
  { value: 'send_sms', label: 'Send a text message' },
  { value: 'send_slack', label: 'Send to Slack' },
  { value: 'webhook', label: 'Call a webhook' },
  { value: 'notify', label: 'Send notification' },
]

const accountOptions = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'outlook', label: 'Outlook' },
  { value: 'slack', label: 'Slack' },
  { value: 'twilio', label: 'Twilio' },
  { value: 'discord', label: 'Discord' },
]

export function NodeEditModal({ isOpen, onClose, onSave, nodeData }: NodeEditModalProps) {
  const [formData, setFormData] = useState<NodeFormData>(defaultFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof NodeFormData, string>>>({})
  const [isTesting, setIsTesting] = useState(false)
  const [testSuccess, setTestSuccess] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (nodeData) {
      setFormData(nodeData)
    } else {
      setFormData(defaultFormData)
    }
    setErrors({})
    setTestSuccess(false)
    setShowSuccess(false)
  }, [nodeData, isOpen])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NodeFormData, string>> = {}

    if (!formData.account) {
      newErrors.account = 'Please connect an account'
    }

    if (!formData.action) {
      newErrors.action = 'Please select what should happen'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message'
    }

    if (formData.delay && isNaN(Number(formData.delay))) {
      newErrors.delay = 'Delay must be a number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleTest = async () => {
    if (!validate()) return

    setIsTesting(true)
    setTestSuccess(false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsTesting(false)
    setTestSuccess(true)

    // Reset success after 3 seconds
    setTimeout(() => setTestSuccess(false), 3000)
  }

  const handleSave = () => {
    if (!validate()) return

    setShowSuccess(true)
    onSave(formData)

    // Close modal after animation
    setTimeout(() => {
      onClose()
      setShowSuccess(false)
    }, 1500)
  }

  const handleChange = (field: keyof NodeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: 'spring', damping: 25, stiffness: 300 }
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card mx-4 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Edit Node</h2>
                    <p className="text-sm text-muted-foreground">Configure your automation</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Success Animation */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 flex items-center justify-center bg-card/95 rounded-xl z-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-20 h-20 text-green-400" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute mt-24 text-green-400 font-medium"
                    >
                      Saved successfully!
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <div className="space-y-5">
                {/* Connect Account */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <User className="w-4 h-4 text-purple-400" />
                    Connect Account
                  </label>
                  <select
                    value={formData.account}
                    onChange={(e) => handleChange('account', e.target.value)}
                    className={`w-full bg-white/5 border ${errors.account ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                  >
                    <option value="">Select an account...</option>
                    {accountOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.account && (
                    <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {errors.account}
                    </p>
                  )}
                </div>

                {/* What should happen? */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    What should happen?
                  </label>
                  <select
                    value={formData.action}
                    onChange={(e) => handleChange('action', e.target.value)}
                    className={`w-full bg-white/5 border ${errors.action ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                  >
                    <option value="">Choose an action...</option>
                    {actionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.action && (
                    <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {errors.action}
                    </p>
                  )}
                </div>

                {/* Message Content */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    Message content
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="What message do you want to send?"
                    rows={3}
                    className={`w-full bg-white/5 border ${errors.message ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none`}
                  />
                  {errors.message && (
                    <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Delay Time */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    Wait before next step
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.delay}
                      onChange={(e) => handleChange('delay', e.target.value)}
                      placeholder="0"
                      className={`flex-1 bg-white/5 border ${errors.delay ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                    />
                    <select
                      value={formData.delayUnit}
                      onChange={(e) => handleChange('delayUnit', e.target.value)}
                      className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                  {errors.delay && (
                    <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {errors.delay}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Leave empty for no delay
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleTest}
                  disabled={isTesting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : testSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {isTesting ? 'Testing...' : testSuccess ? 'Success!' : 'Test Node'}
                  </span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={showSuccess}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span className="text-sm font-medium">Save</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
