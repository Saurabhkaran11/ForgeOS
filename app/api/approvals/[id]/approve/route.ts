import { NextResponse } from 'next/server';
import { WorkflowStore } from '@/lib/runtime/workflow-store';
import { Orchestrator } from '@/lib/runtime/orchestrator';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // The id passed might be like app-wf-123.
    // Let's search approval
    const approvals = WorkflowStore.getApprovals();
    const approval = approvals.find(a => a.id === id);
    
    if (!approval) {
      return NextResponse.json({ error: `Approval ${id} not found` }, { status: 404 });
    }

    approval.status = 'approved';
    WorkflowStore.saveApproval(approval);

    // Resume the orchestrator workflow loop
    Orchestrator.resumeWorkflowAfterApproval(approval.workflowId, 'approved').catch(err => {
      console.error('Failed to resume workflow:', err);
    });

    return NextResponse.json({ message: 'Approval confirmed, workflow resuming.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
