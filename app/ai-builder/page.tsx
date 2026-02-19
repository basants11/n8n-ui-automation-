'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Loader2, 
  Zap, 
  X, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import Link from 'next/link'

const examplePrompts = [
  "When I receive a Gmail, save attachment to Drive and notify me on Telegram.",
  "Every morning, fetch weather data and send to Slack channel.",
  "When a new form is submitted, add to Google Sheets and send confirmation email.",
  "Monitor Twitter for mentions and notify via Discord.",
]

export default function AIBuilderPage() {
  const { isGenerating, setIsGenerating } = useAppStore()
  const [prompt, setPrompt] = useState('')
  const [generatedWorkflow, setGeneratedWorkflow] = useState<any>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    
    try {
      // Send prompt to backend API
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate workflow')
      }
      
      const data = await response.json()
      
      // Set the generated workflow from API response
      setGeneratedWorkflow(data.workflow)
    } catch (error) {
      console.error('Error generating workflow:', error)
      // Fallback to mock data on error
      setGeneratedWorkflow({
        name: 'New Automation',
        description: prompt,
        nodes: [
          { id: '1', type: 'trigger', label: 'Email Trigger', friendlyName: 'When email arrives' },
          { id: '2', type: 'action', label: 'Google Drive', friendlyName: 'Save to Drive' },
          { id: '3', type: 'notification', label: 'Telegram', friendlyName: 'Send notification' },
        ],
        explanation: "I've created a workflow with 3 steps: 1) Email trigger to watch for new messages, 2) Save attachment to Google Drive, 3) Send notification via Telegram."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClear = () => {
    setPrompt('')
    setGeneratedWorkflow(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">AI-Powered Builder</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold"
        >
          Describe your automation
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg"
        >
          Tell us what you want to automate, and we'll build it for you
        </motion.p>
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to automate...

Example: When I receive a Gmail, save attachment to Drive and notify me on Telegram."
            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />
          
          {/* Clear Button */}
          {prompt && (
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Workflow...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Workflow
              </>
            )}
          </motion.button>
        </div>

        {/* Example Prompts */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="px-3 py-1.5 text-sm text-muted-foreground bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-colors"
              >
                {example.length > 50 ? example.slice(0, 50) + '...' : example}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-12 text-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-background" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Building your workflow</h3>
            <p className="text-muted-foreground">
              Our AI is analyzing your request and creating the perfect automation
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Workflow */}
      <AnimatePresence>
        {generatedWorkflow && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-6 border-green-500/30">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Workflow Generated!</h3>
                  <p className="text-muted-foreground">{generatedWorkflow.explanation}</p>
                </div>
              </div>
            </div>

            {/* Workflow Preview */}
            <div className="glass-card p-6 space-y-4">
              <h4 className="font-semibold">Workflow Preview</h4>
              <div className="flex items-center gap-4 flex-wrap">
                {generatedWorkflow.nodes.map((node: any, index: number) => (
                  <div key={node.id} className="flex items-center gap-4">
                    <div className={`
                      px-4 py-3 rounded-xl border transition-all hover:scale-105 cursor-pointer
                      ${node.type === 'trigger' ? 'bg-blue-500/20 border-blue-500/30' : ''}
                      ${node.type === 'action' ? 'bg-green-500/20 border-green-500/30' : ''}
                      ${node.type === 'notification' ? 'bg-red-500/20 border-red-500/30' : ''}
                    `}>
                      <p className="text-sm font-medium">{node.friendlyName}</p>
                    </div>
                    {index < generatedWorkflow.nodes.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link href="/workflow/new" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl"
                >
                  <Zap className="w-5 h-5" />
                  Edit in Workflow Builder
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClear}
                className="px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                Start Over
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          Tips for better results
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Be specific about triggers (e.g., "when a new email arrives")</li>
          <li>• Mention all the actions you want to happen</li>
          <li>• Include any conditions or filters if needed</li>
          <li>• Mention which services to use (Gmail, Slack, etc.)</li>
        </ul>
      </motion.div>
    </div>
  )
}
