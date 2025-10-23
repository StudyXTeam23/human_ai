#!/bin/bash
#
# 前端部署脚本
# 用法: bash deploy-frontend.sh
#

set -e

PROJECT_DIR="/root/home/yuyuan/studyx_human/web/frontend"

echo "======================================================================"
echo "         前端部署脚本"
echo "======================================================================"

# 检查项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 项目目录不存在: $PROJECT_DIR"
    echo "请先上传项目代码到服务器"
    exit 1
fi

cd $PROJECT_DIR

echo ""
echo "📦 步骤 1: 检查配置文件..."
if [ ! -f ".env.production" ]; then
    echo "⚠️  创建 .env.production 文件"
    read -p "请输入你的域名 API URL (例如: https://api.yourdomain.com): " API_URL
    echo "NEXT_PUBLIC_API_URL=$API_URL" > .env.production
    echo "✅ 已创建 .env.production"
else
    echo "✅ .env.production 文件已存在"
    cat .env.production
fi

echo ""
echo "📦 步骤 2: 安装依赖..."
pnpm install

echo ""
echo "📦 步骤 3: 构建生产版本..."
pnpm build

echo ""
echo "📦 步骤 4: 停止旧的 PM2 进程 (如果存在)..."
pm2 delete ai-humanizer-web 2>/dev/null || true

echo ""
echo "📦 步骤 5: 启动前端应用..."
pm2 start npm --name "ai-humanizer-web" -- start -- -p 18200

echo ""
echo "📦 步骤 6: 保存 PM2 配置..."
pm2 save

echo ""
echo "📦 步骤 7: 设置 PM2 开机自启 (首次运行)..."
pm2 startup || true

echo ""
echo "📦 步骤 8: 检查状态..."
pm2 status

echo ""
echo "======================================================================"
echo "✅ 前端部署完成!"
echo "======================================================================"
echo ""
echo "📋 应用信息:"
echo "  - 应用名称: ai-humanizer-web"
echo "  - 监听端口: 3000"
echo "  - 工作目录: $PROJECT_DIR"
echo ""
echo "🔧 常用命令:"
echo "  - 查看状态: pm2 status"
echo "  - 重启应用: pm2 restart ai-humanizer-web"
echo "  - 查看日志: pm2 logs ai-humanizer-web"
echo "  - 停止应用: pm2 stop ai-humanizer-web"
echo ""
echo "🎯 下一步: 配置 Nginx"
echo "  bash deploy-scripts/setup-nginx.sh"
echo ""
echo "======================================================================"

