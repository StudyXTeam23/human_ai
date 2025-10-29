"""FastAPI application entry point."""
from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import humanize, humanize_file, upload
from app.config import settings

# Ensure app module can be imported (supports both direct running and module import)
if __name__ == "__main__":
    backend_dir = Path(__file__).parent.parent
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))



app = FastAPI(
    title=settings.app_name,
    description="Transform AI-generated text into human-like content",
    version=settings.app_version,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(humanize.router)
app.include_router(upload.router)
app.include_router(humanize_file.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": f"{settings.app_name} v{settings.app_version}",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": settings.app_version}


if __name__ == "__main__":
    import uvicorn
    import os
    
    # Set proxy environment variables (if needed to access OpenAI API)
    os.environ["HTTP_PROXY"] = "http://127.0.0.1:7890"
    os.environ["HTTPS_PROXY"] = "http://127.0.0.1:7890"
    
    backend_dir = Path(__file__).parent.parent
    
    print("🚀 Starting development server...")
    print(f"📍 Working directory: {backend_dir}")
    print(f"📍 App: {settings.app_name} v{settings.app_version}")
    print(f"🌐 Proxy: {os.environ.get('HTTPS_PROXY')}")
    print(f"🔗 Access: http://localhost:18201")
    print(f"📚 Docs: http://localhost:18201/docs")
    print()
    
    # Start uvicorn server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=18201,
        reload=True,
        log_level="info"
    )

