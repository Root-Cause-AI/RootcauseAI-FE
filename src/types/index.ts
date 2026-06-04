/**
 * Core TypeScript type definitions for RootCause AI.
 *
 * These types mirror the backend DTOs to ensure type-safe API communication.
 * No 'any' types are used — all structures are strictly typed.
 */

/** Full incident details returned by GET /api/incidents/{id} */
export interface Incident {
  id: string;
  title: string;
  logs: string | null;
  deploymentInfo: string | null;
  createdAt: string;
  hasReport: boolean;
}

/** Lightweight incident summary returned by GET /api/incidents */
export interface IncidentSummary {
  id: string;
  title: string;
  createdAt: string;
  hasReport: boolean;
  severity: string | null;
  tags: string[] | null;
}

/** Investigation report returned by analysis and report endpoints */
export interface Report {
  id: string;
  incidentId: string;
  rootCause: string;
  confidenceScore: number;
  severity: string;
  tags: string[];
  executiveSummary: string;
  engineeringSummary: string;
  timeline: TimelineEvent[];
  evidence: EvidenceItem[];
  recommendations: Recommendation[];
  similarIncidents: SimilarIncident[];
  citations: Citation[];
  retrievedKnowledge: KnowledgeSearchResult[];
  createdAt: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  type: string;
}

export interface EvidenceItem {
  text: string;
  timestamp: string;
  severity: string;
}

export interface Recommendation {
  priority: string;
  action: string;
}

export interface SimilarIncident {
  incidentId: string;
  reason: string;
  similarity: string;
}

/** Citation linking AI findings to knowledge base sources */
export interface Citation {
  documentTitle: string;
  documentType: string;
  excerpt: string;
  relevance: string;
}

/** Knowledge base search result */
export interface KnowledgeSearchResult {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  documentType: string;
  content: string;
  score: number;
}

/** Knowledge base document */
export interface KnowledgeDocument {
  id: string;
  title: string;
  documentType: string;
  fileName: string;
  fileType: string;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Knowledge base statistics */
export interface KnowledgeStats {
  totalDocuments: number;
  totalChunks: number;
  documentsByType: Record<string, number>;
}

/** Request body for POST /api/incidents */
export interface CreateIncidentRequest {
  title: string;
  logs: string;
  deploymentInfo: string;
}

/** Standard error response from the API */
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
