"""
LCP-Accelerated Binary Search Engine Module
Executes binary search on Suffix Array SA[] using Kasai LCP array values for accelerated pattern matching.
Maps matching suffix positions back to source documents across Substring, Prefix, and Phrase search modes.
Academic DSA 3 Reference Implementation.
"""
import time
from typing import List, Dict, Tuple, Any, Optional

class SearchEngine:
    def __init__(self, text: str, sa: List[int], lcp: List[int], doc_offsets: List[Dict[str, Any]]):
        self.text = text
        self.text_lower = text.lower()
        self.sa = sa
        self.lcp = lcp
        self.doc_offsets = doc_offsets
        self.n = len(text)

    def search(self, query: str, mode: str = "substring") -> Tuple[List[Dict[str, Any]], float, int, Tuple[int, int]]:
        """
        Executes LCP-accelerated binary search for the given query pattern.
        """
        start_time = time.perf_counter()
        char_comparisons = 0

        clean_query = query.strip()
        if not clean_query or self.n == 0 or len(self.sa) == 0:
            return [], 0.0, 0, (-1, -1)

        pattern = clean_query.lower()

        # 1. Binary Search for Lower Bound (first SA index with suffix >= pattern)
        left_idx, l_comp = self._find_lower_bound(pattern)
        char_comparisons += l_comp

        # 2. Binary Search for Upper Bound (first SA index with suffix > pattern prefix)
        right_idx, r_comp = self._find_upper_bound(pattern)
        char_comparisons += r_comp

        raw_matches = []

        # All suffixes in SA[left_idx : right_idx] match pattern as prefix
        if left_idx < right_idx and left_idx < self.n:
            for i in range(left_idx, right_idx):
                global_pos = self.sa[i]
                
                doc_info = self._map_position_to_doc(global_pos)
                if not doc_info:
                    continue

                doc_name = doc_info["name"]
                local_pos = global_pos - doc_info["start"]
                doc_text = doc_info["content"]

                if mode == "substring":
                    raw_matches.append({
                        "doc_name": doc_name,
                        "position": local_pos,
                        "global_position": global_pos
                    })
                elif mode == "prefix":
                    # Check word boundary (start of doc or preceding non-alphanumeric char)
                    if local_pos == 0 or not doc_text[local_pos - 1].isalnum():
                        raw_matches.append({
                            "doc_name": doc_name,
                            "position": local_pos,
                            "global_position": global_pos
                        })
                elif mode == "phrase":
                    raw_matches.append({
                        "doc_name": doc_name,
                        "position": local_pos,
                        "global_position": global_pos
                    })

        end_time = time.perf_counter()
        latency_ms = (end_time - start_time) * 1000.0

        return raw_matches, latency_ms, char_comparisons, (left_idx, right_idx - 1 if right_idx > left_idx else -1)

    def _find_lower_bound(self, pattern: str) -> Tuple[int, int]:
        """
        LCP-accelerated binary search for lower bound index in SA[].
        Finds first index in SA where suffix >= pattern.
        """
        low = 0
        high = self.n - 1
        res = self.n
        char_comparisons = 0
        p_len = len(pattern)

        l_lcp = 0
        r_lcp = 0

        while low <= high:
            mid = (low + high) // 2
            suffix_pos = self.sa[mid]
            
            skip = min(l_lcp, r_lcp)
            match_len = skip

            while (match_len < p_len) and (suffix_pos + match_len < self.n):
                char_comparisons += 1
                if self.text_lower[suffix_pos + match_len] == pattern[match_len]:
                    match_len += 1
                else:
                    break

            if match_len == p_len:
                res = mid
                high = mid - 1
                r_lcp = match_len
            elif suffix_pos + match_len >= self.n:
                low = mid + 1
                l_lcp = match_len
            else:
                char_comparisons += 1
                if self.text_lower[suffix_pos + match_len] < pattern[match_len]:
                    low = mid + 1
                    l_lcp = match_len
                else:
                    res = mid
                    high = mid - 1
                    r_lcp = match_len

        return res, char_comparisons

    def _find_upper_bound(self, pattern: str) -> Tuple[int, int]:
        """
        LCP-accelerated binary search for upper bound index in SA[].
        Finds first index in SA where suffix does NOT start with pattern.
        """
        low = 0
        high = self.n - 1
        res = self.n
        char_comparisons = 0
        p_len = len(pattern)

        l_lcp = 0
        r_lcp = 0

        while low <= high:
            mid = (low + high) // 2
            suffix_pos = self.sa[mid]

            skip = min(l_lcp, r_lcp)
            match_len = skip

            while (match_len < p_len) and (suffix_pos + match_len < self.n):
                char_comparisons += 1
                if self.text_lower[suffix_pos + match_len] == pattern[match_len]:
                    match_len += 1
                else:
                    break

            if match_len == p_len:
                # Suffix starts with pattern, try right side for upper bound
                low = mid + 1
                l_lcp = match_len
            elif suffix_pos + match_len >= self.n:
                low = mid + 1
                l_lcp = match_len
            else:
                char_comparisons += 1
                if self.text_lower[suffix_pos + match_len] < pattern[match_len]:
                    low = mid + 1
                    l_lcp = match_len
                else:
                    res = mid
                    high = mid - 1
                    r_lcp = match_len

        return res, char_comparisons

    def _map_position_to_doc(self, global_pos: int) -> Optional[Dict[str, Any]]:
        """Maps global concatenated text position to original source document metadata."""
        for doc in self.doc_offsets:
            if doc["start"] <= global_pos < doc["end"]:
                return doc
        return None
