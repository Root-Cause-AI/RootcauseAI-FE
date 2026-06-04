import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import incidentService from '../services/incidentService';
import type { ApiError } from '../types';
import { Card, CardContent } from '../components/ui/card';
import { Database, Cpu, Cloud, Globe, AlertTriangle } from 'lucide-react';

const SAMPLE_INCIDENTS = [
  {
    id: 'db-pool',
    icon: Database,
    title: 'Database Pool Exhaustion',
    logs: '2026-06-03T10:15:02.123Z ERROR [HikariPool-1] - Connection is not available, request timed out after 30000ms.\n2026-06-03T10:15:05.456Z WARN [UserService] - Failed to fetch user profile: org.hibernate.exception.JDBCConnectionException: Unable to acquire JDBC Connection',
    deploymentInfo: 'Service: user-service\nVersion: 2.14.0\nDeployed at: 2026-06-03T09:45:00Z\nChanges: Updated HikariCP version to 5.0.1, added new user analytics tracking.',
  },
  {
    id: 'mem-leak',
    icon: Cpu,
    title: 'Memory Leak in Worker Thread',
    logs: 'java.lang.OutOfMemoryError: Java heap space\n\tat java.base/java.util.Arrays.copyOf(Arrays.java:3537)\n\tat java.base/java.lang.AbstractStringBuilder.ensureCapacityInternal(AbstractStringBuilder.java:228)\n\tat java.base/java.lang.StringBuilder.append(StringBuilder.java:180)\n2026-06-03T11:00:20.999Z FATAL [ReportWorker] - Thread terminated due to OOM.',
    deploymentInfo: 'Service: report-worker\nVersion: 1.8.2\nDeployed at: 2026-06-02T14:00:00Z\nChanges: Introduced large batch processing for monthly reports.',
  },
  {
    id: 'dep-reg',
    icon: Cloud,
    title: 'Deployment Regression',
    logs: '2026-06-03T08:30:15.001Z ERROR [StartupListener] - Application failed to start.\nCaused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name \'kafkaConsumer\': Injection of autowired dependencies failed\nCaused by: java.lang.IllegalArgumentException: Topic name cannot be null',
    deploymentInfo: 'Service: notification-service\nVersion: 3.0.0\nDeployed at: 2026-06-03T08:30:00Z\nChanges: Migrated to new Kafka cluster, updated topic configurations in helm charts.',
  },
  {
    id: 'api-fail',
    icon: Globe,
    title: 'Third-Party API Failure',
    logs: '2026-06-03T12:05:10.555Z ERROR [PaymentGateway] - Received 502 Bad Gateway from Stripe API.\n2026-06-03T12:05:12.111Z ERROR [CheckoutService] - Payment processing failed for order #88492. Retrying... (Attempt 3/3)',
    deploymentInfo: 'Service: payment-service\nVersion: 2.5.1\nDeployed at: 2026-06-01T02:00:00Z\nChanges: No recent deployments. Suspected external outage.',
  },
];

export default function CreateIncidentPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [logs, setLogs] = useState('');
  const [deploymentInfo, setDeploymentInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      setError('Investigation Title is required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const incident = await incidentService.createIncident({
        title: title.trim(),
        logs: logs.trim(),
        deploymentInfo: deploymentInfo.trim(),
      });
      // Redirect to the incident detail page
      navigate(`/incidents/${incident.id}`);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to launch investigation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // In a real app, this might save to local storage or a draft API endpoint
    alert('Draft saved to local storage.');
  };

  const loadSample = (sample: typeof SAMPLE_INCIDENTS[0]) => {
    setTitle(sample.title);
    setLogs(sample.logs);
    setDeploymentInfo(sample.deploymentInfo);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-900">Start a New Investigation</h1>
          <p className="mt-2 text-surface-500 max-w-2xl">
            Analyze production logs and deployment events to identify probable root causes and remediation actions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-lg border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
            disabled={submitting}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={submitting || !title.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {submitting ? 'Analyzing...' : 'Run Investigation'}
          </button>
        </div>
      </div>

      {/* Sample Incident Cards */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 uppercase tracking-wider mb-4">Quick Start: Load Sample Incident</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_INCIDENTS.map((sample) => {
            const Icon = sample.icon;
            return (
              <Card 
                key={sample.id} 
                className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                onClick={() => loadSample(sample)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-surface-100 text-surface-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-surface-900 group-hover:text-primary transition-colors">{sample.title}</h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Form Layout */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl border border-surface-200 shadow-sm">
        {error && (
          <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Section 1: Investigation Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">1. Investigation Details</h3>
            <p className="text-sm text-surface-500">Provide a clear, identifiable name for this incident.</p>
          </div>
          <div>
            <label htmlFor="incident-title" className="sr-only">Investigation Title</label>
            <input
              id="incident-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Payment Service Gateway Timeout"
              maxLength={255}
              className="block w-full rounded-lg border border-surface-300 px-4 py-3 text-surface-900 placeholder-surface-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors sm:text-sm"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Section 2: Application Logs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">2. Application Logs</h3>
            <p className="text-sm text-surface-500">Paste the relevant application logs, stack traces, and error messages.</p>
          </div>
          <div>
            <label htmlFor="incident-logs" className="sr-only">Application Logs</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-8 bg-surface-50 border-r border-surface-200 rounded-l-lg" />
              <textarea
                id="incident-logs"
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                placeholder="2026-06-03T10:15:02.123Z ERROR [Service] - Something went wrong..."
                rows={10}
                className="block w-full rounded-lg border border-surface-300 pl-12 pr-4 py-3 text-sm text-surface-800 bg-surface-50/50 font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-y leading-relaxed"
                disabled={submitting}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Deployment Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">3. Deployment Information</h3>
            <p className="text-sm text-surface-500">Include recent deployments, infrastructure changes, or related PRs.</p>
          </div>
          <div>
            <label htmlFor="incident-deployment" className="sr-only">Deployment Information</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-8 bg-surface-50 border-r border-surface-200 rounded-l-lg" />
              <textarea
                id="incident-deployment"
                value={deploymentInfo}
                onChange={(e) => setDeploymentInfo(e.target.value)}
                placeholder="Service: api-gateway&#10;Version: 1.4.2&#10;Deployed at: 2026-06-03T09:00:00Z"
                rows={6}
                className="block w-full rounded-lg border border-surface-300 pl-12 pr-4 py-3 text-sm text-surface-800 bg-surface-50/50 font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-y leading-relaxed"
                disabled={submitting}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-surface-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm font-medium text-surface-500 hover:text-surface-900 transition-colors cursor-pointer"
            disabled={submitting}
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="rounded-lg border border-surface-300 px-5 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors cursor-pointer"
              disabled={submitting}
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer flex items-center gap-2"
            >
              {submitting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {submitting ? 'Analyzing Data...' : 'Run Investigation'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

