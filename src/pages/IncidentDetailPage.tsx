import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useIncident, useReport } from '../hooks/useIncidents';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import incidentService from '../services/incidentService';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Activity, ChevronLeft, Calendar, FileText, Search, Play, FileTerminal, BookOpen, Quote, ShieldAlert, Cpu } from 'lucide-react';

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { incident, loading: incidentLoading, error: incidentError } = useIncident(id!);
  const {
    report,
    loading: reportLoading,
    error: reportError,
    refresh: fetchReport,
    setReport,
  } = useReport(id!, incident?.hasReport || false);

  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!id) return;
    setAnalyzing(true);
    try {
      const data = await incidentService.analyzeIncident(id);
      setReport(data);
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('Failed to analyze incident. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityVariant = (severity: string | null) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'outline';
    }
  };

  if (incidentLoading) return <LoadingSpinner message="Loading incident details..." />;
  if (incidentError) return <ErrorMessage message={incidentError} />;
  if (!incident) return <ErrorMessage message="Incident not found" />;

  const hasReportData = !!report;

  return (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col gap-4">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors w-fit">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Incidents
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[30px] font-bold tracking-tight text-gray-900 leading-tight">{incident.title}</h1>
              {report?.severity && (
                <Badge variant={getSeverityVariant(report.severity) as any} className="text-sm px-3 py-1">
                  {report.severity}
                </Badge>
              )}
            </div>
            <div className="flex items-center mt-3 text-sm text-gray-500 gap-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(incident.createdAt).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <FileText className="h-4 w-4" />
                ID: {incident.id.substring(0, 8)}
              </span>
            </div>
          </div>
          <div>
            {!hasReportData ? (
              <Button onClick={handleAnalyze} disabled={analyzing || reportLoading} size="lg" className="w-full md:w-auto font-semibold">
                {analyzing ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run AI Analysis
                  </>
                )}
              </Button>
            ) : (
              <Button variant="outline" onClick={handleAnalyze} disabled={analyzing} size="lg" className="w-full md:w-auto font-semibold bg-white text-gray-700">
                {analyzing ? (
                  <>
                    <Activity className="mr-2 h-4 w-4 animate-spin" />
                    Re-analyzing...
                  </>
                ) : (
                  <>
                    <Activity className="mr-2 h-4 w-4 text-blue-600" />
                    Re-run Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {report?.tags && report.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {report.tags.map(tag => (
              <Badge key={tag} variant="outline" className="bg-white">{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      {reportLoading && !analyzing && <LoadingSpinner message="Fetching investigation report..." />}
      {reportError && <ErrorMessage message={reportError} onRetry={fetchReport} />}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-6">
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-8">
          {hasReportData ? (
            <>
              {/* Executive Summary */}
              <Card className="border-blue-100 bg-blue-50/50 hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <ShieldAlert className="h-5 w-5 text-blue-600" />
                    Executive Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-[14px]">
                    {report.executiveSummary}
                  </p>
                  <div className="mt-6 pt-5 border-t border-blue-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Root Cause</span>
                      <span className="text-sm font-medium text-gray-900">{report.rootCause}</span>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">AI Confidence</span>
                      <Badge variant={report.confidenceScore > 80 ? 'default' : 'outline'} className="px-3">
                        {report.confidenceScore}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engineering Summary & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-gray-500" />
                      Engineering Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {report.engineeringSummary}
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {report.recommendations?.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Badge variant={getSeverityVariant(rec.priority) as any} className="text-[10px] mt-0.5">
                            {rec.priority}
                          </Badge>
                          <span className="text-sm text-gray-700 font-medium leading-snug">{rec.action}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Investigation Timeline */}
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle>Investigation Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                    {report.timeline?.map((event, idx) => (
                      <div key={idx} className="pl-6 relative">
                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 ${event.type === 'ERROR' || event.type === 'FAILURE' ? 'border-red-500' : 'border-blue-500'}`} />
                        <p className="text-xs font-semibold text-gray-500 mb-1">{new Date(event.timestamp).toLocaleString()}</p>
                        <p className="text-sm font-medium text-gray-900">{event.event}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center min-h-[400px] border-dashed border-2">
              <Search className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">No Investigation Found</h3>
              <p className="text-gray-500 mt-2 max-w-sm">
                Run the AI analysis to automatically determine the root cause, severity, and recommendations from the telemetry data.
              </p>
              <Button className="mt-8" onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
              </Button>
            </Card>
          )}

          {/* Raw Telemetry */}
          <Card className="hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTerminal className="h-5 w-5 text-gray-500" />
                Raw Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Application Logs</h4>
                  <div className="rounded-lg bg-[#0d1117] border border-gray-800 p-4 overflow-x-auto">
                    <pre className="text-[13px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed max-h-96">
                      {incident.logs || 'No logs provided.'}
                    </pre>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Deployment Changes</h4>
                  <div className="rounded-lg bg-[#0d1117] border border-gray-800 p-4 overflow-x-auto">
                    <pre className="text-[13px] font-mono text-gray-300 whitespace-pre-wrap leading-relaxed max-h-40">
                      {incident.deploymentInfo || 'No deployment info provided.'}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Sidebar) */}
        {hasReportData && (
          <div className="space-y-8">
            {/* Historical Intelligence */}
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle>Historical Intelligence</CardTitle>
                <CardDescription>Similar past incidents</CardDescription>
              </CardHeader>
              <CardContent>
                {report.similarIncidents && report.similarIncidents.length > 0 ? (
                  <ul className="space-y-5">
                    {report.similarIncidents.map((sim, idx) => (
                      <li key={idx} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-medium text-gray-500">ID: {sim.incidentId.substring(0,8)}</span>
                          <Badge variant="outline" className="text-[10px] bg-white text-gray-600 font-semibold">{sim.similarity} MATCH</Badge>
                        </div>
                        <p className="text-sm text-gray-700 leading-snug">{sim.reason}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-center border border-gray-100">
                    No similar incidents found in recent history.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Knowledge Sources (RAG) */}
            {report.retrievedKnowledge && report.retrievedKnowledge.length > 0 && (
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Knowledge Sources
                  </CardTitle>
                  <CardDescription>Documents used in this analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {report.retrievedKnowledge.map((source, idx) => (
                      <li key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">{source.documentTitle}</span>
                          <Badge variant="outline" className="text-[10px] bg-white font-medium">{source.documentType}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{source.content}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* AI Citations */}
            {report.citations && report.citations.length > 0 && (
              <Card className="hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-purple-500" />
                    AI Citations
                  </CardTitle>
                  <CardDescription>Direct evidence from knowledge base</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {report.citations.map((cit, idx) => (
                      <li key={idx} className="bg-purple-50/50 p-4 rounded-lg border border-purple-100 border-l-4 border-l-purple-500">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-purple-700">{cit.documentTitle}</span>
                        </div>
                        <p className="text-sm text-gray-800 italic mb-3 font-serif leading-relaxed">"{cit.excerpt}"</p>
                        <p className="text-xs text-gray-600 bg-white p-2 rounded border border-purple-100 font-medium">
                          {cit.relevance}
                        </p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Evidence Explorer */}
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle>Evidence Extracted</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {report.evidence?.map((item, idx) => (
                    <li key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={getSeverityVariant(item.severity) as any} className="text-[10px] py-0 px-1.5 h-5">
                          {item.severity}
                        </Badge>
                        <span className="text-xs text-gray-500 font-medium">
                          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : ''}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-800 font-mono bg-white p-2 border border-gray-100 rounded leading-relaxed break-words">{item.text}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
