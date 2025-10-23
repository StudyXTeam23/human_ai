#!/bin/bash
#
# 服务器环境自动配置脚本
# 用法: bash setup-server.sh
#

set -e

echo "======================================================================"
echo "         AI Humanizer - 服务器环境自动配置"
echo "======================================================================"

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
   echo "❌ 请使用 root 权限运行此脚本"
   echo "用法: sudo bash setup-server.sh"
   exit 1
fi

echo ""
echo "📦 步骤 1: 更新系统..."
apt update && apt upgrade -y

echo ""
echo "📦 步骤 2: 安装基础软件..."
apt install -y git curl wget vim build-essential software-properties-common

echo ""
echo "📦 步骤 3: 安装 Python 3.11..."
add-apt-repository ppa:deadsnakes/ppa -y
apt update
apt install -y python3.11 python3.11-venv python3-pip
python3.11 --version

echo ""
echo "📦 步骤 4: 安装 Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
node -v
npm -v

echo ""
echo "📦 步骤 5: 安装 pnpm..."
npm install -g pnpm
pnpm -v

echo ""
echo "📦 步骤 6: 安装 PM2..."
npm install -g pm2
pm2 -v

echo ""
echo "📦 步骤 7: 安装 Nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
systemctl status nginx --no-pager

echo ""
echo "📦 步骤 8: 安装 Certbot (SSL)..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "📦 步骤 9: 配置防火墙..."
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
echo "y" | ufw enable
ufw status

echo ""
echo "📦 步骤 10: 创建项目目录..."
mkdir -p /root/home/yuyuan
chown -R root:root /root/home/yuyuan

echo ""
echo "======================================================================"
echo "✅ 服务器环境配置完成!"
echo "======================================================================"
echo ""
echo "📋 已安装的软件:"
echo "  - Python: $(python3.11 --version)"
echo "  - Node.js: $(node -v)"
echo "  - pnpm: $(pnpm -v)"
echo "  - PM2: $(pm2 -v)"
echo "  - Nginx: $(nginx -v 2>&1)"
echo ""
echo "📁 项目目录: /root/home/yuyuan"
echo ""
echo "🎯 下一步:"
echo "  1. 上传项目代码到 /root/home/yuyuan/studyx_human"
echo "  2. 配置后端 .env 文件"
echo "  3. 配置前端 .env.production 文件"
echo "  4. 运行部署脚本: bash deploy-scripts/deploy-backend.sh"
echo "  5. 运行部署脚本: bash deploy-scripts/deploy-frontend.sh"
echo ""
echo "======================================================================"

