# 🚀 Linux 服务器部署完整指南

## 📋 目录

1. [准备工作](#准备工作)
2. [服务器环境配置](#服务器环境配置)
3. [上传项目](#上传项目)
4. [后端部署](#后端部署)
5. [前端部署](#前端部署)
6. [Nginx 配置](#nginx-配置)
7. [SSL 证书](#ssl-证书)
8. [启动和管理](#启动和管理)
9. [故障排查](#故障排查)

---

## 准备工作

### 服务器要求
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **CPU**: 2核心+
- **内存**: 4GB+
- **磁盘**: 20GB+
- **网络**: 公网 IP,开放 80/443 端口

### 本地准备
- 服务器 SSH 访问权限
- 域名 (yourdomain.com)
- OpenAI API Key

---

## 服务器环境配置

### 1. 连接到服务器

```bash
ssh root@your-server-ip
# 或使用密钥
ssh -i ~/.ssh/your-key.pem root@your-server-ip
```

### 2. 更新系统

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### 3. 安装基础软件

```bash
# Ubuntu/Debian
sudo apt install -y git curl wget vim build-essential

# CentOS/RHEL
sudo yum install -y git curl wget vim gcc make
```

### 4. 安装 Python 3.11

```bash
# Ubuntu/Debian
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install -y python3.11 python3.11-venv python3-pip

# 验证安装
python3.11 --version
```

### 5. 安装 Node.js 18

```bash
# 使用 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v  # 应该显示 v18.x.x
npm -v

# 安装 pnpm
npm install -g pnpm
pnpm -v
```

### 6. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

### 7. 安装 PM2 (进程管理器)

```bash
npm install -g pm2
pm2 -v
```

---

## 上传项目

### 方式 1: 使用 Git (推荐)

```bash
# 在服务器上创建目录
sudo mkdir -p /var/www
cd /var/www

# 克隆项目
sudo git clone https://github.com/yourusername/studyx_human.git
sudo chown -R $USER:$USER studyx_human
cd studyx_human
```

### 方式 2: 使用 SCP/RSYNC (从本地上传)

```bash
# 在本地执行 (从项目根目录)
cd /Users/yuyuan/studyx_human

# 创建压缩包 (排除不必要的文件)
tar -czf studyx_human.tar.gz \
  --exclude='node_modules' \
  --exclude='venv' \
  --exclude='.next' \
  --exclude='__pycache__' \
  --exclude='.git' \
  --exclude='uploads' \
  .

# 上传到服务器
scp studyx_human.tar.gz root@your-server-ip:/var/www/

# 在服务器上解压
ssh root@your-server-ip
cd /var/www
tar -xzf studyx_human.tar.gz
mv studyx_human studyx_human_backup  # 如果已存在
mkdir studyx_human
tar -xzf studyx_human.tar.gz -C studyx_human
rm studyx_human.tar.gz
```

### 方式 3: 使用部署脚本

在本地创建 `deploy.sh`:

```bash
#!/bin/bash
SERVER="root@your-server-ip"
REMOTE_DIR="/var/www/studyx_human"

echo "🚀 开始部署到 $SERVER"

# 上传文件
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude 'venv' \
  --exclude '.next' \
  --exclude '__pycache__' \
  --exclude '.git' \
  --exclude 'uploads' \
  ./ $SERVER:$REMOTE_DIR/

echo "✅ 文件上传完成"
```

---

## 后端部署

### 1. 进入后端目录

```bash
cd /var/www/studyx_human/web/backend
```

### 2. 创建虚拟环境

```bash
python3.11 -m venv venv
source venv/bin/activate
```

### 3. 安装依赖

```bash
pip install --upgrade pip
pip install -r requirements-prod.txt
```

### 4. 配置环境变量

```bash
# 复制示例配置
cp .env.example .env

# 编辑配置
vim .env
```

**.env 文件内容** (⚠️ 重要):

```bash
# 应用配置
APP_NAME="AI Text Humanizer API"
APP_VERSION="1.0.0"

# OpenAI API (必填)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_URL=https://api.openai.com/v1/chat/completions

# CORS 配置 (替换为你的域名)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 服务器配置
HOST=0.0.0.0
PORT=8000

# 生产环境不使用代理
HTTP_PROXY=
HTTPS_PROXY=
```

### 5. 创建上传目录

```bash
mkdir -p uploads
chmod 755 uploads
```

### 6. 测试运行

```bash
# 测试后端是否正常
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# 在另一个终端测试
curl http://localhost:8000/health
# 应该返回: {"status":"healthy","version":"1.0.0"}

# 测试完成后 Ctrl+C 停止
```

### 7. 配置 Systemd 服务

创建服务文件:

```bash
sudo vim /etc/systemd/system/ai-humanizer-api.service
```

**服务配置内容**:

```ini
[Unit]
Description=AI Text Humanizer API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/studyx_human/web/backend
Environment="PATH=/var/www/studyx_human/web/backend/venv/bin"
EnvironmentFile=/var/www/studyx_human/web/backend/.env

# 使用 Gunicorn 启动 (生产环境推荐)
ExecStart=/var/www/studyx_human/web/backend/venv/bin/gunicorn \
    app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --access-logfile /var/log/ai-humanizer/access.log \
    --error-logfile /var/log/ai-humanizer/error.log

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 8. 创建日志目录和设置权限

```bash
# 创建日志目录
sudo mkdir -p /var/log/ai-humanizer
sudo chown www-data:www-data /var/log/ai-humanizer

# 设置项目权限
sudo chown -R www-data:www-data /var/www/studyx_human/web/backend
```

### 9. 启动后端服务

```bash
# 重载 systemd
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start ai-humanizer-api

# 开机自启
sudo systemctl enable ai-humanizer-api

# 查看状态
sudo systemctl status ai-humanizer-api

# 查看日志
sudo journalctl -u ai-humanizer-api -f
```

---

## 前端部署

### 1. 进入前端目录

```bash
cd /var/www/studyx_human/web/frontend
```

### 2. 配置生产环境变量

```bash
vim .env.production
```

**.env.production 内容**:

```bash
# 生产环境 API URL (替换为你的域名)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 构建生产版本

```bash
pnpm build
```

### 5. 使用 PM2 管理前端

```bash
# 启动前端应用
pm2 start npm --name "ai-humanizer-web" -- start

# 设置开机自启
pm2 startup
# 复制输出的命令并执行

pm2 save

# 查看状态
pm2 status
pm2 logs ai-humanizer-web
```

---

## Nginx 配置

### 1. 创建 Nginx 配置文件

```bash
sudo vim /etc/nginx/sites-available/ai-humanizer
```

### 2. 基础配置 (HTTP)

```nginx
# API 后端
upstream backend_api {
    server 127.0.0.1:8000;
}

# 前端
upstream frontend_web {
    server 127.0.0.1:3000;
}

# 前端主站
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # 日志
    access_log /var/log/nginx/ai-humanizer-access.log;
    error_log /var/log/nginx/ai-humanizer-error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    location / {
        proxy_pass http://frontend_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# API 后端
server {
    listen 80;
    server_name api.yourdomain.com;
    
    # 日志
    access_log /var/log/nginx/ai-humanizer-api-access.log;
    error_log /var/log/nginx/ai-humanizer-api-error.log;
    
    # 文件上传大小限制
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://backend_api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/ai-humanizer /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

## SSL 证书 (HTTPS)

### 使用 Let's Encrypt (免费)

```bash
# 1. 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 2. 申请证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# 3. 自动续期测试
sudo certbot renew --dry-run

# 4. 设置自动续期 (已自动配置)
sudo systemctl status certbot.timer
```

Certbot 会自动修改 Nginx 配置,添加 SSL 支持。

### 手动 HTTPS 配置 (可选)

如果你有自己的证书,更新 Nginx 配置:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # ... 其他配置
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 启动和管理

### 启动所有服务

```bash
# 1. 启动后端
sudo systemctl start ai-humanizer-api
sudo systemctl status ai-humanizer-api

# 2. 启动前端
pm2 start ai-humanizer-web
pm2 status

# 3. 重启 Nginx
sudo systemctl restart nginx
sudo systemctl status nginx
```

### 查看日志

```bash
# 后端日志
sudo journalctl -u ai-humanizer-api -f
sudo tail -f /var/log/ai-humanizer/access.log
sudo tail -f /var/log/ai-humanizer/error.log

# 前端日志
pm2 logs ai-humanizer-web

# Nginx 日志
sudo tail -f /var/log/nginx/ai-humanizer-access.log
sudo tail -f /var/log/nginx/ai-humanizer-error.log
```

### 重启服务

```bash
# 重启后端
sudo systemctl restart ai-humanizer-api

# 重启前端
pm2 restart ai-humanizer-web

# 重启 Nginx
sudo systemctl restart nginx
```

### 停止服务

```bash
# 停止后端
sudo systemctl stop ai-humanizer-api

# 停止前端
pm2 stop ai-humanizer-web

# 停止 Nginx
sudo systemctl stop nginx
```

---

## 故障排查

### 1. 后端无法启动

```bash
# 查看详细日志
sudo journalctl -u ai-humanizer-api -n 100 --no-pager

# 检查端口占用
sudo netstat -tulpn | grep 8000

# 检查 Python 环境
cd /var/www/studyx_human/web/backend
source venv/bin/activate
python -c "import fastapi; print('FastAPI OK')"
```

### 2. 前端无法访问

```bash
# 查看 PM2 日志
pm2 logs ai-humanizer-web --lines 100

# 检查端口
sudo netstat -tulpn | grep 3000

# 检查构建文件
ls -la /var/www/studyx_human/web/frontend/.next
```

### 3. Nginx 错误

```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 检查防火墙
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 4. 无法连接 OpenAI API

```bash
# 测试网络连接
curl -I https://api.openai.com

# 检查环境变量
cat /var/www/studyx_human/web/backend/.env | grep OPENAI

# 测试 API
curl -X POST http://localhost:8000/api/v1/humanize \
  -H "Content-Type: application/json" \
  -d '{"source":{"mode":"text","text":"Test"},"params":{"length":"Normal","similarity":"Moderate","style":"Neutral"}}'
```

### 5. 权限问题

```bash
# 修复权限
sudo chown -R www-data:www-data /var/www/studyx_human/web/backend
sudo chmod -R 755 /var/www/studyx_human/web/backend
sudo chmod -R 755 /var/www/studyx_human/web/backend/uploads
```

---

## 🔧 维护和更新

### 更新代码

```bash
cd /var/www/studyx_human

# Git 方式
git pull origin main

# 或重新上传文件
rsync -avz --exclude 'node_modules' --exclude 'venv' ...

# 更新后端
cd web/backend
source venv/bin/activate
pip install -r requirements-prod.txt
sudo systemctl restart ai-humanizer-api

# 更新前端
cd ../frontend
pnpm install
pnpm build
pm2 restart ai-humanizer-web
```

### 备份

```bash
# 备份数据库配置
sudo tar -czf backup-$(date +%Y%m%d).tar.gz \
  /var/www/studyx_human/web/backend/.env \
  /var/www/studyx_human/web/backend/uploads

# 定期备份脚本
echo "0 2 * * * tar -czf /backup/ai-humanizer-\$(date +\%Y\%m\%d).tar.gz /var/www/studyx_human/web/backend/uploads" | crontab -
```

---

## 📊 性能优化

### 1. 增加 Worker 数量

```bash
# 编辑服务文件
sudo vim /etc/systemd/system/ai-humanizer-api.service

# 修改 --workers 参数
--workers 8  # 根据 CPU 核心数调整
```

### 2. 配置缓存

```nginx
# Nginx 缓存配置
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 启用日志轮转

```bash
sudo vim /etc/logrotate.d/ai-humanizer
```

```
/var/log/ai-humanizer/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload ai-humanizer-api > /dev/null 2>&1 || true
    endscript
}
```

---

## ✅ 部署检查清单

- [ ] 服务器环境已安装 (Python, Node.js, Nginx)
- [ ] 项目代码已上传
- [ ] 后端 .env 已配置 (OPENAI_API_KEY)
- [ ] 前端 .env.production 已配置
- [ ] 后端依赖已安装
- [ ] 前端已构建
- [ ] 后端 Systemd 服务已配置
- [ ] 前端 PM2 已配置
- [ ] Nginx 配置已完成
- [ ] SSL 证书已配置
- [ ] 防火墙端口已开放
- [ ] DNS 已解析到服务器 IP
- [ ] 所有服务已启动
- [ ] 健康检查通过

---

## 🎯 测试部署

```bash
# 1. 健康检查
curl https://api.yourdomain.com/health

# 2. 访问前端
curl -I https://yourdomain.com

# 3. 测试 API
curl -X POST https://api.yourdomain.com/api/v1/humanize \
  -H "Content-Type: application/json" \
  -d '{"source":{"mode":"text","text":"'$(python3 -c 'print("x" * 500)')'"}, "params":{"length":"Normal","similarity":"Moderate","style":"Neutral"}}'
```

---

**部署完成!** 🎉

访问你的域名测试: `https://yourdomain.com`

