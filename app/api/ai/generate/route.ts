import { NextRequest, NextResponse } from 'next/server'

// AI-powered workflow generation from natural language prompts
// In production, this would call an LLM API (OpenAI, Anthropic, etc.)

interface WorkflowNode {
  id: string
  type: string
  label: string
  friendlyName: string
  config?: Record<string, any>
}

interface GeneratedWorkflow {
  name: string
  description: string
  nodes: WorkflowNode[]
  edges: Array<{ source: string; target: string }>
  explanation: string
}

// Keyword patterns for detecting automation components
const triggerPatterns = [
  { keywords: ['gmail', 'email', 'receive'], type: 'trigger', label: 'Gmail', friendlyName: 'When email arrives' },
  { keywords: ['form', 'submitted', 'form submission'], type: 'trigger', label: 'Google Forms', friendlyName: 'When form is submitted' },
  { keywords: ['schedule', 'every morning', 'daily', 'cron'], type: 'trigger', label: 'Schedule', friendlyName: 'Scheduled trigger' },
  { keywords: ['twitter', 'x.com', 'tweet', 'mention'], type: 'trigger', label: 'Twitter', friendlyName: 'Twitter mentions' },
  { keywords: ['webhook', 'http', 'api call'], type: 'trigger', label: 'Webhook', friendlyName: 'Webhook trigger' },
  { keywords: ['slack', 'message'], type: 'trigger', label: 'Slack', friendlyName: 'Slack message received' },
]

const actionPatterns = [
  { keywords: ['save', 'drive', 'google drive'], type: 'action', label: 'Google Drive', friendlyName: 'Save to Drive' },
  { keywords: ['sheets', 'spreadsheet', 'google sheets'], type: 'action', label: 'Google Sheets', friendlyName: 'Add to Google Sheets' },
  { keywords: ['send email', 'email', 'gmail send'], type: 'action', label: 'Gmail', friendlyName: 'Send email' },
  { keywords: ['slack', 'slack channel'], type: 'action', label: 'Slack', friendlyName: 'Send to Slack' },
  { keywords: ['telegram'], type: 'action', label: 'Telegram', friendlyName: 'Send Telegram message' },
  { keywords: ['discord'], type: 'action', label: 'Discord', friendlyName: 'Send Discord message' },
  { keywords: ['weather'], type: 'action', label: 'Weather', friendlyName: 'Fetch weather data' },
  { keywords: ['notify', 'notification'], type: 'notification', label: 'Notification', friendlyName: 'Send notification' },
]

function detectComponents(prompt: string): { triggers: typeof triggerPatterns, actions: typeof actionPatterns } {
  const lowerPrompt = prompt.toLowerCase()
  
  const detectedTriggers = triggerPatterns.filter(t => 
    t.keywords.some(k => lowerPrompt.includes(k))
  )
  
  const detectedActions = actionPatterns.filter(a => 
    a.keywords.some(k => lowerPrompt.includes(k))
  )
  
  return { triggers: detectedTriggers, actions: detectedActions }
}

function generateWorkflowFromPrompt(prompt: string): GeneratedWorkflow {
  const { triggers, actions } = detectComponents(prompt)
  
  const nodes: WorkflowNode[] = []
  const edges: Array<{ source: string; target: string }> = []
  
  // Add trigger node
  let nodeId = 1
  if (triggers.length > 0) {
    nodes.push({
      id: String(nodeId),
      type: triggers[0].type,
      label: triggers[0].label,
      friendlyName: triggers[0].friendlyName,
    })
  } else {
    // Default trigger
    nodes.push({
      id: String(nodeId),
      type: 'trigger',
      label: 'Manual',
      friendlyName: 'Manual trigger',
    })
  }
  
  // Add action nodes
  let prevId = nodeId
  actions.forEach((action, index) => {
    nodeId++
    nodes.push({
      id: String(nodeId),
      type: action.type,
      label: action.label,
      friendlyName: action.friendlyName,
    })
    edges.push({
      source: String(prevId),
      target: String(nodeId),
    })
    prevId = nodeId
  })
  
  // Generate explanation
  const triggerText = triggers.length > 0 
    ? triggers.map(t => t.friendlyName).join(', ')
    : 'manual trigger'
  
  const actionText = actions.length > 0
    ? actions.map(a => a.friendlyName).join(', ')
    : 'do something'
  
  const explanation = `I've created a workflow with ${nodes.length} step${nodes.length > 1 ? 's' : ''}: 1) ${triggerText}, ${actions.map((a, i) => `${i + 2}) ${a.friendlyName}`).join(', ')}.`
  
  return {
    name: 'AI Generated Automation',
    description: prompt,
    nodes,
    edges,
    explanation,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // In production, this would call an LLM API:
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4',
    //     messages: [
    //       { role: 'system', content: 'You are a workflow automation expert. Convert natural language into n8n workflow JSON.' },
    //       { role: 'user', content: prompt }
    //     ],
    //   }),
    // })
    
    // For now, use rule-based generation
    const workflow = generateWorkflowFromPrompt(prompt)

    return NextResponse.json({
      success: true,
      workflow,
    })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate workflow' },
      { status: 500 }
    )
  }
}
