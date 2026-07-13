import { NextResponse } from 'next/server';
import { WorkflowStore } from '@/lib/runtime/workflow-store';
import { Orchestrator } from '@/lib/runtime/orchestrator';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const approvals = WorkflowStore.getApprovals();
    const approval = approvals.find(a => a.id === id);
    
    if (!approval) {
      return NextResponse.json({ error: `Approval ${id} not found` }, { status: 404 });
    }

    approval.status = 'rejected';
    WorkflowStore.saveApproval(approval);

    // Resume the orchestrator workflow loop
    Orchestrator.resumeWorkflowAfterApproval(approval.workflowId, 'rejected').catch(err => {
      console.error('Failed to resume workflow:', err);
    });

    return NextResponse.json({ message: 'Approval rejected, workflow resuming.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
