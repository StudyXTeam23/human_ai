#!/bin/bash
#
# 前端一键启动脚本 - 最简洁版本
# 用法: bash quick-start-frontend.sh
#

set -e

FRONTEND_DIR="/root/home/yuyuan/studyx_human/web/frontend"

echo "======================================================================="
echo "         🚀 前端一键启动脚本"
echo "======================================================================="
echo ""

# 检查目录
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ 前端目录不存在: $FRONTEND_DIR"
    exit 1
fi

cd $FRONTEND_DIR

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo "请运行: curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - && sudo yum install nodejs -y"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 检查构建文件
if [ ! -d ".next" ]; then
    echo "🔨 构建生产版本..."
    
    # 创建环境变量文件 (如果不存在)
    if [ ! -f ".env.production" ]; then
        echo "⚙️  创建 .env.production..."
        echo "NEXT_PUBLIC_API_URL=http://localhost:18201" > .env.production
    fi
    
    pnpm build
fi

# 检查端口是否被占用
if lsof -Pi :18200 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  端口 18200 已被占用"
    read -p "是否停止旧进程? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $(lsof -t -i:18200) 2>/dev/null || true
        sleep 2
    else
        exit 1
    fi
fi

# 检查是否安装 PM2
if command -v pm2 &> /dev/null; then
    echo "🚀 使用 PM2 启动..."
    
    # 删除旧的 PM2 进程
    pm2 delete ai-humanizer-web 2>/dev/null || true
    
    # 启动
    pm2 start npm --name "ai-humanizer-web" -- start
    pm2 save
    
    echo ""
    echo "======================================================================="
    echo "✅ 前端已启动 (PM2 管理)"
    echo "======================================================================="
    echo ""
    echo "📊 查看状态: pm2 status"
    echo "📋 查看日志: pm2 logs ai-humanizer-web"
    echo "🔄 重启服务: pm2 restart ai-humanizer-web"
    echo "🛑 停止服务: pm2 stop ai-humanizer-web"
    echo ""
    echo "🌐 访问地址: http://$(hostname -I | awk '{print $1}' | tr -d ' '):18200"
    echo "======================================================================="
else
    echo "🚀 后台启动..."
    nohup pnpm start > frontend.log 2>&1 &
    PID=$!
    echo $PID > frontend.pid
    
    echo ""
    echo "======================================================================="
    echo "✅ 前端已启动 (后台运行)"
    echo "======================================================================="
    echo ""
    echo "📊 进程 PID: $PID"
    echo "📋 查看日志: tail -f $FRONTEND_DIR/frontend.log"
    echo "🛑 停止服务: kill $PID 或 kill \$(cat frontend.pid)"
    echo ""
    echo "💡 提示: 安装 PM2 可获得更好的进程管理"
    echo "   npm install -g pm2"
    echo ""
    echo "🌐 访问地址: http://$(hostname -I | awk '{print $1}' | tr -d ' '):18200"
    echo "======================================================================="
fi

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 测试服务
if curl -s http://localhost:18200 >/dev/null 2>&1; then
    echo "✅ 服务启动成功!"
else
    echo "⚠️  服务可能需要更多时间启动,请稍后访问"
fi

echo ""

