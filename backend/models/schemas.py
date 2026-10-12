"""
Pydantic Schemas for API Requests and Responses
Academic DSA 3 Reference Implementation.
"""
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SearchRequest(BaseModel):
    query: str = Field(..., description="Search query string")
    mode: str = Field("substring", description="Query mode: 'substring', 'prefix', or 'phrase'")
    limit: int = Field(50, description="Maximum number of search results")

class DocumentResponse(BaseModel):
    id: str
    name: str
    size_bytes: int
    char_count: int
    status: str
    content: Optional[str] = None

class BuildIndexResponse(BaseModel):
    status: str
    message: str
    documents_count: int
    total_characters: int
    suffix_array_size: int
    lcp_array_size: int
    sa_build_time_ms: float
    lcp_build_time_ms: float
    total_build_time_ms: float
    last_built: str

class SearchResultItem(BaseModel):
    doc_name: str
    relevance_score: float
    match_frequency: int
    match_positions: List[int]
    earliest_position: int
    snippet: str
    query_type: str
    doc_length: int

class SearchPerformance(BaseModel):
    suffix_array_latency_ms: float
    inverted_index_latency_ms: float
    character_comparisons: int
    total_documents_searched: int

class SearchResponse(BaseModel):
    query: str
    mode: str
    total_matches: int
    sa_range: Dict[str, int]
    results: List[SearchResultItem]
    performance: SearchPerformance
