# Full-Text Search Engine on a Suffix-Array Index with Kasai LCP

**B.Tech Data Structures and Algorithms 3 (DSA 3) Final Review Project**  
**Team 3, Section 13 (Academic Year 2026-2027)**  

### Team Members
- **Sai Krishna** – 2520090156
- **Navaneeth** – 2520090218
- **Chaitanya** – 2520090099

---

## 📌 Project Overview
This project implements a high-performance **Full-Text Search Engine** built upon a **Suffix Array** index combined with **Kasai's Longest Common Prefix (LCP) Array**. The application supports fast pattern matching across large collections of UTF-8 plain-text documents across three query modes:
1. **Substring Search**: Locates pattern occurrences anywhere within the indexed corpus.
2. **Prefix Search**: Identifies word/term prefixes occurring in documents.
3. **Phrase Search**: Searches exact multi-word character sequences spanning sentences.

It also provides empirical performance benchmarks comparing the **Suffix Array + LCP** search paradigm against a **Traditional Inverted Index** baseline across latency, index footprint, and character comparison operations.

---

## 🏗️ Architecture & Core Algorithms

```
DOCUMENTS → INGESTION LAYER → INDEX BUILD LAYER → SUFFIX ARRAY + KASAI LCP → QUERY LAYER → LCP-ACCELERATED BINARY SEARCH → RANKING & OUTPUT → SEARCH RESULTS
```

1. **Suffix Array Construction**: $O(N \log^2 N)$ Prefix-Doubling algorithm sorting all suffixes lexicographically.
2. **Kasai LCP Array**: $O(N)$ linear-time algorithm computing common prefix lengths between adjacent suffixes.
3. **LCP-Accelerated Binary Search**: $O(P + \log N)$ binary search utilizing known LCP bounds to skip redundant character comparisons.
4. **Document Mapping**: Global text offsets ($SA[k]$) are mapped to source document metadata and local character positions.
5. **Relevance Ranking**: Composite score derived from log-normalized term frequency, density, match position bonus, and query mode weights.

---

## 🛠️ Technology Stack

- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic, Pytest
- **Frontend**: React 18, Vite, JavaScript, Lucide Icons, Recharts, Custom CSS
- **Corpus Data**: UTF-8 plain-text files located in `/data/documents/`

---

## 🚀 How to Run the Application

### 1. Start the Backend API (FastAPI)

Open a terminal window and navigate to the project directory:

```bash
# Navigate to project root
cd "c:\Users\navan\Downloads\DSA FINAL REVIEW"

# Create and activate Python virtual environment (optional)
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI server (Runs on http://localhost:8000)
python -m uvicorn main:app --app-dir backend --reload --port 8000
```

- **Backend API Base URL**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2. Start the Frontend Application (React + Vite)

Open a second terminal window:

```bash
# Navigate to frontend folder
cd "c:\Users\navan\Downloads\DSA FINAL REVIEW\frontend"

# Install Node dependencies
npm install

# Start Vite dev server (Runs on http://localhost:5173)
npm run dev
```

- **Frontend Application URL**: `http://localhost:5173`

---

## 🧪 Running Unit & Algorithm Tests

To verify all 10 core algorithm test cases (including empty query, exact substring, prefix search, phrase search, no match, multiple matches, multi-document mapping, special characters, empty doc, index rebuild):

```bash
# Run pytest from project root with PYTHONPATH
$env:PYTHONPATH="backend"
python -m pytest backend/tests/test_search.py
```

---

## 📡 API Endpoint Reference

| HTTP Method | Endpoint Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend status & team metadata |
| `GET` | `/api/documents` | List all ingested corpus documents |
| `POST` | `/api/documents/upload` | Upload a new `.txt` document file |
| `DELETE` | `/api/documents/{filename}` | Delete a document from corpus |
| `POST` | `/api/index/build` | Build/rebuild Suffix Array & Kasai LCP index |
| `GET` | `/api/index/status` | Current index build status & size statistics |
| `POST` | `/api/search` | Execute LCP-accelerated Suffix Array search |
| `POST` | `/api/benchmark` | Run empirical benchmark vs Inverted Index |
| `GET` | `/api/statistics` | Retrieve system memory & query performance stats |
| `GET` | `/api/document/{id}` | Fetch full content & metadata of a document |
| `GET` | `/api/algorithm/suffix-array` | Retrieve sample SA[] array elements |
| `GET` | `/api/algorithm/lcp` | Retrieve sample Kasai LCP[] array elements |

---

## 📸 Screenshots to Capture for Final Project Review

1. **Main Dashboard**: High-level metrics, team details, and navigation cards.
2. **Document Upload**: Uploading text files and index build success notice.
3. **Index Building**: Suffix array and Kasai LCP size/time statistics.
4. **Search Page**: Search input with Substring, Prefix, and Phrase radio mode selectors.
5. **Search Results**: Ranked document matches with highlighted snippets and relevance scores.
6. **Result Details**: Document Inspector modal with match positions list and full highlighted text.
7. **Algorithm Visualization**: 11-step execution pipeline workflow diagram.
8. **Performance Analytics**: Memory footprint and latency comparison charts.
9. **Suffix Array / LCP Sample**: Data structure inspection tables for SA[] and Kasai LCP[].
10. **Suffix Array vs Inverted Index Comparison**: Side-by-side comparative matrix.
