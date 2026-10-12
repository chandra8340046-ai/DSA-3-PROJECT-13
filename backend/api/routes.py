"""
API Router Module
Defines FastAPI endpoints for document management, index building, search execution, benchmarks, and algorithm visualization.
Academic DSA 3 Reference Implementation.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Dict, Any, Optional

from models.schemas import SearchRequest, SearchResponse, BuildIndexResponse
from services.document_service import DocumentService
from services.index_service import index_service_instance
from services.benchmark_service import BenchmarkService

router = APIRouter(prefix="/api")
doc_service = DocumentService()
benchmark_service = BenchmarkService(index_service_instance)

@router.get("/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "service": "Suffix Array & LCP Search Engine Backend",
        "team": "Team 3 (Sai Krishna, Navaneeth, Chaitanya)",
        "course": "DSA 3",
        "section": "13",
        "academic_year": "2026-2027"
    }

@router.get("/documents")
def get_documents():
    """Retrieve list of all ingested documents."""
    return doc_service.get_all_documents()

@router.post("/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload a new UTF-8 plain-text document."""
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only UTF-8 .txt files are supported.")
    
    content = await file.read()
    result = doc_service.upload_document(file.filename, content)
    
    # Automatically rebuild index after document upload
    index_service_instance.build_index()
    return result

@router.delete("/documents/{filename}")
def delete_document(filename: str):
    """Remove a document from the corpus."""
    success = doc_service.delete_document(filename)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    index_service_instance.build_index()
    return {"status": "success", "message": f"Document {filename} removed successfully."}

@router.post("/index/build")
def build_index():
    """Trigger Suffix Array and Kasai LCP index construction."""
    return index_service_instance.build_index()

@router.get("/index/status")
def get_index_status():
    """Get current index status and metadata."""
    stats = index_service_instance.get_statistics()
    return {
        "is_built": stats["is_built"],
        "last_build_time": stats["last_build_time"],
        "documents_count": stats["documents_indexed"],
        "total_characters": stats["total_characters"],
        "suffix_array_size": stats["suffix_array_size"],
        "lcp_array_size": stats["lcp_array_size"]
    }

@router.post("/search")
def search(request: SearchRequest):
    """
    Execute LCP-accelerated Suffix Array search.
    Supports modes: 'substring', 'prefix', 'phrase'.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")
    
    if request.mode not in ["substring", "prefix", "phrase"]:
        raise HTTPException(status_code=400, detail="Invalid query mode. Must be 'substring', 'prefix', or 'phrase'.")

    return index_service_instance.search(
        query=request.query,
        mode=request.mode,
        limit=request.limit
    )

@router.post("/benchmark")
def run_benchmark():
    """Execute empirical benchmarks comparing Suffix Array vs Inverted Index."""
    return benchmark_service.run_benchmark()

@router.get("/statistics")
def get_statistics():
    """Get overall system statistics and index size measurements."""
    return index_service_instance.get_statistics()

@router.get("/document/{document_id:path}")
def get_document_details(document_id: str):
    """Retrieve full text content of a specific document by name/ID."""
    documents = doc_service.get_all_documents()
    for doc in documents:
        if doc["id"] == document_id or doc["name"] == document_id:
            return doc
    raise HTTPException(status_code=404, detail="Document not found.")

@router.get("/algorithm/suffix-array")
def get_suffix_array_sample(limit: int = Query(50, ge=1, le=500)):
    """Retrieve sample of SA[] array for visual inspection."""
    sample = index_service_instance.get_sa_sample(limit)
    return {
        "suffix_array_size": len(index_service_instance.sa),
        "total_characters": len(index_service_instance.combined_text),
        "sample": sample
    }

@router.get("/algorithm/lcp")
def get_lcp_sample(limit: int = Query(50, ge=1, le=500)):
    """Retrieve sample of Kasai LCP[] array for visual inspection."""
    sample = index_service_instance.get_lcp_sample(limit)
    return {
        "lcp_array_size": len(index_service_instance.lcp),
        "sample": sample
    }
