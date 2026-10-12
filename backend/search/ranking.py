"""
Relevance Scoring and Result Ranking Module
Calculates document relevance scores based on match frequency, density, match positions, and query type.
Generates context snippets with match highlighting for UI rendering.
Academic DSA 3 Reference Implementation.
"""
import math
import re
from typing import List, Dict, Any

def score_and_rank_results(
    raw_matches: List[Dict[str, Any]],
    documents: Dict[str, str],
    query: str,
    mode: str,
    limit: int = 50
) -> List[Dict[str, Any]]:
    """
    Ranks raw matching positions mapped to source documents.
    
    Args:
        raw_matches: List of dicts {"doc_name": str, "position": int}
        documents: Dict of doc_name -> full document text
        query: User search query string
        mode: Query mode ('substring', 'prefix', 'phrase')
        limit: Maximum results to return
        
    Returns:
        List[Dict]: Structured, ranked list of document results with snippets.
    """
    if not raw_matches or not query:
        return []

    # Group matches by document
    grouped: Dict[str, List[int]] = {}
    for match in raw_matches:
        doc_name = match["doc_name"]
        pos = match["position"]
        if doc_name not in grouped:
            grouped[doc_name] = []
        grouped[doc_name].append(pos)

    results = []
    q_len = len(query)

    for doc_name, positions in grouped.items():
        doc_text = documents.get(doc_name, "")
        doc_length = max(len(doc_text), 1)
        freq = len(positions)
        sorted_positions = sorted(list(set(positions)))
        earliest_pos = sorted_positions[0] if sorted_positions else doc_length

        # Transparent scoring algorithm:
        # Base score derived from log-normalized term frequency
        tf_score = math.log1p(freq)
        
        # Density bonus: proportion of query match in document
        density_score = (freq * q_len) / float(doc_length)
        
        # Positional bonus: earlier appearance in document gets higher weight
        position_bonus = max(0.0, 1.0 - (earliest_pos / float(doc_length)))
        
        # Mode weight bonus
        mode_weight = 1.0
        if mode == "phrase":
            mode_weight = 1.2
        elif mode == "prefix":
            mode_weight = 1.1

        # Composite score
        raw_score = (tf_score * 0.6 + density_score * 0.2 + position_bonus * 0.2) * mode_weight
        
        # Normalize score between 0.00 and 0.99 for display
        relevance_score = min(0.99, max(0.05, round(raw_score / (raw_score + 1.0), 3)))

        # Build highlighted snippet around first match
        snippet, highlight_range = extract_snippet(doc_text, earliest_pos, query)

        results.append({
            "doc_name": doc_name,
            "relevance_score": relevance_score,
            "match_frequency": freq,
            "match_positions": sorted_positions,
            "earliest_position": earliest_pos,
            "snippet": snippet,
            "highlight_range": highlight_range,
            "query_type": mode,
            "doc_length": doc_length
        })

    # Sort results by relevance_score descending, then match_frequency descending
    results.sort(key=lambda r: (r["relevance_score"], r["match_frequency"]), reverse=True)
    return results[:limit]

def extract_snippet(text: str, match_pos: int, query: str, window: int = 50) -> Tuple[str, Tuple[int, int]]:
    """
    Extracts a contextual snippet around match_pos and wraps matched text in <mark> tags.
    """
    n = len(text)
    q_len = len(query)

    start = max(0, match_pos - window)
    end = min(n, match_pos + q_len + window)

    raw_snippet = text[start:end]
    prefix_dots = "..." if start > 0 else ""
    suffix_dots = "..." if end < n else ""

    # Find position of match inside snippet
    rel_match_pos = match_pos - start
    
    # Highlight query occurrence in snippet (case-insensitive search matching)
    before = raw_snippet[:rel_match_pos]
    matched_part = raw_snippet[rel_match_pos : rel_match_pos + q_len]
    after = raw_snippet[rel_match_pos + q_len :]

    snippet_html = f"{prefix_dots}{before}<mark>{matched_part}</mark>{after}{suffix_dots}"
    return snippet_html, (start, end)
