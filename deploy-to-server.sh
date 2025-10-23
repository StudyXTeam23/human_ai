#!/bin/bash

# 服务器部署脚本
# 用法: ./deploy-to-server.sh user@server-ip

if [ -z "$1" ]; then
    echo "❌ 错误: 请提供服务器地址"
    echo "用法: ./deploy-to-server.sh user@server-ip"
    exit 1
fi

SERVER=$1
REMOTE_DIR="/var/www/studyx_human"

echo "🚀 开始部署到服务器: $SERVER"
echo "=================================================="

# 1. 创建远程目录
echo "📁 创建远程目录..."
ssh $SERVER "sudo mkdir -p $REMOTE_DIR && sudo chown -R \$USER:\$USER $REMOTE_DIR"

# 2. 上传项目文件
echo "📤 上传项目文件..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude 'venv' \
    --exclude '.next' \
    --exclude 'uploads' \
    --exclude '.git' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.DS_Store' \
    ./ $SERVER:$REMOTE_DIR/

# 3. 远程执行部署命令
echo "🔧 在服务器上执行部署..."
ssh $SERVER << 'ENDSSH'
cd /var/www/studyx_human

echo "📦 设置后端..."
cd web/backend

# 创建虚拟环境
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements-prod.txt

# 创建上传目录
mkdir -p uploads
chmod 755 uploads

# 检查 .env 文件
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件,配置 OPENAI_API_KEY"
fi

echo "📦 设置前端..."
cd ../frontend

# 安装 pnpm (如果未安装)
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
fi

pnpm install
pnpm build

echo "✅ 部署完成!"
echo ""
echo "📝 下一步:"
echo "1. 编辑后端配置: nano /var/www/studyx_human/web/backend/.env"
echo "2. 编辑前端配置: nano /var/www/studyx_human/web/frontend/.env.production"
echo "3. 启动服务: 查看 QUICK_DEPLOY.md"
ENDSSH

echo "=================================================="
echo "✅ 文件上传完成!"
echo ""
echo "🔗 请 SSH 登录服务器完成配置:"
echo "ssh $SERVER"
echo ""
echo "📚 查看部署文档:"
echo "  - 快速部署: cat /var/www/studyx_human/QUICK_DEPLOY.md"
echo "  - 完整文档: cat /var/www/studyx_human/DEPLOYMENT_GUIDE.md"

