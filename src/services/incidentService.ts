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
    const response = await api.post<Incident>('/incidents', data);
    return response.data;
  },

  /**
   * Retrieves dashboard statistics.
   * GET /api/dashboard/stats
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
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

    const response = await api.get<IncidentSummary[]>('/incidents', { params });
    return response.data;
  },

  /**
   * Retrieves full incident details.
   * GET /api/incidents/{id}
   */
  getIncident: async (id: string): Promise<Incident> => {
    const response = await api.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  /**
   * Triggers AI analysis for an incident.
   * POST /api/incidents/{id}/analyze
   */
  analyzeIncident: async (id: string): Promise<Report> => {
    const response = await api.post<Report>(`/incidents/${id}/analyze`);
    return response.data;
  },

  /**
   * Retrieves the investigation report for an incident.
   * GET /api/incidents/{id}/report
   */
  getReport: async (id: string): Promise<Report> => {
    const response = await api.get<Report>(`/incidents/${id}/report`);
    return response.data;
  },
};

export default incidentService;
