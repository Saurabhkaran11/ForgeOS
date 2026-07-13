import { NextResponse } from 'next/server';
import { Orchestrator } from '@/lib/runtime/orchestrator';

export async function POST(request: Request) {
  try {
    const { name, goal } = await request.json();
    if (!name || !goal) {
      return NextResponse.json({ error: 'Missing name or goal parameters' }, { status: 400 });
    }

    const workflowId = `wf-${Date.now()}`;
    const state = await Orchestrator.launchCompanyWorkflow(workflowId, name, goal);

    return NextResponse.json(state);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
