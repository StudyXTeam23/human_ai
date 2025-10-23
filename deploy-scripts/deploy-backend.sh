#!/bin/bash
#
# 后端部署脚本
# 用法: bash deploy-backend.sh
#

set -e

PROJECT_DIR="/var/www/studyx_human/web/backend"

echo "======================================================================"
echo "         后端部署脚本"
echo "======================================================================"

# 检查项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 项目目录不存在: $PROJECT_DIR"
    echo "请先上传项目代码到服务器"
    exit 1
fi

cd $PROJECT_DIR

echo ""
echo "📦 步骤 1: 创建虚拟环境..."
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
    echo "✅ 虚拟环境创建完成"
else
    echo "✅ 虚拟环境已存在"
fi

echo ""
echo "📦 步骤 2: 激活虚拟环境并安装依赖..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements-prod.txt

echo ""
echo "📦 步骤 3: 检查配置文件..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "⚠️  已创建 .env 文件,请编辑并添加 OPENAI_API_KEY"
        echo "   vim $PROJECT_DIR/.env"
        read -p "按 Enter 继续编辑 .env 文件..." 
        vim .env
    else
        echo "❌ .env.example 文件不存在"
        exit 1
    fi
else
    echo "✅ .env 文件已存在"
fi

echo ""
echo "📦 步骤 4: 创建上传目录..."
mkdir -p uploads
chmod 755 uploads

echo ""
echo "📦 步骤 5: 测试后端..."
echo "启动测试服务器 (Ctrl+C 停止)..."
echo ""
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
UVICORN_PID=$!

sleep 5

# 测试健康检查
echo "测试健康检查..."
if curl -s http://localhost:8000/health | grep -q "healthy"; then
    echo "✅ 后端测试成功!"
else
    echo "❌ 后端测试失败"
    kill $UVICORN_PID
    exit 1
fi

kill $UVICORN_PID
sleep 2

echo ""
echo "📦 步骤 6: 配置 Systemd 服务..."
sudo tee /etc/systemd/system/ai-humanizer-api.service > /dev/null <<EOF
[Unit]
Description=AI Text Humanizer API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=$PROJECT_DIR
Environment="PATH=$PROJECT_DIR/venv/bin"
EnvironmentFile=$PROJECT_DIR/.env
ExecStart=$PROJECT_DIR/venv/bin/gunicorn \
    app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:18201 \
    --timeout 120 \
    --access-logfile /var/log/ai-humanizer/access.log \
    --error-logfile /var/log/ai-humanizer/error.log
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "📦 步骤 7: 创建日志目录..."
sudo mkdir -p /var/log/ai-humanizer
sudo chown www-data:www-data /var/log/ai-humanizer

echo ""
echo "📦 步骤 8: 设置权限..."
sudo chown -R www-data:www-data $PROJECT_DIR

echo ""
echo "📦 步骤 9: 启动服务..."
sudo systemctl daemon-reload
sudo systemctl enable ai-humanizer-api
sudo systemctl start ai-humanizer-api

sleep 3

echo ""
echo "📦 步骤 10: 检查服务状态..."
sudo systemctl status ai-humanizer-api --no-pager

echo ""
echo "======================================================================"
echo "✅ 后端部署完成!"
echo "======================================================================"
echo ""
echo "📋 服务信息:"
echo "  - 服务名称: ai-humanizer-api"
echo "  - 监听端口: 8000"
echo "  - 工作目录: $PROJECT_DIR"
echo "  - 日志目录: /var/log/ai-humanizer"
echo ""
echo "🔧 常用命令:"
echo "  - 查看状态: sudo systemctl status ai-humanizer-api"
echo "  - 重启服务: sudo systemctl restart ai-humanizer-api"
echo "  - 查看日志: sudo journalctl -u ai-humanizer-api -f"
echo ""
echo "🎯 下一步: 部署前端"
echo "  bash deploy-scripts/deploy-frontend.sh"
echo ""
echo "======================================================================"

