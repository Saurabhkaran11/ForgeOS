'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, TrendingUp, Target, Award, ListChecks, Lock, HelpCircle, ShieldCheck, Cpu } from 'lucide-react';
import { demoCompany } from '@/lib/demo-data';

export default function ReportPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wfName, setWfName] = useState(demoCompany.name);

  const fetchReport = () => {
    const workflowId = localStorage.getItem('active_workflow_id');
    const url = workflowId ? `/api/report?workflowId=${workflowId}` : '/api/report';
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setReport(data.report);
        setWfName(data.report.companyName || demoCompany.name);
        setLoading(false);
      })
      .catch(() => {
        setReport(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleExportMarkdown = () => {
    if (!report) return;

    const markdownText = `# Strategy Memo: ${wfName}
Generated autonomously by ForgeOS.

## 1. Executive Summary
${report.executiveSummary}

## 2. Problem Statement
${report.problem}

## 3. Target Customer Profile
${report.targetCustomer}

## 4. Market Findings
${report.marketFindings}

## 5. Competitor Matrix
${report.competitors}

## 6. Product Solution
${report.productSolution}

## 7. MVP Feature Spec
${report.mvpFeatures}

## 8. Business Model
${report.businessModel}

## 9. Pricing Hypothesis
${report.pricingHypothesis}

## 10. Technical Architecture
${report.technicalArchitecture}

## 11. Go-To-Market Strategy
${report.gtmStrategy}

## 12. Target Prospects Listings
${report.targetProspects}

## 13. Campaign Outreach Assets
${report.campaignAssets}

## 14. Financial Assumptions
${report.financialAssumptions}

## 15. Key Risk Vectors
${report.keyRisks}

## 16. Human Governance Decisions
${report.governanceDecisions}

## 17. Sponsor Infrastructure Used
${report.sponsorInfrastructure}

## 18. Readiness Score
${report.readinessScore}/100

## 19. Recommended Next Steps
${report.nextSteps}

## 20. Citations & References
${report.citations}
`;

    const blob = new Blob([markdownText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wfName.replace(/\s+/g, '_')}_Strategy_Memo.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center p-12 text-zinc-500 text-sm">
        Checking investor memo status...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
          <Lock className="h-5 w-5 text-indigo-400" />
        </div>
        <h2 className="text-base font-bold text-white mb-2">Investor Memo Locked</h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-normal">
          The final investor deck will unlock automatically as soon as the active GTM cold outreach campaign is approved and evaluated.
        </p>
      </div>
    );
  }

  const sections = [
    { label: '1. Executive Summary', value: report.executiveSummary, icon: Award, color: 'text-indigo-400' },
    { label: '2. Problem Statement', value: report.problem, icon: HelpCircle, color: 'text-rose-400' },
    { label: '3. Target Customer', value: report.targetCustomer, icon: Target, color: 'text-blue-400' },
    { label: '4. Market Findings', value: report.marketFindings, icon: FileText, color: 'text-cyan-400' },
    { label: '5. Competitor Matrix', value: report.competitors, icon: ListChecks, color: 'text-indigo-400' },
    { label: '6. Product Solution', value: report.productSolution, icon: ListChecks, color: 'text-emerald-400' },
    { label: '7. MVP Feature Spec', value: report.mvpFeatures, icon: ListChecks, color: 'text-amber-400' },
    { label: '8. Business Model', value: report.businessModel, icon: TrendingUp, color: 'text-indigo-400' },
    { label: '9. Pricing Hypothesis', value: report.pricingHypothesis, icon: TrendingUp, color: 'text-purple-400' },
    { label: '10. Technical Architecture', value: report.technicalArchitecture, icon: Cpu, color: 'text-indigo-400' },
    { label: '11. Go-to-Market Strategy', value: report.gtmStrategy, icon: Target, color: 'text-indigo-400' },
    { label: '12. Target Prospects', value: report.targetProspects, icon: Target, color: 'text-pink-400' },
    { label: '13. Campaign Outreach Assets', value: report.campaignAssets, icon: FileText, color: 'text-indigo-400' },
    { label: '14. Financial Assumptions', value: report.financialAssumptions, icon: TrendingUp, color: 'text-emerald-400' },
    { label: '15. Key Risk Vectors', value: report.keyRisks, icon: Lock, color: 'text-rose-400' },
    { label: '16. Human Governance Decisions', value: report.governanceDecisions, icon: ShieldCheck, color: 'text-indigo-400' },
    { label: '17. Sponsor Infrastructure Used', value: report.sponsorInfrastructure, icon: Cpu, color: 'text-indigo-400' },
    { label: '18. Company Readiness Score', value: `${report.readinessScore}/100`, icon: Award, color: 'text-amber-400' },
    { label: '19. Recommended Next Steps', value: report.nextSteps, icon: ListChecks, color: 'text-indigo-400' },
    { label: '20. Citations & References', value: report.citations, icon: FileText, color: 'text-indigo-400' },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5" />
            <span>AI Company Strategy Deliverable</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Investor Strategy Memo</h1>
          <p className="text-zinc-500 text-xs mt-1">
            20-Point Strategic Venture Outline Compiled autonomously by ForgeOS Aries CEO.
          </p>
        </div>

        <button
          onClick={handleExportMarkdown}
          className="self-start sm:self-auto inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white px-4 transition-all"
        >
          <Download className="h-4 w-4" />
          Export Strategy Memo (.md)
        </button>
      </div>

      {/* 20-Point Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div 
              key={idx} 
              className="border border-zinc-900 bg-zinc-950/40 rounded-2xl p-6 hover:border-zinc-800 transition-colors"
            >
              <h2 className="text-sm font-bold text-white flex items-center gap-2.5 mb-3">
                <Icon className={`h-4.5 w-4.5 ${section.color}`} />
                {section.label}
              </h2>
              <p className="text-xs md:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap font-normal">
                {section.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
