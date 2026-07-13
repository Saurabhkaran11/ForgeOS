import { NextResponse } from 'next/server';
import { WorkflowStore } from '@/lib/runtime/workflow-store';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    let workflowId = url.searchParams.get('workflowId');
    
    if (!workflowId) {
      const activeWorkflow = WorkflowStore.getActiveWorkflow();
      if (!activeWorkflow) {
        return NextResponse.json({ error: 'No active workflow found' }, { status: 404 });
      }
      workflowId = activeWorkflow.id;
    }

    const report = WorkflowStore.getReport(workflowId);
    if (!report) {
      return NextResponse.json({ error: `Report not found for workflow ${workflowId}` }, { status: 404 });
    }

    return NextResponse.json({
      workflowId,
      report,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
