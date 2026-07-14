import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, Clock3, FileText, Info, Lightbulb, Sparkles, Users } from 'lucide-react';
import { Task } from '../lib/types';

interface TaskTimelineProps {
  tasks: Task[];
  isPausedForApproval?: boolean;
}

type TaskStatus = Task['status'];

const statusStyles: Record<TaskStatus, { label: string; chip: string; dot: string; icon: React.ReactNode }> = {
  pending: {
    label: 'Queued',
    chip: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    dot: 'bg-zinc-500',
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  in_progress: {
    label: 'Working',
    chip: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400 animate-pulse',
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
  completed: {
    label: 'Done',
    chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  failed: {
    label: 'Needs attention',
    chip: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
};

const phaseStories = [
  {
    title: 'Set the direction',
    plainEnglish: 'Turns the business goal into a clear operating plan for the team.',
    whyItMatters: 'Everyone starts from the same destination, so the rest of the work stays aligned.',
    audienceHint: 'Best for users who want to see how the project begins.',
  },
  {
    title: 'Learn the market',
    plainEnglish: 'Checks what is already happening in the market and who else is competing.',
    whyItMatters: 'You can compare the idea against real companies instead of guessing.',
    audienceHint: 'This is where the app proves the market research is real.',
  },
  {
    title: 'Check the facts',
    plainEnglish: 'Verifies the research so the next steps are based on trustworthy information.',
    whyItMatters: 'It reduces the chance of building on weak or outdated sources.',
    audienceHint: 'Useful for users who care about confidence and accuracy.',
  },
  {
    title: 'Shape the product',
    plainEnglish: 'Turns the research into a simple product plan that people can actually use.',
    whyItMatters: 'This bridges the gap between market evidence and a practical offering.',
    audienceHint: 'A good place to understand what gets built first.',
  },
  {
    title: 'Find likely customers',
    plainEnglish: 'Looks for real organizations that could benefit from the idea.',
    whyItMatters: 'It gives the team a starting list for outreach instead of inventing prospects.',
    audienceHint: 'Helpful for non-technical users who want to know who the product is for.',
  },
  {
    title: 'Prepare the outreach',
    plainEnglish: 'Drafts a message that explains the value in simple language.',
    whyItMatters: 'This is what the team would send after a human reviews it.',
    audienceHint: 'Shows how the app moves from planning to real-world action.',
  },
  {
    title: 'Run safety checks',
    plainEnglish: 'Makes sure the outreach is safe, on-brand, and ready for review.',
    whyItMatters: 'A human can approve or stop the next step before anything goes out.',
    audienceHint: 'This is the point where control comes back to the user.',
  },
  {
    title: 'Review the result',
    plainEnglish: 'Checks the final workflow and summarizes how strong the plan looks.',
    whyItMatters: 'It gives a simple confidence score before the project is considered complete.',
    audienceHint: 'Useful as a final reading layer for non-coders.',
  },
];

function safeParseOutput(output?: string) {
  if (!output) return null;

  try {
    return JSON.parse(output);
  } catch {
    return { summary: output };
  }
}

function getPhaseStory(index: number, task: Task) {
  const story = phaseStories[index] ?? {
    title: 'Work in progress',
    plainEnglish: 'The system is still moving through the requested workflow.',
    whyItMatters: 'This step keeps the project moving toward the final result.',
    audienceHint: 'Useful as a simple progress marker.',
  };

  const roleLabel = task.agentName.replace(/\s*\(.*\)$/, '');

  return {
    ...story,
    title: story.title,
    roleLabel,
  };
}

function summarizeStructuredOutput(parsed: any) {
  if (!parsed?.output || typeof parsed.output !== 'object') {
    return [];
  }

  const output = parsed.output;
  const bullets: string[] = [];

  if (Array.isArray(output.competitors) && output.competitors.length > 0) {
    bullets.push(`${output.competitors.length} verified competitors found`);
  }

  if (Array.isArray(output.researchSources) && output.researchSources.length > 0) {
    bullets.push(`${output.researchSources.length} live sources checked`);
  }

  if (output.idealCustomerProfile) {
    bullets.push('A customer profile was drafted');
  }

  if (Array.isArray(output.features) && output.features.length > 0) {
    bullets.push(`${output.features.length} MVP ideas captured`);
  }

  if (Array.isArray(output.leads) && output.leads.length > 0) {
    bullets.push(`${output.leads.length} target leads discovered`);
  }

  if (output.body) {
    bullets.push('An outreach message draft was prepared');
  }

  if (output.riskLevel) {
    bullets.push(`Risk level noted as ${String(output.riskLevel).toLowerCase()}`);
  }

  return bullets;
}

function getPlainEnglishSummary(task: Task, parsed: any) {
  if (parsed?.summary && typeof parsed.summary === 'string') {
    return parsed.summary;
  }

  if (task.output) {
    return task.output;
  }

  return task.description;
}

function getTechnicalDetails(parsed: any) {
  if (!parsed?.output || typeof parsed.output !== 'object') {
    return null;
  }

  return JSON.stringify(parsed.output, null, 2);
}

export function TaskTimeline({ tasks, isPausedForApproval = false }: TaskTimelineProps) {
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const working = tasks.filter((task) => task.status === 'in_progress').length;
  const blocked = tasks.filter((task) => task.status === 'failed').length;

  const latestTask = tasks[tasks.length - 1];
  const latestStory = latestTask ? getPhaseStory(tasks.length - 1, latestTask) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-2xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Progress story
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">How the work is unfolding</h3>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-400">
                We translate each agent step into plain language so anyone can follow the journey without needing to know the internal code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:min-w-[220px]">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">Done</div>
              <div className="mt-1 text-lg font-semibold text-white">{completed}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">Working</div>
              <div className="mt-1 text-lg font-semibold text-white">{working}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">Alerts</div>
              <div className="mt-1 text-lg font-semibold text-white">{blocked}</div>
            </div>
          </div>
        </div>

        {latestStory && (
          <div className="mt-4 rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-2xs font-semibold text-zinc-300">
                <Info className="h-3.5 w-3.5" />
                Current step
              </span>
              <span className="text-xs font-semibold text-white">{latestStory.title}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-300">
              {latestStory.plainEnglish}
            </p>
            <p className="mt-2 text-2xs leading-relaxed text-zinc-500">
              {latestStory.whyItMatters}
            </p>
          </div>
        )}

        {isPausedForApproval && (
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <div>
                <p className="text-xs font-semibold text-amber-100">Waiting for your review</p>
                <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
                  The workflow reached a safe stopping point. Nothing external will be sent until a human approves the next step.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-l border-zinc-800/80 pl-5">
        {tasks.map((task, idx) => {
          const config = statusStyles[task.status];
          const story = getPhaseStory(idx, task);
          const parsed = safeParseOutput(task.output);
          const plainSummary = getPlainEnglishSummary(task, parsed);
          const structuredBullets = summarizeStructuredOutput(parsed);
          const technicalDetails = getTechnicalDetails(parsed);
          const isCurrent = idx === tasks.length - 1 && task.status !== 'completed';

          return (
            <article key={task.id} className="relative pb-2">
              <span className={`absolute -left-[29px] top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-zinc-900 bg-zinc-950 ${config.dot}`}>
                <span className="sr-only">{config.label}</span>
              </span>

              <div className={`rounded-2xl border p-4 sm:p-5 transition-colors ${isCurrent ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-zinc-800 bg-zinc-950/50'}`}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-semibold uppercase tracking-wider text-zinc-200 border-zinc-700 bg-zinc-900/70">
                        Step {idx + 1}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-semibold ${config.chip}`}>
                        {config.icon}
                        {config.label}
                      </span>
                      <span className="text-2xs text-zinc-500">{task.timestamp}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white">{story.title}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-2xs text-zinc-500">
                        <span>{story.roleLabel}</span>
                        <span className="text-zinc-700">•</span>
                        <span>{story.audienceHint}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 lg:max-w-[280px]">
                    <div className="text-2xs uppercase tracking-wider text-zinc-500">What the step did</div>
                    <p className="mt-1 leading-relaxed">{story.whyItMatters}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                    <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-zinc-500">
                      <FileText className="h-3.5 w-3.5" />
                      Plain-English summary
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">{plainSummary}</p>
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                    <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-zinc-500">
                      <Lightbulb className="h-3.5 w-3.5" />
                      Why a non-technical user should care
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">{story.plainEnglish}</p>
                  </div>
                </div>

                {structuredBullets.length > 0 && (
                  <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                    <div className="flex items-center gap-2 text-2xs uppercase tracking-wider text-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Key takeaways
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-emerald-50/90">
                      {structuredBullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-300" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <details className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/80">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-medium text-zinc-200">
                    <span className="inline-flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      Show technical details
                    </span>
                    <ChevronDown className="h-4 w-4 text-zinc-500" />
                  </summary>
                  <div className="border-t border-zinc-800 px-4 py-3">
                    {technicalDetails ? (
                      <pre className="whitespace-pre-wrap break-words rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-300">
                        {technicalDetails}
                      </pre>
                    ) : (
                      <p className="text-xs leading-relaxed text-zinc-500">
                        No structured output was saved for this step yet.
                      </p>
                    )}
                  </div>
                </details>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
