#!/bin/bash
#
# Nginx 配置脚本
# 用法: bash setup-nginx.sh
#

set -e

echo "======================================================================"
echo "         Nginx 配置脚本"
echo "======================================================================"

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
   echo "❌ 请使用 root 权限运行此脚本"
   echo "用法: sudo bash setup-nginx.sh"
   exit 1
fi

echo ""
read -p "请输入你的主域名 (例如: yourdomain.com): " DOMAIN
read -p "请输入 API 子域名 (例如: api.yourdomain.com): " API_DOMAIN

echo ""
echo "📦 创建 Nginx 配置文件..."

cat > /etc/nginx/sites-available/ai-humanizer <<EOF
# API 后端
upstream backend_api {
    server 127.0.0.1:18201;
}

# 前端
upstream frontend_web {
    server 127.0.0.1:18200;
}

# 前端主站
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # 日志
    access_log /var/log/nginx/ai-humanizer-access.log;
    error_log /var/log/nginx/ai-humanizer-error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    gzip_comp_level 6;
    gzip_min_length 256;
    
    location / {
        proxy_pass http://frontend_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# API 后端
server {
    listen 80;
    server_name $API_DOMAIN;
    
    # 日志
    access_log /var/log/nginx/ai-humanizer-api-access.log;
    error_log /var/log/nginx/ai-humanizer-api-error.log;
    
    # 文件上传大小限制
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # CORS headers (如果需要)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization' always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
        
        # 超时设置
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
EOF

echo "✅ Nginx 配置文件已创建"

echo ""
echo "📦 启用配置..."
ln -sf /etc/nginx/sites-available/ai-humanizer /etc/nginx/sites-enabled/

echo ""
echo "📦 测试 Nginx 配置..."
nginx -t

echo ""
echo "📦 重启 Nginx..."
systemctl restart nginx
systemctl status nginx --no-pager

echo ""
echo "======================================================================"
echo "✅ Nginx 配置完成!"
echo "======================================================================"
echo ""
echo "📋 域名配置:"
echo "  - 前端: http://$DOMAIN"
echo "  - API: http://$API_DOMAIN"
echo ""
echo "⚠️  重要: 请确保 DNS 已配置:"
echo "  $DOMAIN      A    服务器IP"
echo "  www.$DOMAIN  A    服务器IP"
echo "  $API_DOMAIN  A    服务器IP"
echo ""
echo "🔒 配置 SSL 证书 (推荐):"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "  sudo certbot --nginx -d $API_DOMAIN"
echo ""
echo "🧪 测试:"
echo "  curl http://$API_DOMAIN/health"
echo "  curl -I http://$DOMAIN"
echo ""
echo "======================================================================"

