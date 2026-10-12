"""
Kasai LCP Array Construction Module
Implements Kasai's O(N) linear-time algorithm to build the LCP (Longest Common Prefix) array.
Academic DSA 3 Reference Implementation.
"""
from typing import List

def kasai_lcp(text: str, sa: List[int]) -> List[int]:
    """
    Constructs the LCP (Longest Common Prefix) array in linear O(N) time using Kasai's Algorithm.
    
    LCP[i] stores the length of the longest common prefix between suffix SA[i] and suffix SA[i-1].
    LCP[0] is defined as 0.
    
    Args:
        text: Input text string.
        sa: Suffix Array SA[].
        
    Returns:
        List[int]: LCP array of length N.
    """
    n = len(text)
    if n == 0 or len(sa) == 0:
        return []

    lcp = [0] * n
    rank = [0] * n

    # Compute inverse suffix array rank[i] -> position of suffix starting at i in SA
    for i in range(n):
        rank[sa[i]] = i

    h = 0  # Preserved common prefix length
    for i in range(n):
        if rank[i] > 0:
            # j is the starting index of the predecessor suffix in SA
            j = sa[rank[i] - 1]
            
            # Compare characters starting from index i+h and j+h
            while (i + h < n) and (j + h < n) and (text[i + h] == text[j + h]):
                h += 1
                
            lcp[rank[i]] = h
            
            # Key Kasai Property: Next suffix at text position i+1 will share at least h-1 characters
            if h > 0:
                h -= 1
        else:
            lcp[0] = 0

    return lcp

def get_lcp_sample(text: str, sa: List[int], lcp: List[int], limit: int = 50) -> List[dict]:
    """
    Returns a structured sample of the LCP array alongside SA[] for UI display and algorithm inspection.
    """
    sample = []
    n = len(text)
    display_limit = min(limit, n)
    
    for i in range(display_limit):
        idx = sa[i]
        suffix_str = text[idx : min(idx + 40, n)]
        suffix_preview = repr(suffix_str)[1:-1]
        
        prev_suffix_preview = ""
        if i > 0:
            prev_idx = sa[i - 1]
            prev_suffix_preview = repr(text[prev_idx : min(prev_idx + 40, n)])[1:-1]
            
        sample.append({
            "index": i,
            "sa_start": idx,
            "lcp_value": lcp[i],
            "suffix_preview": suffix_preview,
            "prev_suffix_preview": prev_suffix_preview
        })
    return sample
