'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Zap,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      '3 workflows',
      '100 executions/month',
      'Basic templates',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'For growing businesses',
    features: [
      'Unlimited workflows',
      '10,000 executions/month',
      'All templates',
      'AI Builder',
      'Priority support',
      'Custom integrations',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    description: 'For power users',
    features: [
      'Everything in Pro',
      'Unlimited executions',
      'AI Premium features',
      'Dedicated support',
      'Custom branding',
      'SLA guarantee',
    ],
  },
]

export default function SettingsPage() {
  const { user } = useAppStore()
  const [activeTab, setActiveTab] = useState('billing')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'billing' && (
        <div className="space-y-8">
          {/* Current Plan */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Current Plan</h2>
                <p className="text-muted-foreground">You are on the {user?.plan} plan</p>
              </div>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium capitalize">
                {user?.plan}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'relative p-6 rounded-2xl border transition-all',
                    plan.id === user?.plan
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.id === user?.plan ? (
                    <button
                      disabled
                      className="w-full py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg text-sm font-medium"
                    >
                      Upgrade
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                Update <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
              <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            
            <div className="space-y-2">
              {[
                { date: 'Jan 1, 2024', amount: '$29.00', status: 'Paid' },
                { date: 'Dec 1, 2023', amount: '$29.00', status: 'Paid' },
                { date: 'Nov 1, 2023', amount: '$29.00', status: 'Paid' },
              ].map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-muted-foreground">Pro Plan</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-400 text-sm">{invoice.status}</span>
                    <span className="font-medium">{invoice.amount}</span>
                    <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium"
              >
                Save Changes
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
          
          <div className="space-y-4">
            {[
              { label: 'Workflow failures', description: 'Get notified when a workflow fails' },
              { label: 'Weekly summary', description: 'Receive a weekly summary of your workflows' },
              { label: 'New features', description: 'Be the first to know about new features' },
              { label: 'Tips & tutorials', description: 'Receive helpful tips and tutorials' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <motion.div
                    animate={{ x: 24 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium">
                Enable
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium">API Keys</p>
                  <p className="text-sm text-muted-foreground">Manage your API keys</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20">
                Manage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
