/**
 * API Integration Service
 * Communicates with FastAPI backend server at http://localhost:8000/api
 */

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchDocuments() {
  const res = await fetch(`${API_BASE}/documents`);
  return res.json();
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || 'Failed to upload document');
  }
  return res.json();
}

export async function deleteDocument(filename) {
  const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to delete document');
  }
  return res.json();
}

export async function buildIndex() {
  const res = await fetch(`${API_BASE}/index/build`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchIndexStatus() {
  const res = await fetch(`${API_BASE}/index/status`);
  return res.json();
}

export async function executeSearch(query, mode = 'substring', limit = 50) {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, mode, limit }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Search failed');
  }
  return res.json();
}

export async function runBenchmark() {
  const res = await fetch(`${API_BASE}/benchmark`, {
    method: 'POST',
  });
  return res.json();
}

export async function fetchStatistics() {
  const res = await fetch(`${API_BASE}/statistics`);
  return res.json();
}

export async function fetchDocumentDetails(docId) {
  const res = await fetch(`${API_BASE}/document/${encodeURIComponent(docId)}`);
  if (!res.ok) {
    throw new Error('Document not found');
  }
  return res.json();
}

export async function fetchSuffixArraySample(limit = 50) {
  const res = await fetch(`${API_BASE}/algorithm/suffix-array?limit=${limit}`);
  return res.json();
}

export async function fetchLcpSample(limit = 50) {
  const res = await fetch(`${API_BASE}/algorithm/lcp?limit=${limit}`);
  return res.json();
}
