import { create } from 'zustand'
import { Workflow, AppSettings, User, Template, Execution, AssistantMessage } from '@/types'

interface AppState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  
  // Settings
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  
  // Workflows
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  setWorkflows: (workflows: Workflow[]) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, data: Partial<Workflow>) => void
  deleteWorkflow: (id: string) => void
  
  // Templates
  templates: Template[]
  setTemplates: (templates: Template[]) => void
  
  // Executions
  executions: Execution[]
  setExecutions: (executions: Execution[]) => void
  
  // AI Builder
  isGenerating: boolean
  setIsGenerating: (isGenerating: boolean) => void
  generatedWorkflow: Partial<Workflow> | null
  setGeneratedWorkflow: (workflow: Partial<Workflow> | null) => void
  
  // Assistant
  assistantOpen: boolean
  setAssistantOpen: (open: boolean) => void
  assistantMessages: AssistantMessage[]
  addAssistantMessage: (message: AssistantMessage) => void
  clearAssistantMessages: () => void
  
  // UI State
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: {
    id: '1',
    email: 'user@flowmind.ai',
    name: 'Demo User',
    plan: 'free',
    createdAt: new Date().toISOString(),
  },
  setUser: (user) => set({ user }),
  
  // Settings
  settings: {
    beginnerMode: true,
    sidebarCollapsed: false,
    theme: 'dark',
  },
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  
  // Workflows
  workflows: [],
  currentWorkflow: null,
  setWorkflows: (workflows) => set({ workflows }),
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  addWorkflow: (workflow) => set((state) => ({
    workflows: [...state.workflows, workflow]
  })),
  updateWorkflow: (id, data) => set((state) => ({
    workflows: state.workflows.map(w => 
      w.id === id ? { ...w, ...data } : w
    )
  })),
  deleteWorkflow: (id) => set((state) => ({
    workflows: state.workflows.filter(w => w.id !== id)
  })),
  
  // Templates
  templates: [],
  setTemplates: (templates) => set({ templates }),
  
  // Executions
  executions: [],
  setExecutions: (executions) => set({ executions }),
  
  // AI Builder
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  generatedWorkflow: null,
  setGeneratedWorkflow: (workflow) => set({ generatedWorkflow: workflow }),
  
  // Assistant
  assistantOpen: false,
  setAssistantOpen: (open) => set({ assistantOpen: open }),
  assistantMessages: [],
  addAssistantMessage: (message) => set((state) => ({
    assistantMessages: [...state.assistantMessages, message]
  })),
  clearAssistantMessages: () => set({ assistantMessages: [] }),
  
  // UI State
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}))
