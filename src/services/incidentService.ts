import api from './api';
import type {
  Incident,
  IncidentSummary,
  Report,
  CreateIncidentRequest,
} from '../types';

export interface DashboardStats {
  totalIncidents: number;
  criticalIncidents: number;
  highIncidents: number;
  mediumIncidents: number;
  lowIncidents: number;
  tagDistribution: Record<string, number>;
  incidentTrend: Record<string, number>;
  knowledgeStats: import('../types').KnowledgeStats;
}

/**
 * API service layer for incident operations.
 *
 * Each method maps to a single backend endpoint and returns
 * typed data. Error handling is centralized in the Axios interceptor.
 */
const incidentService = {
  /**
   * Creates a new incident.
   * POST /api/incidents
   */
  createIncident: async (data: CreateIncidentRequest): Promise<Incident> => {
    const response = await api.post<Incident>('/api/incidents', data);
    return response.data;
  },

  /**
   * Retrieves dashboard statistics.
   * GET /api/dashboard/stats
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/api/dashboard/stats');
    return response.data;
  },

  /**
   * Retrieves all incidents as summaries.
   * GET /api/incidents
   */
  getIncidents: async (filters?: {
    severity?: string;
    tags?: string[];
    search?: string;
  }): Promise<IncidentSummary[]> => {
    let params = new URLSearchParams();
    if (filters?.severity) params.append('severity', filters.severity);
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach(t => params.append('tags', t));
    }
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<IncidentSummary[]>('/api/incidents', { params });
    return response.data;
  },

  /**
   * Retrieves full incident details.
   * GET /api/incidents/{id}
   */
  getIncident: async (id: string): Promise<Incident> => {
    const response = await api.get<Incident>(`/api/incidents/${id}`);
    return response.data;
  },

  /**
   * Triggers AI analysis for an incident.
   * POST /api/incidents/{id}/analyze
   */
  analyzeIncident: async (id: string): Promise<Report> => {
    const response = await api.post<Report>(`/api/incidents/${id}/analyze`);
    return response.data;
  },

  /**
   * Submits an asynchronous investigation job.
   * POST /api/incidents/{id}/analyze/async
   */
  analyzeIncidentAsync: async (id: string): Promise<import('../types').InvestigationJob> => {
    const response = await api.post<import('../types').InvestigationJob>(`/api/incidents/${id}/analyze/async`);
    return response.data;
  },

  /**
   * Retrieves current investigation job status.
   * GET /api/incidents/{id}/job
   */
  getJobStatus: async (id: string): Promise<import('../types').InvestigationJob> => {
    const response = await api.get<import('../types').InvestigationJob>(`/api/incidents/${id}/job`);
    return response.data;
  },

  /**
   * Retrieves persistent execution traces for an incident.
   * GET /api/incidents/{id}/traces
   */
  getIncidentTraces: async (id: string): Promise<import('../types').InvestigationTrace[]> => {
    const response = await api.get<import('../types').InvestigationTrace[]>(`/api/incidents/${id}/traces`);
    return response.data;
  },

  /**
   * Retrieves persistent execution traces for a specific job.
   * GET /api/incidents/jobs/{jobId}/traces
   */
  getJobTraces: async (jobId: string): Promise<import('../types').InvestigationTrace[]> => {
    const response = await api.get<import('../types').InvestigationTrace[]>(`/api/incidents/jobs/${jobId}/traces`);
    return response.data;
  },

  /**
   * Retrieves the investigation report for an incident.
   * GET /api/incidents/{id}/report
   */
  getReport: async (id: string): Promise<Report> => {
    const response = await api.get<Report>(`/api/incidents/${id}/report`);
    return response.data;
  },
};

export default incidentService;
