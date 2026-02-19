'use client'

import { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  ReactFlowProvider,
  MiniMap,
} from 'reactflow'
import type { Node, Edge, Connection, NodeTypes } from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  Plus, 
  Save, 
  Play, 
  Trash2, 
  ChevronRight,
  ChevronDown,
  Edit3,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NodeTemplate, NodeType, NODE_CATEGORIES } from '@/types'

// Node Templates with friendly names
const nodeTemplates: NodeTemplate[] = [
  // Triggers (Blue)
  {
    id: 'trigger-email',
    type: 'trigger',
    name: 'When email arrives',
    friendlyName: 'When email arrives',
    description: 'Watch for new emails in your inbox',
    icon: 'Mail',
    n8nNode: 'n8n-nodes-base.emailReadImap',
    fields: []
  },
  {
    id: 'trigger-schedule',
    type: 'trigger',
    name: 'On a schedule',
    friendlyName: 'On a schedule',
    description: 'Run workflow at specific times',
    icon: 'Clock',
    n8nNode: 'n8n-nodes-base.scheduleTrigger',
    fields: []
  },
  {
    id: 'trigger-webhook',
    type: 'trigger',
    name: 'When called remotely',
    friendlyName: 'When called remotely',
    description: 'Start workflow from external apps',
    icon: 'Webhook',
    n8nNode: 'n8n-nodes-base.webhook',
    fields: []
  },
  {
    id: 'trigger-form',
    type: 'trigger',
    name: 'Form submitted',
    friendlyName: 'Form submitted',
    description: 'When someone fills out a form',
    icon: 'FileText',
    n8nNode: 'n8n-nodes-base.formTrigger',
    fields: []
  },
  
  // Actions (Green)
  {
    id: 'action-http',
    type: 'action',
    name: 'Send Data to Website',
    friendlyName: 'Send Data to Website',
    description: 'Send information to any website',
    icon: 'Send',
    n8nNode: 'n8n-nodes-base.httpRequest',
    fields: []
  },
  {
    id: 'action-gsheet',
    type: 'action',
    name: 'Add to Spreadsheet',
    friendlyName: 'Add to Spreadsheet',
    description: 'Add a row to Google Sheets',
    icon: 'Table',
    n8nNode: 'n8n-nodes-base.googleSheets',
    fields: []
  },
  {
    id: 'action-gdrive',
    type: 'action',
    name: 'Save to Drive',
    friendlyName: 'Save to Drive',
    description: 'Save files to Google Drive',
    icon: 'HardDrive',
    n8nNode: 'n8n-nodes-base.googleDrive',
    fields: []
  },
  {
    id: 'action-slack',
    type: 'action',
    name: 'Send Slack Message',
    friendlyName: 'Send Slack Message',
    description: 'Post a message to Slack',
    icon: 'MessageSquare',
    n8nNode: 'n8n-nodes-base.slack',
    fields: []
  },
  
  // AI (Purple)
  {
    id: 'ai-text',
    type: 'ai',
    name: 'Summarize Text',
    friendlyName: 'Summarize Text',
    description: 'Use AI to shorten long text',
    icon: 'Scissors',
    n8nNode: '@n8n/n8n-nodes-langchain.chainSummarization',
    fields: []
  },
  {
    id: 'ai-translate',
    type: 'ai',
    name: 'Translate Text',
    friendlyName: 'Translate Text',
    description: 'Convert text to another language',
    icon: 'Languages',
    n8nNode: '@n8n/n8n-nodes-langchain.agent',
    fields: []
  },
  {
    id: 'ai-analyze',
    type: 'ai',
    name: 'Analyze Sentiment',
    friendlyName: 'Analyze Sentiment',
    description: 'Understand if text is positive or negative',
    icon: 'Heart',
    n8nNode: '@n8n/n8n-nodes-langchain.chainGeneration',
    fields: []
  },
  
  // Logic (Orange)
  {
    id: 'logic-filter',
    type: 'logic',
    name: 'Filter',
    friendlyName: 'Filter',
    description: 'Only continue if conditions are met',
    icon: 'Filter',
    n8nNode: 'n8n-nodes-base.if',
    fields: []
  },
  {
    id: 'logic-switch',
    type: 'logic',
    name: 'Split path',
    friendlyName: 'Split path',
    description: 'Do different things based on value',
    icon: 'GitBranch',
    n8nNode: 'n8n-nodes-base.switch',
    fields: []
  },
  {
    id: 'logic-delay',
    type: 'logic',
    name: 'Wait',
    friendlyName: 'Wait',
    description: 'Pause before continuing',
    icon: 'Timer',
    n8nNode: 'n8n-nodes-base.wait',
    fields: []
  },
  
  // Notifications (Red)
  {
    id: 'notify-telegram',
    type: 'notification',
    name: 'Send Telegram',
    friendlyName: 'Send Telegram',
    description: 'Send a message via Telegram',
    icon: 'Send',
    n8nNode: 'n8n-nodes-base.telegram',
    fields: []
  },
  {
    id: 'notify-email',
    type: 'notification',
    name: 'Send Email',
    friendlyName: 'Send Email',
    description: 'Send an email to anyone',
    icon: 'Mail',
    n8nNode: 'n8n-nodes-base.emailSend',
    fields: []
  },
  {
    id: 'notify-discord',
    type: 'notification',
    name: 'Send Discord',
    friendlyName: 'Send Discord',
    description: 'Post to Discord channel',
    icon: 'MessageCircle',
    n8nNode: 'n8n-nodes-base.discord',
    fields: []
  },
]

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Webhook: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 16.98h-5.99c-1.1 0-1.95.68-2.95 1.76"/><path d="M18 21h-6.01c-1.1 0-2-.9-2-2v0c0-1.1.9-2 2-2h6"/><path d="M6 7.98h6"/><path d="M12 3v18"/><path d="m9 6 3-3 3 3"/><path d="m9 18 3 3 3-3"/></svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Table: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
  ),
  HardDrive: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="2" y1="6" y2="6"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6" y1="16" y2="16"/><line x1="4" x2="4" y1="16" y2="16"/></svg>
  ),
  MessageSquare: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Scissors: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="14.48" y1="14.48" y2="14.47"/><line x1="8.12" x2="4" y1="8.12" y2="4"/></svg>
  ),
  Languages: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2v3"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  GitBranch: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="6" y1="3" y2="21"/><path d="M6 3v18"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
  ),
  Timer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
  ),
  MessageCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  ),
}

