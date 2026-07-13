import { NextResponse } from 'next/server';
import { TraceStore } from '@/lib/runtime/trace-store';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get('workflowId') || undefined;
    const traces = TraceStore.getTraces(workflowId);
    return NextResponse.json(traces);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
