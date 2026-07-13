'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, ChevronRight, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { Approval } from '@/lib/types';

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [activeApprovalId, setActiveApprovalId] = useState<string | null>(null);

  const fetchApprovals = () => {
    fetch('/api/approvals')
      .then(res => res.json())
      .then(data => {
        setApprovals(data);
        setLoading(false);
        // Default select first pending
        const pending = data.find((a: any) => a.status === 'pending');
        if (pending && !activeApprovalId) {
          setActiveApprovalId(pending.id);
        } else if (data.length > 0 && !activeApprovalId) {
          setActiveApprovalId(data[0].id);
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/approvals/${id}/${action}`, {
        method: 'POST',
      });
      if (response.ok) {
        // Optimistically update status
        setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: action === 'approve' ? 'approved' : 'rejected' } : a));
        setTimeout(fetchApprovals, 500);
      } else {
        alert('Action dispatch failed');
      }
    } catch (err: any) {
      alert(`Action error: ${err.message}`);
    }
  };

  const filteredApprovals = approvals.filter(a => a.status === selectedTab);
  const activeApproval = approvals.find(a => a.id === activeApprovalId);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs uppercase tracking-wider">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>BAND Human-in-the-Loop Gate</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Approval Inbox</h1>
        <p className="text-zinc-500 text-xs mt-1">
          Review, edit, and authorize agent actions and campaign deployments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-900 pb-px">
        {(['pending', 'approved', 'rejected'] as const).map(tab => {
          const count = approvals.filter(a => a.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                const first = approvals.find(a => a.status === tab);
                setActiveApprovalId(first?.id || null);
              }}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all capitalize -mb-px ${
                selectedTab === tab
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center p-12 text-zinc-500 text-sm">
          Loading approval inbox...
        </div>
      ) : filteredApprovals.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
          No approvals found in this folder.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List panel */}
          <div className="lg:col-span-1 border border-zinc-900 rounded-xl divide-y divide-zinc-900 bg-zinc-950/20 overflow-hidden">
            {filteredApprovals.map(app => (
              <button
                key={app.id}
                onClick={() => setActiveApprovalId(app.id)}
                className={`w-full text-left p-4 transition-all flex items-start justify-between gap-4 ${
                  activeApprovalId === app.id 
                    ? 'bg-zinc-900/60 border-l-2 border-indigo-500 pl-3.5' 
                    : 'hover:bg-zinc-900/25 border-l-2 border-transparent'
                }`}
              >
                <div>
                  <h3 className="font-semibold text-xs text-white line-clamp-1">{app.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1">Requested by {app.agentName}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 shrink-0 mt-0.5" />
              </button>
            ))}
          </div>

          {/* Details panel */}
          <div className="lg:col-span-2">
            {activeApproval ? (
              <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-6 space-y-6">
                <div>
                  <span className="text-3xs uppercase tracking-wider font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {activeApproval.type.replace('_', ' ')}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-3">{activeApproval.title}</h2>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    {activeApproval.description}
                  </p>
                </div>

                {/* Payload renderer */}
                <div className="border border-zinc-900 bg-zinc-950 rounded-xl p-4 space-y-4">
                  <span className="text-3xs uppercase tracking-wider font-semibold text-zinc-500 block">
                    Execution Payload
                  </span>

                  {activeApproval.type === 'gtm_campaign' && (
                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <span className="text-zinc-500 font-semibold text-3xs uppercase block">Requesting Agent</span>
                          <span className="text-zinc-200 mt-1 font-medium block">{activeApproval.payload.requestingAgent || 'Calypso (GTM)'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-semibold text-3xs uppercase block">Sponsor Integration</span>
                          <span className="text-indigo-400 mt-1 font-mono font-semibold block">{activeApproval.payload.sponsorIntegration || 'BAND / RocketRide'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-semibold text-3xs uppercase block">Risk Level</span>
                          <span className="inline-flex mt-1 rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-3xs font-extrabold text-amber-400">
                            {activeApproval.payload.riskLevel || 'Medium'}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-semibold text-3xs uppercase block">Recipients Count</span>
                          <span className="text-zinc-200 mt-1 font-bold block">{activeApproval.payload.recipientsCount || 5} prospects</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-zinc-500 font-semibold text-3xs uppercase block">Proposed Action</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-900/20 p-2.5 rounded border border-zinc-900/40">
                          {activeApproval.payload.proposedAction || 'Deploy outbound cold email sequences'}
                        </p>
                      </div>

                      <div>
                        <span className="text-zinc-500 font-semibold text-3xs uppercase block">Business Rationale</span>
                        <p className="text-zinc-300 mt-1 leading-relaxed bg-zinc-900/20 p-2.5 rounded border border-zinc-900/40">
                          {activeApproval.payload.businessRationale || 'Standard outreach sequence deployment.'}
                        </p>
                      </div>

                      <div className="border-t border-zinc-900 pt-4 space-y-3 font-mono text-xs">
                        <span className="text-zinc-500 font-semibold text-3xs uppercase block font-sans">Message Preview</span>
                        <div>
                          <span className="text-zinc-600">Subject:</span>
                          <div className="text-zinc-300 mt-0.5 bg-zinc-900/40 p-2 rounded border border-zinc-900/60">{activeApproval.payload.subject}</div>
                        </div>
                        <div>
                          <span className="text-zinc-600">Body:</span>
                          <pre className="text-zinc-300 mt-0.5 bg-zinc-900/40 p-3 rounded border border-zinc-900/60 whitespace-pre-wrap font-sans leading-relaxed">
                            {activeApproval.payload.body}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {activeApproval.status === 'pending' ? (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleAction(activeApproval.id, 'approve')}
                      className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve & Execute via BAND
                    </button>
                    <button
                      onClick={() => handleAction(activeApproval.id, 'reject')}
                      className="inline-flex h-10 px-4 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-rose-500/30 hover:bg-rose-500/5 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-zinc-900/30 border border-zinc-900 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-xs">
                      {activeApproval.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="text-zinc-300">This payload was approved and dispatched to RocketRide execution pipelines.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-rose-400" />
                          <span className="text-zinc-300">This request was rejected. The agent will re-draft and submit again.</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-zinc-500 text-sm">
                Select an approval item from the list to view its details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
