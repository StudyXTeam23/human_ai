#!/bin/bash

echo "🚀 启动生产环境后端服务..."
echo "📍 切换到后端目录..."
cd "$(dirname "$0")"

echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 加载环境变量(如果存在 .env 文件)
if [ -f .env ]; then
    echo "📦 加载环境变量..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  警告: .env 文件不存在,使用默认配置"
fi

# 生产环境不设置代理
unset HTTP_PROXY
unset HTTPS_PROXY

echo "✅ 使用 Python: $(which python)"
echo "🌐 模式: 生产环境 (无代理)"
echo "✅ 启动 FastAPI 生产服务器..."

# 使用 gunicorn 启动(生产环境推荐)
if command -v gunicorn &> /dev/null; then
    echo "📦 使用 Gunicorn (多进程)"
    gunicorn app.main:app \
        --workers 4 \
        --worker-class uvicorn.workers.UvicornWorker \
        --bind 0.0.0.0:8000 \
        --timeout 120 \
        --access-logfile - \
        --error-logfile -
else
    echo "⚠️  Gunicorn 未安装,使用 Uvicorn"
    echo "💡 建议安装: pip install gunicorn"
    uvicorn app.main:app \
        --host 0.0.0.0 \
        --port 8000 \
        --workers 4 \
        --no-access-log
fi

