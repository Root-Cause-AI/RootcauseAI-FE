import { useState } from 'react';
import type { InvestigationJob, InvestigationTrace } from '../types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { 
  Bot, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

interface Props {
  job: InvestigationJob | null;
  traces: InvestigationTrace[];
  isPolling?: boolean;
}

export default function AgentInvestigationTraceView({ job, traces, isPolling }: Props) {
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTraceId(prev => (prev === id ? null : id));
  };

  const getStageColor = (stage: string) => {
    switch (stage?.toUpperCase()) {
      case 'LOG_ANALYSIS':
      case 'ANALYZING_LOGS':
        return 'border-purple-500/40 bg-purple-50/50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-350';
      case 'CONTEXT_RETRIEVAL':
      case 'RETRIEVING_CONTEXT':
        return 'border-blue-500/40 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-350';
      case 'HYPOTHESIS_GENERATION':
      case 'FORMULATING_HYPOTHESIS':
      case 'ITERATIVE_INVESTIGATION':
        return 'border-amber-500/40 bg-amber-50/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-350';
      case 'REMEDIATION_PLANNING':
        return 'border-emerald-500/40 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-350';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const stageOrder = [
    { key: 'ANALYZING_LOGS', label: '1. Log Analysis', agent: 'LogAnalyzerAgent' },
    { key: 'RETRIEVING_CONTEXT', label: '2. Context Retrieval', agent: 'ContextRetrieverAgent' },
    { key: 'FORMULATING_HYPOTHESIS', label: '3. Hypothesis Evaluation', agent: 'HypothesisAgent' },
    { key: 'REMEDIATION_PLANNING', label: '4. Remediation Planning', agent: 'RemediationAgent' },
  ];

  const currentStageIndex = stageOrder.findIndex(s => s.key === job?.stage);

  return (
    <Card className="border border-indigo-100 dark:border-indigo-950 shadow-sm overflow-hidden bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                Agentic Investigation Traces
                {isPolling && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    <Activity className="h-3 w-3 animate-spin" />
                    Live Orchestration
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Multi-agent stage execution, tool invocations, and observability metrics
              </CardDescription>
            </div>
          </div>
          {job && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Status:</span>
              <Badge
                variant={
                  job.status === 'COMPLETED' ? 'outline' : job.status === 'FAILED' ? 'critical' : 'medium'
                }
                className={`font-semibold capitalize ${
                  job.status === 'COMPLETED'
                    ? 'border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300'
                    : job.status === 'IN_PROGRESS'
                    ? 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 animate-pulse'
                    : ''
                }`}
              >
                {job.status.replace('_', ' ')}
              </Badge>
              {job.startedAt && (
                <span className="text-gray-400 font-mono text-[11px]">
                  Started {new Date(job.startedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Live Stage Progress Indicator */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {stageOrder.map((step, idx) => {
            const isCompleted = job?.status === 'COMPLETED' || (currentStageIndex > -1 && currentStageIndex > idx);
            const isActive = job?.status === 'IN_PROGRESS' && (job.stage === step.key || (currentStageIndex === -1 && idx === 0));

            return (
              <div
                key={step.key}
                className={`rounded-lg border p-2.5 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                    : isActive
                    ? 'border-indigo-400 bg-indigo-50/70 dark:border-indigo-700 dark:bg-indigo-950/40 ring-1 ring-indigo-400'
                    : 'border-gray-200 bg-gray-50/40 dark:border-gray-800 dark:bg-gray-900/40 opacity-60'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {isCompleted ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : isActive ? (
                    <Activity className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-gray-400 shrink-0" />
                  )}
                  <span className={isActive ? 'text-indigo-900 dark:text-indigo-200 font-bold' : 'text-gray-800 dark:text-gray-200'}>
                    {step.label}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 pl-5 truncate">
                  {step.agent}
                </div>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        {traces.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            <Layers className="h-8 w-8 mx-auto text-gray-400 mb-2 stroke-[1.5]" />
            No execution traces recorded yet. Traces will appear dynamically as agents and tools execute.
          </div>
        ) : (
          <div className="space-y-2.5">
            {traces.map((trace, index) => {
              const isExpanded = expandedTraceId === trace.id;
              const isTool = !!trace.toolName;

              return (
                <div
                  key={trace.id || index}
                  className={`border rounded-lg transition-all overflow-hidden bg-white dark:bg-slate-900 shadow-xs ${
                    isTool ? 'border-amber-200/60 dark:border-amber-900/40' : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(trace.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/40 gap-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 ${
                          isTool
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                        }`}
                      >
                        {isTool ? <Wrench className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                            {isTool ? `Tool: ${trace.toolName}` : trace.agentName || trace.stage}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${getStageColor(
                              trace.stage
                            )}`}
                          >
                            {trace.stage}
                          </span>
                        </div>
                        {trace.summary && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5 max-w-xl">
                            {trace.summary}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-xs text-gray-500">
                      {trace.durationMs !== null && (
                        <span className="flex items-center gap-1 font-mono text-[11px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {trace.durationMs}ms
                        </span>
                      )}
                      {trace.llmLatencyMs && trace.llmLatencyMs > 0 ? (
                        <span className="flex items-center gap-1 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                          <Zap className="h-3 w-3" />
                          LLM: {trace.llmLatencyMs}ms
                        </span>
                      ) : null}
                      <Badge
                        variant={trace.status === 'SUCCESS' ? 'outline' : 'critical'}
                        className={`text-[10px] uppercase font-bold ${
                          trace.status === 'SUCCESS' ? 'text-emerald-700 border-emerald-300' : ''
                        }`}
                      >
                        {trace.status}
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-slate-50/60 dark:bg-slate-950/50 p-3.5 space-y-2.5 text-xs">
                      {trace.toolArguments && (
                        <div>
                          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Terminal className="h-3 w-3" />
                            Tool Arguments
                          </div>
                          <pre className="p-2 rounded bg-gray-900 text-gray-200 font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                            {trace.toolArguments}
                          </pre>
                        </div>
                      )}

                      {trace.outputData && (
                        <div>
                          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Output & Observations
                          </div>
                          <pre className="p-2 rounded bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre-wrap">
                            {trace.outputData}
                          </pre>
                        </div>
                      )}

                      {trace.evidenceReferences && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-600 dark:text-gray-400">Evidence Refs:</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400">{trace.evidenceReferences}</span>
                        </div>
                      )}

                      {trace.errorMessage && (
                        <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                          <span>{trace.errorMessage}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
