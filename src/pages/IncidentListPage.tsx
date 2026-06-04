import { useState } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import IncidentCard from '../components/IncidentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';

import { Button } from '../components/ui/button';

export default function IncidentListPage() {
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  
  const { incidents, loading, error, refresh } = useIncidents({
    severity: severityFilter || undefined,
    search: searchFilter || undefined,
  });

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Incidents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and analyze production incidents
          </p>
        </div>
        <Button asChild>
          <Link to="/incidents/new">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Incident
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search incidents..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="flex-1 rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
        />
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-[10px] border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all cursor-pointer"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Content */}
      {loading && <LoadingSpinner message="Loading incidents..." />}

      {error && <ErrorMessage message={error} onRetry={refresh} />}

      {!loading && !error && incidents.length === 0 && <EmptyState />}

      {!loading && !error && incidents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  );
}
