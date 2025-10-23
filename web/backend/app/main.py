"""FastAPI application entry point."""
from pathlib import Path
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import humanize, humanize_file, upload
from app.config import settings

# 确保可以导入 app 模块 (支持直接运行和作为模块导入)
if __name__ == "__main__":
    backend_dir = Path(__file__).parent.parent
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))



app = FastAPI(
    title=settings.app_name,
    description="将 AI 生成的文本转换为人类风格的内容",
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
    
    # 设置代理环境变量(如果需要访问 OpenAI API)
    os.environ["HTTP_PROXY"] = "http://127.0.0.1:7890"
    os.environ["HTTPS_PROXY"] = "http://127.0.0.1:7890"
    
    backend_dir = Path(__file__).parent.parent
    
    print("🚀 启动开发服务器...")
    print(f"📍 工作目录: {backend_dir}")
    print(f"📍 应用: {settings.app_name} v{settings.app_version}")
    print(f"🌐 代理: {os.environ.get('HTTPS_PROXY')}")
    print(f"🔗 访问: http://localhost:8000")
    print(f"📚 文档: http://localhost:8000/docs")
    print()
    
    # 启动 uvicorn 服务器
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

