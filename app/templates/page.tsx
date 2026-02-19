'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Video, 
  User, 
  Sparkles, 
  Share2, 
  Mail,
  Search,
  Zap,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
  { id: 'content-creator', label: 'Content Creator', icon: Video },
  { id: 'freelancers', label: 'Freelancers', icon: User },
  { id: 'ai-automation', label: 'AI Automation', icon: Sparkles },
  { id: 'social-media', label: 'Social Media', icon: Share2 },
  { id: 'cold-email', label: 'Cold Email', icon: Mail },
]

const templates = [
  {
    id: '1',
    name: 'New Order Notification',
    description: 'Get notified instantly when a new order is placed in your store',
    category: 'ecommerce',
    imageUrl: '/templates/order-notification.png',
    nodeCount: 3,
  },
  {
    id: '2',
    name: 'Content Repurposing',
    description: 'Turn your YouTube videos into social media posts automatically',
    category: 'content-creator',
    imageUrl: '/templates/content-repurpose.png',
    nodeCount: 5,
  },
  {
    id: '3',
    name: 'Lead Capture & Follow-up',
    description: 'Capture leads from forms and send personalized follow-ups',
    category: 'freelancers',
    imageUrl: '/templates/lead-capture.png',
    nodeCount: 4,
  },
  {
    id: '4',
    name: 'AI Content Generator',
    description: 'Automatically generate blog posts from keywords using AI',
    category: 'ai-automation',
    imageUrl: '/templates/ai-content.png',
    nodeCount: 6,
  },
  {
    id: '5',
    name: 'Social Media Scheduler',
    description: 'Schedule and publish posts across multiple platforms',
    category: 'social-media',
    imageUrl: '/templates/social-schedule.png',
    nodeCount: 4,
  },
  {
    id: '6',
    name: 'Cold Email Outreach',
    description: 'Automate cold email campaigns with personalization',
    category: 'cold-email',
    imageUrl: '/templates/cold-email.png',
    nodeCount: 5,
  },
  {
    id: '7',
    name: 'Abandoned Cart Recovery',
    description: 'Send reminders to customers who left items in cart',
    category: 'ecommerce',
    imageUrl: '/templates/abandoned-cart.png',
    nodeCount: 4,
  },
  {
    id: '8',
    name: 'YouTube to Newsletter',
    description: 'Convert YouTube videos into weekly newsletter summaries',
    category: 'content-creator',
    imageUrl: '/templates/youtube-newsletter.png',
    nodeCount: 5,
  },
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = !selectedCategory || template.category === selectedCategory
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="text-muted-foreground mt-1">Start with pre-built workflows and customize them</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
          }`}
        >
          All Templates
        </button>
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          )
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card-hover group overflow-hidden"
          >
            {/* Preview Image */}
            <div className="h-40 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-cyan-500/20 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-16 h-16 text-purple-400/30" />
              </div>
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 backdrop-blur rounded-lg text-xs">
                {template.nodeCount} nodes
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>
              
              <Link href={`/templates/${template.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Use Template
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}
