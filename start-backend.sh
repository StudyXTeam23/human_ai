#!/bin/bash

echo "🚀 启动后端服务..."
echo "📍 切换到后端目录..."
cd /Users/yuyuan/studyx_human/web/backend

echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 设置代理环境变量(系统使用代理访问OpenAI)
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

echo "✅ 使用 Python: $(which python)"
echo "🌐 使用代理: $HTTPS_PROXY"
echo "✅ 启动 FastAPI 服务器..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
