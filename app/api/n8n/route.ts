import { NextRequest, NextResponse } from 'next/server'

// Environment variables (in production, use process.env)
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678'
const N8N_API_KEY = process.env.N8N_API_KEY || 'your-n8n-api-key'

// Mock database for workflow metadata
const workflows: Map<string, any> = new Map()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'list':
        // Fetch all workflows from n8n
        const response = await fetch(`${N8N_BASE_URL}/rest/workflows`, {
          headers: {
            'X-N8N-API-KEY': N8N_API_KEY,
          },
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch workflows from n8n')
        }
        
        const workflowsData = await response.json()
        return NextResponse.json(workflowsData)
        
      case 'executions':
        // Fetch execution logs
        const execResponse = await fetch(`${N8N_BASE_URL}/rest/executions`, {
          headers: {
            'X-N8N-API-KEY': N8N_API_KEY,
          },
        })
        
        if (!execResponse.ok) {
          throw new Error('Failed to fetch executions')
        }
        
        const executionsData = await execResponse.json()
        return NextResponse.json(executionsData)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('n8n API error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to n8n' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  try {
    const body = await request.json()

    switch (action) {
      case 'create':
        // Convert AI-generated workflow to n8n format
        const n8nWorkflow = convertToN8nFormat(body)
        
        // Create workflow in n8n
        const createResponse = await fetch(`${N8N_BASE_URL}/rest/workflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': N8N_API_KEY,
          },
          body: JSON.stringify(n8nWorkflow),
        })
        
        if (!createResponse.ok) {
          throw new Error('Failed to create workflow in n8n')
        }
        
        const createdWorkflow = await createResponse.json()
        
        // Store metadata in our database
        const workflowId = createdWorkflow.id
        workflows.set(workflowId, {
          id: workflowId,
          name: body.name,
          description: body.description,
          n8nWorkflowId: workflowId,
          createdAt: new Date().toISOString(),
          userId: body.userId,
        })
        
        return NextResponse.json(createdWorkflow)
        
      case 'activate':
        // Activate workflow
        const activateResponse = await fetch(
          `${N8N_BASE_URL}/rest/workflows/${body.workflowId}/activate`,
          {
            method: 'POST',
            headers: {
              'X-N8N-API-KEY': N8N_API_KEY,
            },
          }
        )
        
        if (!activateResponse.ok) {
          throw new Error('Failed to activate workflow')
        }
        
        return NextResponse.json({ success: true, status: 'active' })
        
      case 'deactivate':
        // Deactivate workflow
        const deactivateResponse = await fetch(
          `${N8N_BASE_URL}/rest/workflows/${body.workflowId}/deactivate`,
          {
            method: 'POST',
            headers: {
              'X-N8N-API-KEY': N8N_API_KEY,
            },
          }
        )
        
        if (!deactivateResponse.ok) {
          throw new Error('Failed to deactivate workflow')
        }
        
        return NextResponse.json({ success: true, status: 'inactive' })
        
      case 'execute':
        // Trigger manual execution
        const executeResponse = await fetch(
          `${N8N_BASE_URL}/rest/workflows/${body.workflowId}/execute`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-N8N-API-KEY': N8N_API_KEY,
            },
            body: JSON.stringify(body.data || {}),
          }
        )
        
        if (!executeResponse.ok) {
          throw new Error('Failed to execute workflow')
        }
        
        const executionResult = await executeResponse.json()
        return NextResponse.json(executionResult)
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('n8n API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update workflow in n8n
    const updateResponse = await fetch(
      `${N8N_BASE_URL}/rest/workflows/${body.workflowId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': N8N_API_KEY,
        },
        body: JSON.stringify(convertToN8nFormat(body.workflow)),
      }
    )
    
    if (!updateResponse.ok) {
      throw new Error('Failed to update workflow')
    }
    
    const updatedWorkflow = await updateResponse.json()
    return NextResponse.json(updatedWorkflow)
  } catch (error) {
    console.error('n8n API error:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workflowId = searchParams.get('id')

  if (!workflowId) {
    return NextResponse.json({ error: 'Workflow ID required' }, { status: 400 })
  }

  try {
    // Delete from n8n
    const deleteResponse = await fetch(
      `${N8N_BASE_URL}/rest/workflows/${workflowId}`,
      {
        method: 'DELETE',
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
        },
      }
    )
    
    if (!deleteResponse.ok) {
      throw new Error('Failed to delete workflow from n8n')
    }
    
    // Remove from our metadata store
    workflows.delete(workflowId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('n8n API error:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}

// Helper function to convert FlowMind workflow format to n8n format
function convertToN8nFormat(workflow: any) {
  return {
    name: workflow.name || 'Untitled Workflow',
    active: false,
    nodes: workflow.nodes?.map((node: any) => ({
      id: node.id,
      name: node.friendlyName || node.name,
      type: getN8nNodeType(node.type),
      typeVersion: 1,
      position: [node.position?.x || 0, node.position?.y || 0],
      parameters: node.config || {},
      credentials: node.credentials ? {
        [getN8nNodeType(node.type)]: {
          id: node.credentials,
        },
      } : undefined,
    })) || [],
    connections: workflow.edges?.map((edge: any) => ({
      source: edge.source,
      target: edge.target,
      sourceOutput: 0,
      targetInput: 0,
    })) || [],
  }
}

// Map FlowMind node types to n8n node types
function getN8nNodeType(type: string): string {
  const nodeMap: Record<string, string> = {
    trigger: 'n8n-nodes-base.webhook',
    action: 'n8n-nodes-base.httpRequest',
    ai: 'n8n-nodes-base.aiAgent',
    logic: 'n8n-nodes-base.if',
    notification: 'n8n-nodes-base.slack',
  }
  return nodeMap[type] || 'n8n-nodes-base.noOp'
}
