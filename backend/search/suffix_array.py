"""
Suffix Array Construction Module
Implements O(N log^2 N) Prefix Doubling algorithm for Suffix Array construction.
Academic DSA 3 Reference Implementation.
"""
from typing import List

def build_suffix_array(text: str) -> List[int]:
    """
    Constructs the Suffix Array SA[] for a given text using O(N log^2 N) prefix-doubling algorithm.
    Ranks are computed case-insensitively for uniform text search.
    
    Args:
        text: Input text string (concatenated corpus with sentinel separators).
        
    Returns:
        List[int]: Array of suffix start indices sorted in lexicographical order.
    """
    n = len(text)
    if n == 0:
        return []
    if n == 1:
        return [0]

    # Initial ranks based on lower-case character values
    suffixes = list(range(n))
    rank = [ord(c.lower()) for c in text]
    tmp_rank = [0] * n

    k = 1
    while k < n:
        # Sort suffixes using key: (rank[i], rank[i+k] if i+k < n else -1)
        suffixes.sort(key=lambda i: (rank[i], rank[i + k] if (i + k) < n else -1))

        # Recompute ranks
        tmp_rank[suffixes[0]] = 0
        for j in range(1, n):
            prev = suffixes[j - 1]
            curr = suffixes[j]
            prev_tuple = (rank[prev], rank[prev + k] if (prev + k) < n else -1)
            curr_tuple = (rank[curr], rank[curr + k] if (curr + k) < n else -1)

            if curr_tuple == prev_tuple:
                tmp_rank[curr] = tmp_rank[prev]
            else:
                tmp_rank[curr] = tmp_rank[prev] + 1

        rank = list(tmp_rank)

        # Optimization: If max rank is n-1, all ranks are distinct
        if rank[suffixes[-1]] == n - 1:
            break

        k *= 2

    return suffixes

def get_suffix_array_sample(text: str, sa: List[int], limit: int = 50) -> List[dict]:
    """
    Returns a structured sample of the Suffix Array for visual inspection and UI display.
    """
    sample = []
    n = len(text)
    display_limit = min(limit, n)
    
    for i in range(display_limit):
        idx = sa[i]
        suffix_str = text[idx : min(idx + 60, n)]
        suffix_preview = repr(suffix_str)[1:-1]
        sample.append({
            "sa_index": i,
            "suffix_start": idx,
            "suffix_preview": suffix_preview
        })
    return sample
