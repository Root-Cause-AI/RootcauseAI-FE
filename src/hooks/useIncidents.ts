import { useState, useEffect, useCallback } from 'react';
import incidentService from '../services/incidentService';
import type { Incident, IncidentSummary, Report, ApiError } from '../types';

/**
 * Custom hook for fetching the incident list.
 * Provides loading, error, and refresh capabilities.
 */
export function useIncidents(filters?: { severity?: string; tags?: string[]; search?: string }) {
  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async (currentFilters?: { severity?: string; tags?: string[]; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getIncidents(currentFilters);
      setIncidents(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents(filters);
  }, [fetchIncidents, JSON.stringify(filters)]);

  return { incidents, loading, error, refresh: () => fetchIncidents(filters) };
}

/**
 * Custom hook for fetching a single incident's details.
 */
export function useIncident(id: string) {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncident = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getIncident(id);
      setIncident(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to fetch incident');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

  return { incident, loading, error, refresh: fetchIncident };
}

/**
 * Custom hook for fetching an incident's report.
 * Does not auto-fetch — only fetches when triggered or when shouldFetch is true.
 */
export function useReport(incidentId: string, shouldFetch: boolean) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    if (!incidentId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getReport(incidentId);
      setReport(data);
    } catch (err) {
      const apiError = err as ApiError;
      // 404 is expected when no report exists yet
      if (apiError.status === 404) {
        setReport(null);
        setError(null);
      } else {
        setError(apiError.message || 'Failed to fetch report');
      }
    } finally {
      setLoading(false);
    }
  }, [incidentId]);

  useEffect(() => {
    if (shouldFetch) {
      fetchReport();
    }
  }, [shouldFetch, fetchReport]);

  return { report, loading, error, refresh: fetchReport, setReport };
}
