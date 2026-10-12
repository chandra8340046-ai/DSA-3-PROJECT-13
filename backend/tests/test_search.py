"""
Unit Tests for Suffix Array Search Engine & Kasai LCP Algorithm
Covers 10 required academic test scenarios.
Run with: pytest backend/tests/test_search.py
"""
import pytest
from search.suffix_array import build_suffix_array
from search.lcp import kasai_lcp
from search.search_engine import SearchEngine
from search.inverted_index import InvertedIndex
from services.document_service import DocumentService

@pytest.fixture
def sample_corpus():
    doc1 = "Suffix array provides efficient full-text search capabilities."
    doc2 = "Kasai algorithm builds LCP array in linear O(N) time complexity."
    text = doc1 + "\x01" + doc2 + "\x02"
    sa = build_suffix_array(text)
    lcp = kasai_lcp(text, sa)
    doc_offsets = [
        {"name": "doc1.txt", "start": 0, "end": len(doc1), "content": doc1},
        {"name": "doc2.txt", "start": len(doc1) + 1, "end": len(doc1) + 1 + len(doc2), "content": doc2}
    ]
    engine = SearchEngine(text, sa, lcp, doc_offsets)
    return engine, text, sa, lcp, doc_offsets

# 1. Empty Query Test
def test_empty_query(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("", mode="substring")
    assert matches == []
    assert sa_range == (-1, -1)

# 2. Exact Substring Search
def test_exact_substring(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("Suffix", mode="substring")
    assert len(matches) > 0
    assert matches[0]["doc_name"] == "doc1.txt"
    assert matches[0]["position"] == 0

# 3. Prefix Query
def test_prefix_query(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("cap", mode="prefix")
    assert any(m["doc_name"] == "doc1.txt" for m in matches)

# 4. Phrase Search
def test_phrase_search(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("full-text search", mode="phrase")
    assert len(matches) > 0
    assert matches[0]["doc_name"] == "doc1.txt"

# 5. No Match Query
def test_no_match(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("nonexistentword123", mode="substring")
    assert matches == []

# 6. Multiple Matches
def test_multiple_matches(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("array", mode="substring")
    # "array" appears in both doc1 and doc2
    assert len(matches) >= 2

# 7. Multiple Documents Mapping
def test_multiple_documents(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("array", mode="substring")
    doc_names = set(m["doc_name"] for m in matches)
    assert "doc1.txt" in doc_names
    assert "doc2.txt" in doc_names

# 8. Special Characters Query
def test_special_characters(sample_corpus):
    engine, _, _, _, _ = sample_corpus
    matches, lat, comp, sa_range = engine.search("O(N)", mode="substring")
    assert len(matches) > 0
    assert matches[0]["doc_name"] == "doc2.txt"

# 9. Empty Document Handling
def test_empty_document():
    doc1 = ""
    text = doc1
    sa = build_suffix_array(text)
    lcp = kasai_lcp(text, sa)
    engine = SearchEngine(text, sa, lcp, [])
    matches, lat, comp, sa_range = engine.search("test", mode="substring")
    assert matches == []

# 10. Index Rebuild Test
def test_index_rebuild(sample_corpus):
    engine, text, sa, lcp, doc_offsets = sample_corpus
    # Modify corpus and rebuild
    new_doc = "New updated document text."
    new_text = text + new_doc + "\x03"
    new_sa = build_suffix_array(new_text)
    new_lcp = kasai_lcp(new_text, new_sa)
    new_doc_offsets = doc_offsets + [{"name": "doc3.txt", "start": len(text), "end": len(text) + len(new_doc), "content": new_doc}]
    new_engine = SearchEngine(new_text, new_sa, new_lcp, new_doc_offsets)
    matches, _, _, _ = new_engine.search("updated", mode="substring")
    assert len(matches) > 0
    assert matches[0]["doc_name"] == "doc3.txt"