// Category colors
const categoryColors: Record<NodeType, string> = {
  trigger: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
  action: 'bg-green-500/20 border-green-500/40 text-green-400',
  ai: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
  logic: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  notification: 'bg-red-500/20 border-red-500/40 text-red-400',
}

// Custom Node Component
function WorkflowNode({ data, selected }: { data: any; selected: boolean }) {
  const IconComponent = iconMap[data.icon] || iconMap.Send
  const colorClass = categoryColors[data.nodeType as NodeType] || categoryColors.action
  
  return (
    <div className={`
      relative min-w-[200px] rounded-xl border-2 transition-all duration-200
      ${selected ? 'border-white shadow-lg shadow-white/10 scale-105' : 'border-white/10'}
      ${colorClass}
      bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm
    `}>
      {/* Connection handles */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border-2 border-white/40" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 border-2 border-white/40" />
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            p-2 rounded-lg bg-white/10 flex-shrink-0
            ${data.nodeType === 'trigger' ? 'text-blue-400' : ''}
            ${data.nodeType === 'action' ? 'text-green-400' : ''}
            ${data.nodeType === 'ai' ? 'text-purple-400' : ''}
            ${data.nodeType === 'logic' ? 'text-orange-400' : ''}
            ${data.nodeType === 'notification' ? 'text-red-400' : ''}
          `}>
            <IconComponent />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{data.label}</h3>
            <p className="text-xs text-white/60 mt-1 line-clamp-2">{data.description}</p>
          </div>
        </div>
        
        {/* Edit Button */}
        <button
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            data.onEdit?.(data)
          }}
        >
          <Edit3 className="w-3 h-3" />
          Edit
        </button>
      </div>
    </div>
  )
}

// Node types
const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
}

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'workflowNode',
    position: { x: 100, y: 100 },
    data: { 
      label: 'When email arrives', 
      description: 'Watch for new emails in your inbox',
      icon: 'Mail',
      nodeType: 'trigger',
      onEdit: () => {}
    },
  },
]

// Draggable sidebar item
function SidebarItem({ template }: { template: NodeTemplate }) {
  const IconComponent = iconMap[template.icon] || iconMap.Send
  const colorClass = categoryColors[template.type]
  
  const onDragStart = (event: React.DragEvent, nodeTemplate: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeTemplate))
    event.dataTransfer.effectAllowed = 'move'
  }
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, template)}
      className={`
        p-3 rounded-xl border cursor-grab active:cursor-grabbing
        bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10
        transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
        ${colorClass}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/10 flex-shrink-0">
          <IconComponent />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm">{template.friendlyName}</h4>
          <p className="text-xs text-white/50 mt-1 line-clamp-2">{template.description}</p>
        </div>
      </div>
    </div>
  )
}

// Category section in sidebar
function CategorySection({ 
  type, 
  label, 
  templates,
  isExpanded,
  onToggle 
}: { 
  type: NodeType
  label: string
  templates: NodeTemplate[]
  isExpanded: boolean
  onToggle: () => void
}) {
  const colorClass = categoryColors[type]
  
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${colorClass.split(' ')[0].replace('bg-', 'bg-').replace('/20', '')}`} />
          <span className="font-medium text-white/80">{label}</span>
          <span className="text-xs text-white/40">({templates.length})</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-white/40" />
        ) : (
          <ChevronRight className="w-4 h-4 text-white/40" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {templates.map((template) => (
                <SidebarItem key={template.id} template={template} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main workflow canvas component
function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    trigger: true,
    action: true,
    ai: true,
    logic: true,
    notification: true,
  })
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Group templates by type
  const templatesByType = useMemo(() => {
    const grouped: Record<string, NodeTemplate[]> = {}
    nodeTemplates.forEach((template) => {
      if (!grouped[template.type]) {
        grouped[template.type] = []
      }
      grouped[template.type].push(template)
    })
    return grouped
  }, [])
  
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return
      const newEdge: Edge = {
        id: `edge_${Date.now()}`,
        source: params.source,
        target: params.target,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#fff', strokeWidth: 2 }
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])
  
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      
      const templateData = event.dataTransfer.getData('application/reactflow')
      if (!templateData) return
      
      const template: NodeTemplate = JSON.parse(templateData)
      
      const position = {
        x: event.clientX - 350, // Offset for sidebar
        y: event.clientY - 50,
      }
      
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: 'workflowNode',
        position,
        data: {
          label: template.friendlyName,
          description: template.description,
          icon: template.icon,
          nodeType: template.type,
          onEdit: (nodeData: any) => {
            setSelectedNode(nodes.find(n => n.data === nodeData) || null)
          }
        },
      }
      
      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes, nodes],
  )
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])
  
  const onNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }, [setNodes, setEdges])
  
  const toggleCategory = (type: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }
  
  const handleSave = () => {
    console.log('Saving workflow:', { nodes, edges })
    alert('Workflow saved! Check console for data.')
  }
  
  const handleRun = () => {
    console.log('Running workflow:', { nodes, edges })
    alert('Workflow started! Check console for data.')
  }

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-black/40 border-r border-white/10 overflow-hidden"
          >
            <div className="w-[300px] h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Add Steps</h2>
                <p className="text-sm text-white/50 mt-1">Drag steps to the canvas</p>
              </div>
              
              {/* Categories */}
              <div className="flex-1 overflow-y-auto">
                {Object.entries(NODE_CATEGORIES).map(([type, { label }]) => (
                  <CategorySection
                    key={type}
                    type={type as NodeType}
                    label={label}
                    templates={templatesByType[type] || []}
                    isExpanded={expandedCategories[type]}
                    onToggle={() => toggleCategory(type)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Canvas */}
      <div className="flex-1 h-full relative">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <Plus className={`w-5 h-5 transition-transform ${isSidebarOpen ? 'rotate-45' : ''}`} />
          </button>
          
          <div className="h-6 w-px bg-white/20" />
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run
          </button>
          
          {selectedNode && (
            <button
              onClick={() => onNodeDelete(selectedNode.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
        
        {/* React Flow Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          defaultEdgeOptions={{
            style: { stroke: '#fff', strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.1)" />
          <Controls className="!bg-white/10 !border-white/20 !rounded-lg overflow-hidden" />
          <MiniMap 
            nodeColor={(node: Node) => {
              const type = node.data?.nodeType as NodeType
              const colors: Record<NodeType, string> = {
                trigger: '#3b82f6',
                action: '#22c55e',
                ai: '#a855f7',
                logic: '#f97316',
                notification: '#ef4444',
              }
              return colors[type] || '#6b7280'
            }}
            maskColor="rgba(0,0,0,0.5)"
            className="!bg-white/5 !border-white/20 !rounded-lg"
          />
        </ReactFlow>
        
        {/* Zoom Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-white/10 text-white/60 text-xs">
            {nodes.length} steps • {edges.length} connections
          </div>
        </div>
        
        {/* Help Text */}
        {nodes.length === 1 && edges.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-8 rounded-2xl bg-white/5 border border-white/10 max-w-md">
              <h3 className="text-xl font-semibold text-white mb-2">Build your automation</h3>
              <p className="text-white/60">
                Drag steps from the sidebar to create your workflow. Connect them together to define how data flows.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main page component
export default function WorkflowBuilderPage() {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  )
}
