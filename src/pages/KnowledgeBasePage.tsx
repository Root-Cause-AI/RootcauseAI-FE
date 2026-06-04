import { useEffect, useState, useCallback } from 'react';
import knowledgeService from '../services/knowledgeService';
import type { KnowledgeDocument, KnowledgeStats } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  BookOpen, Upload, Trash2, FileText, Search,
  Database, AlertTriangle, Wrench, Server, X
} from 'lucide-react';

const DOC_TYPE_OPTIONS = [
  { value: 'RUNBOOK', label: 'Runbook', icon: BookOpen },
  { value: 'INCIDENT', label: 'Past Incident', icon: AlertTriangle },
  { value: 'KNOWN_FIX', label: 'Known Fix', icon: Wrench },
  { value: 'ARCHITECTURE', label: 'Architecture', icon: Server },
];

const getDocTypeIcon = (type: string) => {
  const option = DOC_TYPE_OPTIONS.find(o => o.value === type);
  return option ? option.icon : FileText;
};

const getDocTypeColor = (type: string) => {
  switch (type) {
    case 'RUNBOOK': return 'bg-blue-100 text-blue-700';
    case 'INCIDENT': return 'bg-red-100 text-red-700';
    case 'KNOWN_FIX': return 'bg-green-100 text-green-700';
    case 'ARCHITECTURE': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('RUNBOOK');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [docs, statsData] = await Promise.all([
        typeFilter
          ? knowledgeService.getDocuments(typeFilter)
          : searchQuery
            ? knowledgeService.searchDocuments(searchQuery)
            : knowledgeService.getDocuments(),
        knowledgeService.getStats(),
      ]);
      setDocuments(docs);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch knowledge data', err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpload = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      setUploadError('Title and file are required.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      await knowledgeService.uploadDocument(uploadFile, uploadTitle.trim(), uploadType);
      setShowUpload(false);
      setUploadTitle('');
      setUploadType('RUNBOOK');
      setUploadFile(null);
      await fetchData();
    } catch (err) {
      console.error('Upload failed', err);
      setUploadError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await knowledgeService.deleteDocument(id);
      await fetchData();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload runbooks, incident reports, and documentation to enhance AI investigations.
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Card className="hover:shadow-md hover:-translate-y-1 transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-[10px] bg-blue-50">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{stats.totalDocuments}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">Documents</p>
              </div>
            </CardContent>
          </Card>
          {DOC_TYPE_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const count = stats.documentsByType[opt.value] || 0;
            return (
              <Card key={opt.value} className="hover:shadow-md hover:-translate-y-1 transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-[10px] ${getDocTypeColor(opt.value).split(' ')[0]}`}>
                    <Icon className={`w-6 h-6 ${getDocTypeColor(opt.value).split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 leading-none">{count}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">{opt.label}s</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setTypeFilter(''); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setSearchQuery(''); }}
          className="rounded-[10px] border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Types</option>
          {DOC_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
              <CardTitle>Upload Document</CardTitle>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              {uploadError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
                  {uploadError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., HikariCP Connection Pool Runbook"
                  className="w-full rounded-[10px] border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Document Type</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full rounded-[10px] border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all cursor-pointer"
                >
                  {DOC_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  File <span className="text-gray-400 font-normal">(PDF, Markdown, or Text)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-[10px] p-8 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.md,.markdown,.txt,.text"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                    <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      {uploadFile ? uploadFile.name : 'Click to select or drag a file here'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Up to 20MB</p>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
                <Button onClick={handleUpload} disabled={uploading || !uploadFile || !uploadTitle.trim()}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Document List */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 font-medium">Loading knowledge base...</div>
      ) : documents.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 border-gray-200">
          <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No documents yet</h3>
          <p className="text-gray-500 mt-2 max-w-md text-sm">
            Upload runbooks, incident reports, and documentation to enhance AI-powered investigations with contextual knowledge.
          </p>
          <Button className="mt-6 shadow-sm" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Document
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const Icon = getDocTypeIcon(doc.documentType);
            return (
              <Card key={doc.id} className="hover:shadow-md hover:border-gray-300 transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-[10px] ${getDocTypeColor(doc.documentType)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id, doc.title); }}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{doc.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="text-[10px] bg-white text-gray-600">{doc.documentType}</Badge>
                    <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{doc.chunkCount} chunks</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <span className="truncate max-w-[150px] font-medium" title={doc.fileName}>{doc.fileName}</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
