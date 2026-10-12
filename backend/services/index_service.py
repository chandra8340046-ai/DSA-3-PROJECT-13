"""
Index Service Manager Module
Coordinates the lifecycle of Suffix Array, Kasai LCP Array, and Inverted Index builds.
Provides statistical metrics and query dispatching.
Academic DSA 3 Reference Implementation.
"""
import sys
import time
from typing import Dict, List, Any, Optional

from search.suffix_array import build_suffix_array, get_suffix_array_sample
from search.lcp import kasai_lcp, get_lcp_sample
from search.search_engine import SearchEngine
from search.inverted_index import InvertedIndex
from search.ranking import score_and_rank_results
from services.document_service import DocumentService

class IndexService:
    def __init__(self):
        self.doc_service = DocumentService()
        self.combined_text: str = ""
        self.doc_offsets: List[Dict[str, Any]] = []
        self.sa: List[int] = []
        self.lcp: List[int] = []
        self.search_engine: Optional[SearchEngine] = None
        self.inverted_index: InvertedIndex = InvertedIndex()
        
        # Build Stats & Performance Metrics
        self.is_built: bool = False
        self.last_build_time: str = "N/A"
        self.sa_build_time_ms: float = 0.0
        self.lcp_build_time_ms: float = 0.0
        self.total_build_time_ms: float = 0.0
        self.documents_indexed_count: int = 0
        self.total_characters_count: int = 0
        
        # Query Analytics
        self.query_history: List[Dict[str, Any]] = []
        
        # Automatically trigger initial build on startup if documents exist
        self.build_index()

    def build_index(self) -> Dict[str, Any]:
        """
        Builds/Rebuilds Suffix Array, Kasai LCP Array, and Inverted Index from documents.
        Returns execution metrics.
        """
        start_total = time.perf_counter()

        # 1. Ingest documents and construct concatenated corpus
        self.combined_text, self.doc_offsets = self.doc_service.build_concatenated_corpus()
        self.documents_indexed_count = len(self.doc_offsets)
        self.total_characters_count = len(self.combined_text)

        if self.total_characters_count == 0:
            self.sa = []
            self.lcp = []
            self.search_engine = None
            self.is_built = False
            return {
                "status": "warning",
                "message": "No documents found to build index."
            }

        # 2. Build Suffix Array using O(N log^2 N) algorithm
        t_sa_start = time.perf_counter()
        self.sa = build_suffix_array(self.combined_text)
        t_sa_end = time.perf_counter()
        self.sa_build_time_ms = round((t_sa_end - t_sa_start) * 1000.0, 3)

        # 3. Build LCP Array using Kasai O(N) algorithm
        t_lcp_start = time.perf_counter()
        self.lcp = kasai_lcp(self.combined_text, self.sa)
        t_lcp_end = time.perf_counter()
        self.lcp_build_time_ms = round((t_lcp_end - t_lcp_start) * 1000.0, 3)

        # 4. Instantiate Suffix Array Search Engine
        self.search_engine = SearchEngine(
            text=self.combined_text,
            sa=self.sa,
            lcp=self.lcp,
            doc_offsets=self.doc_offsets
        )

        # 5. Build Traditional Inverted Index Baseline
        raw_docs = [{"name": doc["name"], "content": doc["content"]} for doc in self.doc_offsets]
        inv_stats = self.inverted_index.build(raw_docs)

        end_total = time.perf_counter()
        self.total_build_time_ms = round((end_total - start_total) * 1000.0, 3)
        self.last_build_time = time.strftime("%Y-%m-%d %H:%M:%S")
        self.is_built = True

        return {
            "status": "success",
            "message": "Index built successfully",
            "documents_count": self.documents_indexed_count,
            "total_characters": self.total_characters_count,
            "suffix_array_size": len(self.sa),
            "lcp_array_size": len(self.lcp),
            "sa_build_time_ms": self.sa_build_time_ms,
            "lcp_build_time_ms": self.lcp_build_time_ms,
            "total_build_time_ms": self.total_build_time_ms,
            "inverted_index_build_time_ms": inv_stats["build_time_ms"],
            "last_built": self.last_build_time
        }

    def search(self, query: str, mode: str = "substring", limit: int = 50) -> Dict[str, Any]:
        """
        Executes query on Suffix Array engine and returns ranked results with performance metrics.
        """
        if not self.is_built or not self.search_engine:
            return {
                "error": "No index has been built yet. Upload documents and build the index first.",
                "results": [],
                "metrics": {}
            }

        # Execute LCP-accelerated search
        raw_matches, sa_latency, char_comps, sa_range = self.search_engine.search(query, mode=mode)
        
        # Build dictionary map of docs for ranking
        doc_dict = {doc["name"]: doc["content"] for doc in self.doc_offsets}
        
        # Score and rank results
        ranked_results = score_and_rank_results(
            raw_matches=raw_matches,
            documents=doc_dict,
            query=query,
            mode=mode,
            limit=limit
        )

        # Also run baseline Inverted Index query for side-by-side performance measurement
        inv_matches, inv_latency, inv_comps = self.inverted_index.search(query, mode=mode)

        # Record query performance history
        query_metric = {
            "query": query,
            "mode": mode,
            "sa_latency_ms": sa_latency,
            "inv_latency_ms": inv_latency,
            "char_comparisons": char_comps,
            "match_count": len(raw_matches),
            "timestamp": time.time()
        }
        self.query_history.append(query_metric)
        if len(self.query_history) > 100:
            self.query_history.pop(0)

        return {
            "query": query,
            "mode": mode,
            "total_matches": len(raw_matches),
            "sa_range": {"L": sa_range[0], "R": sa_range[1]},
            "results": ranked_results,
            "performance": {
                "suffix_array_latency_ms": round(sa_latency, 4),
                "inverted_index_latency_ms": round(inv_latency, 4),
                "character_comparisons": char_comps,
                "total_documents_searched": self.documents_indexed_count
            }
        }

    def get_statistics(self) -> Dict[str, Any]:
        """Returns overall system statistics for Dashboard and Analytics."""
        avg_latency = 0.0
        if self.query_history:
            avg_latency = round(sum(q["sa_latency_ms"] for q in self.query_history) / len(self.query_history), 4)

        sa_size_bytes = sys.getsizeof(self.sa) + (len(self.sa) * 8)
        lcp_size_bytes = sys.getsizeof(self.lcp) + (len(self.lcp) * 8)
        text_size_bytes = sys.getsizeof(self.combined_text)

        return {
            "documents_indexed": self.documents_indexed_count,
            "total_characters": self.total_characters_count,
            "suffix_array_size": len(self.sa),
            "lcp_array_size": len(self.lcp),
            "last_build_time": self.last_build_time,
            "total_build_time_ms": self.total_build_time_ms,
            "sa_build_time_ms": self.sa_build_time_ms,
            "lcp_build_time_ms": self.lcp_build_time_ms,
            "average_query_latency_ms": avg_latency,
            "text_size_bytes": text_size_bytes,
            "sa_size_bytes": sa_size_bytes,
            "lcp_size_bytes": lcp_size_bytes,
            "inverted_index_size_bytes": self.inverted_index.get_estimated_size_bytes(),
            "is_built": self.is_built
        }

    def get_sa_sample(self, limit: int = 50) -> List[dict]:
        if not self.is_built:
            return []
        return get_suffix_array_sample(self.combined_text, self.sa, limit)

    def get_lcp_sample(self, limit: int = 50) -> List[dict]:
        if not self.is_built:
            return []
        return get_lcp_sample(self.combined_text, self.sa, self.lcp, limit)

# Global singleton instance
index_service_instance = IndexService()
