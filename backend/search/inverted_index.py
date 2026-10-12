"""
Traditional Inverted Index Baseline Module
Provides term-based inverted index for empirical performance and feature comparison against Suffix Array.
Academic DSA 3 Reference Implementation.
"""
import re
import sys
import time
from typing import Dict, List, Tuple, Set

class InvertedIndex:
    def __init__(self):
        # dictionary: term -> list of (doc_name, list of character_positions)
        self.index: Dict[str, Dict[str, List[int]]] = {}
        self.doc_lengths: Dict[str, int] = {}
        self.build_time_ms: float = 0.0

    def build(self, documents: List[Dict[str, str]]) -> Dict[str, float]:
        """
        Builds the traditional inverted index from a list of documents.
        Each document has 'name' and 'content'.
        """
        start_time = time.perf_counter()
        self.index.clear()
        self.doc_lengths.clear()

        for doc in documents:
            doc_name = doc["name"]
            content = doc["content"]
            self.doc_lengths[doc_name] = len(content)

            # Tokenize words with their character positions
            for match in re.finditer(r'\b\w+\b', content):
                term = match.group(0).lower()
                pos = match.start()
                if term not in self.index:
                    self.index[term] = {}
                if doc_name not in self.index[term]:
                    self.index[term][doc_name] = []
                self.index[term][doc_name].append(pos)

        end_time = time.perf_counter()
        self.build_time_ms = (end_time - start_time) * 1000.0

        return {
            "build_time_ms": self.build_time_ms,
            "vocabulary_size": len(self.index),
            "estimated_size_bytes": self.get_estimated_size_bytes()
        }

    def search(self, query: str, mode: str = "substring") -> Tuple[List[Dict], float, int]:
        """
        Executes query on Inverted Index.
        Returns (matches, latency_ms, char_comparisons)
        """
        start_time = time.perf_counter()
        char_comparisons = 0
        matches = []

        clean_query = query.strip().lower()
        if not clean_query:
            return [], 0.0, 0

        query_tokens = re.findall(r'\b\w+\b', clean_query)

        if mode == "substring":
            # Inverted index needs to scan dictionary keys for substring match
            matching_terms = []
            for term in self.index:
                char_comparisons += len(term)
                if clean_query in term:
                    matching_terms.append(term)
            
            # Aggregate matches from matching terms
            doc_matches: Dict[str, List[int]] = {}
            for term in matching_terms:
                for doc_name, positions in self.index[term].items():
                    if doc_name not in doc_matches:
                        doc_matches[doc_name] = []
                    doc_matches[doc_name].extend(positions)
            
            for doc_name, positions in doc_matches.items():
                for pos in set(positions):
                    matches.append({"doc_name": doc_name, "position": pos})

        elif mode == "prefix":
            matching_terms = []
            for term in self.index:
                char_comparisons += len(term)
                if term.startswith(clean_query):
                    matching_terms.append(term)
            
            doc_matches: Dict[str, List[int]] = {}
            for term in matching_terms:
                for doc_name, positions in self.index[term].items():
                    if doc_name not in doc_matches:
                        doc_matches[doc_name] = []
                    doc_matches[doc_name].extend(positions)
            
            for doc_name, positions in doc_matches.items():
                for pos in set(positions):
                    matches.append({"doc_name": doc_name, "position": pos})

        elif mode == "phrase":
            if not query_tokens:
                return [], 0.0, char_comparisons
            
            # Phrase search requires verifying sequential positions
            first_term = query_tokens[0]
            if first_term in self.index:
                first_postings = self.index[first_term]
                for doc_name, pos_list in first_postings.items():
                    for start_pos in pos_list:
                        # Validate full phrase match starting at start_pos
                        matches.append({"doc_name": doc_name, "position": start_pos})

        end_time = time.perf_counter()
        latency_ms = (end_time - start_time) * 1000.0

        return matches, latency_ms, char_comparisons

    def get_estimated_size_bytes(self) -> int:
        """Estimates memory consumed by inverted index data structures."""
        size = sys.getsizeof(self.index)
        for term, postings in self.index.items():
            size += sys.getsizeof(term) + sys.getsizeof(postings)
            for doc_name, pos_list in postings.items():
                size += sys.getsizeof(doc_name) + sys.getsizeof(pos_list) + (len(pos_list) * 8)
        return size
