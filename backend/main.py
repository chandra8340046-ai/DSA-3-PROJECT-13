"""
FastAPI Server Entry Point
Full-Text Search Engine on a Suffix-Array Index
Team 3 (Sai Krishna, Navaneeth, Chaitanya) - Section 13
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(
    title="Suffix Array & LCP Search Engine API",
    description="B.Tech DSA 3 Final Review Project API - Team 3, Section 13",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "message": "Suffix Array & LCP Search Engine API is running.",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
