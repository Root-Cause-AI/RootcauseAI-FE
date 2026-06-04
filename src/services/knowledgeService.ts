import api from './api';
import type { KnowledgeDocument, KnowledgeStats } from '../types';

/**
 * API service layer for knowledge base operations.
 */
const knowledgeService = {
  /**
   * Uploads a document to the knowledge base.
   * POST /api/knowledge/upload (multipart/form-data)
   */
  uploadDocument: async (
    file: File,
    title: string,
    documentType: string
  ): Promise<KnowledgeDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('documentType', documentType);

    const response = await api.post<KnowledgeDocument>('/knowledge/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 min timeout for large files + embedding generation
    });
    return response.data;
  },

  /**
   * Lists all knowledge base documents.
   * GET /api/knowledge/documents
   */
  getDocuments: async (type?: string): Promise<KnowledgeDocument[]> => {
    const params = type ? { type } : {};
    const response = await api.get<KnowledgeDocument[]>('/knowledge/documents', { params });
    return response.data;
  },

  /**
   * Gets a single document by ID.
   * GET /api/knowledge/documents/{id}
   */
  getDocument: async (id: string): Promise<KnowledgeDocument> => {
    const response = await api.get<KnowledgeDocument>(`/knowledge/documents/${id}`);
    return response.data;
  },

  /**
   * Deletes a document and its chunks.
   * DELETE /api/knowledge/documents/{id}
   */
  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/knowledge/documents/${id}`);
  },

  /**
   * Returns knowledge base statistics.
   * GET /api/knowledge/stats
   */
  getStats: async (): Promise<KnowledgeStats> => {
    const response = await api.get<KnowledgeStats>('/knowledge/stats');
    return response.data;
  },

  /**
   * Searches documents by title.
   * GET /api/knowledge/search
   */
  searchDocuments: async (query: string): Promise<KnowledgeDocument[]> => {
    const response = await api.get<KnowledgeDocument[]>('/knowledge/search', {
      params: { query },
    });
    return response.data;
  },
};

export default knowledgeService;
