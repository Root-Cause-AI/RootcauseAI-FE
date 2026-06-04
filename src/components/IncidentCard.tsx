/**
 * Incident summary card for the list view.
 *
 * Displays incident title, creation date, and report status.
 * Clickable to navigate to incident detail page.
 */
import { Link } from 'react-router-dom';
import type { IncidentSummary } from '../types';
import { Badge } from './ui/badge';

interface IncidentCardProps {
  incident: IncidentSummary;
}

export default function IncidentCard({ incident }: IncidentCardProps) {
  const formattedDate = new Date(incident.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getSeverityVariant = (severity: string | null) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'outline';
    }
  };

  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="block rounded-lg border border-surface-200 bg-white p-5 hover:border-primary-300 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary truncate transition-colors">
              {incident.title}
            </h3>
            {incident.severity && (
              <Badge variant={getSeverityVariant(incident.severity) as any}>
                {incident.severity}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{formattedDate}</p>
          
          {incident.tags && incident.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {incident.tags.slice(0, 3).map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] py-0 h-4">
                  {tag}
                </Badge>
              ))}
              {incident.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] py-0 h-4">
                  +{incident.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          {incident.hasReport ? (
            <span className="inline-flex items-center rounded-full bg-success-500/10 px-2.5 py-1 text-xs font-medium text-success-600">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success-500" />
              Analyzed
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-1 text-xs font-medium text-surface-500">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-surface-400" />
              Pending
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center text-xs text-surface-400">
        <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
        View details
      </div>
    </Link>
  );
}
