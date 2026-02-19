// Workflow Types
export interface Workflow {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  createdAt: string
  updatedAt: string
  lastRun?: string
  n8nWorkflowId?: string
}

export interface WorkflowNode {
  id: string
  type: NodeType
  position: { x: number; y: number }
  data: NodeData
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
}

export type NodeType = 
  | 'trigger' 
  | 'action' 
  | 'ai' 
  | 'logic' 
  | 'notification'

export interface NodeData {
  label: string
  friendlyName: string
  description: string
  config: Record<string, any>
  credentials?: string
}

// Node Categories
export const NODE_CATEGORIES: Record<NodeType, { color: string; label: string }> = {
  trigger: { color: '#3b82f6', label: 'Triggers' },
  action: { color: '#22c55e', label: 'Actions' },
  ai: { color: '#a855f7', label: 'AI' },
  logic: { color: '#f97316', label: 'Logic' },
  notification: { color: '#ef4444', label: 'Notifications' },
}

// Node Templates
export interface NodeTemplate {
  id: string
  type: NodeType
  name: string
  friendlyName: string
  description: string
  icon: string
  n8nNode: string
  fields: NodeField[]
}

export interface NodeField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number' | 'toggle'
  required: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

// Template Types
export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  imageUrl: string
  workflow: Partial<Workflow>
}

export type TemplateCategory = 
  | 'ecommerce'
  | 'content-creator'
  | 'freelancers'
  | 'ai-automation'
  | 'social-media'
  | 'cold-email'

// User & Subscription Types
export interface User {
  id: string
  email: string
  name: string
  plan: SubscriptionPlan
  createdAt: string
}

export type SubscriptionPlan = 'free' | 'pro' | 'premium'

// Execution & Log Types
export interface Execution {
  id: string
  workflowId: string
  status: 'success' | 'failed' | 'pending'
  startedAt: string
  finishedAt?: string
  error?: string
  data?: any
}

// AI Builder Types
export interface AIGenerationRequest {
  prompt: string
  context?: Record<string, any>
}

export interface AIGenerationResponse {
  workflow: Partial<Workflow>
  explanation: string
}

// Assistant Types
export interface AssistantMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Settings Types
export interface AppSettings {
  beginnerMode: boolean
  sidebarCollapsed: boolean
  theme: 'dark' | 'light'
}
