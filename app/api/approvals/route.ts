import { NextResponse } from 'next/server';
import { WorkflowStore } from '@/lib/runtime/workflow-store';

export async function GET() {
  try {
    const approvals = WorkflowStore.getApprovals();
    return NextResponse.json(approvals);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
