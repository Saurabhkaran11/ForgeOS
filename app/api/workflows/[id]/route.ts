import { NextResponse } from 'next/server';
import { WorkflowStore } from '@/lib/runtime/workflow-store';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const workflow = WorkflowStore.getWorkflow(id);
    if (!workflow) {
      return NextResponse.json({ error: `Workflow with id ${id} not found` }, { status: 404 });
    }
    return NextResponse.json(workflow);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
