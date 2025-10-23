# 🚀 服务器部署指南

## 📋 目录

1. [系统要求](#系统要求)
2. [后端部署](#后端部署)
3. [前端部署](#前端部署)
4. [Nginx 配置](#nginx-配置)
5. [Docker 部署](#docker-部署)
6. [监控和日志](#监控和日志)
7. [常见问题](#常见问题)

---

## 系统要求

### 服务器配置
- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **CPU**: 2核心+
- **内存**: 4GB+
- **磁盘**: 20GB+
- **网络**: 公网 IP,开放 80/443 端口

### 软件依赖
- Python 3.11+
- Node.js 18+
- Nginx 1.18+
- PM2 (可选)
- Docker & Docker Compose (可选)

---

## 后端部署

### 1. 准备服务器

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Python 3.11
sudo apt install python3.11 python3.11-venv python3-pip -y

# 安装 Nginx
sudo apt install nginx -y

# 安装 Git
sudo apt install git -y
```

### 2. 克隆项目

```bash
# 创建部署目录
sudo mkdir -p /var/www
cd /var/www

# 克隆项目 (或使用 scp/rsync 上传)
git clone https://github.com/yourusername/studyx_human.git
cd studyx_human/web/backend
```

### 3. 配置后端环境

```bash
# 创建虚拟环境
python3.11 -m venv venv
source venv/bin/activate

# 安装生产依赖
pip install --upgrade pip
pip install -r requirements-prod.txt

# 创建 .env 文件
cp .env.example .env
nano .env
```

**编辑 `.env` 文件**:

```bash
# OpenAI API Key (必填)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# OpenAI 配置
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_URL=https://api.openai.com/v1/chat/completions

# CORS 配置
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# 服务器配置
HOST=0.0.0.0
PORT=8000

# 生产环境无需代理
HTTP_PROXY=
HTTPS_PROXY=
```

### 4. 创建上传目录

```bash
mkdir -p uploads
chmod 755 uploads
```

### 5. 测试运行

```bash
# 测试后端是否正常启动
source venv/bin/activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# 访问测试
curl http://localhost:18201/health
```

### 6. 配置系统服务 (Systemd)

创建服务文件:

```bash
sudo nano /etc/systemd/system/humanizer-api.service
```

内容:

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
ExecStart=/var/www/studyx_human/web/backend/venv/bin/gunicorn \
    app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --timeout 120 \
    --access-logfile /var/log/humanizer-api/access.log \
    --error-logfile /var/log/humanizer-api/error.log
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

创建日志目录:

```bash
sudo mkdir -p /var/log/humanizer-api
sudo chown www-data:www-data /var/log/humanizer-api
```

启动服务:

```bash
# 重载服务配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start humanizer-api

# 开机自启
sudo systemctl enable humanizer-api

# 查看状态
sudo systemctl status humanizer-api

# 查看日志
sudo journalctl -u humanizer-api -f
```

---

## 前端部署

### 1. 准备 Node.js 环境

```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y

# 验证安装
node -v
npm -v

# 安装 pnpm
npm install -g pnpm
```

### 2. 构建前端

```bash
cd /var/www/studyx_human/web/frontend

# 安装依赖
pnpm install

# 创建生产环境变量
nano .env.production
```

**编辑 `.env.production`**:

```bash
# 生产环境 API URL
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

构建:

```bash
# 构建生产版本
pnpm build

# 测试构建结果
pnpm start
```

### 3. 使用 PM2 管理前端

```bash
# 安装 PM2
npm install -g pm2

# 启动前端
cd /var/www/studyx_human/web/frontend
pm2 start npm --name "humanizer-web" -- start

# 开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
pm2 logs humanizer-web
```

---

## Nginx 配置

### 1. 基础配置

创建 Nginx 配置文件:

```bash
sudo nano /etc/nginx/sites-available/humanizer
```

**配置内容**:

```nginx
# API 后端服务器
upstream backend_api {
    server 127.0.0.1:8000;
}

# 前端服务器
upstream frontend_web {
    server 127.0.0.1:3000;
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - 前端
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL 证书配置 (使用 Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 日志
    access_log /var/log/nginx/humanizer-access.log;
    error_log /var/log/nginx/humanizer-error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 前端代理
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

# HTTPS - API 后端
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # 日志
    access_log /var/log/nginx/humanizer-api-access.log;
    error_log /var/log/nginx/humanizer-api-error.log;
    
    # 文件上传大小限制
    client_max_body_size 50M;
    
    # API 代理
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

### 2. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/humanizer /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 3. SSL 证书 (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 申请证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## Docker 部署

### 1. 后端 Dockerfile

创建 `web/backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements-prod.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements-prod.txt

# 复制应用代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads && chmod 755 uploads

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120"]
```

### 2. 前端 Dockerfile

创建 `web/frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# 依赖阶段
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# 生产阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 3. Docker Compose

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./web/backend
      dockerfile: Dockerfile
    container_name: humanizer-api
    restart: always
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-4o-mini
      - CORS_ORIGINS=https://yourdomain.com
    volumes:
      - ./web/backend/uploads:/app/uploads
    env_file:
      - ./web/backend/.env

  frontend:
    build:
      context: ./web/frontend
      dockerfile: Dockerfile
    container_name: humanizer-web
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    container_name: humanizer-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
```

### 4. 启动 Docker

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 监控和日志

### 1. 查看后端日志

```bash
# Systemd 服务日志
sudo journalctl -u humanizer-api -f

# 应用日志
sudo tail -f /var/log/humanizer-api/access.log
sudo tail -f /var/log/humanizer-api/error.log
```

### 2. 查看前端日志

```bash
# PM2 日志
pm2 logs humanizer-web

# PM2 监控
pm2 monit
```

### 3. Nginx 日志

```bash
sudo tail -f /var/log/nginx/humanizer-access.log
sudo tail -f /var/log/nginx/humanizer-error.log
```

---

## 常见问题

### 1. OpenAI API 连接超时

**问题**: 服务器连接 OpenAI API 超时

**解决**:
- 确认服务器网络正常
- 检查防火墙规则
- 如果需要代理,在 `.env` 中配置 `HTTP_PROXY` 和 `HTTPS_PROXY`

### 2. 文件上传失败

**问题**: 上传文件返回 413 错误

**解决**:
```nginx
# 在 Nginx 配置中增加
client_max_body_size 50M;
```

### 3. CORS 错误

**问题**: 前端请求后端时出现 CORS 错误

**解决**:
```bash
# 在后端 .env 中配置正确的前端域名
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 4. 权限问题

**问题**: 上传目录无法写入

**解决**:
```bash
sudo chown -R www-data:www-data /var/www/studyx_human/web/backend/uploads
sudo chmod -R 755 /var/www/studyx_human/web/backend/uploads
```

---

## 快速部署命令

```bash
# 1. 后端部署
cd /var/www/studyx_human/web/backend
source venv/bin/activate
pip install -r requirements-prod.txt
sudo systemctl restart humanizer-api

# 2. 前端部署
cd /var/www/studyx_human/web/frontend
pnpm install
pnpm build
pm2 restart humanizer-web

# 3. 重启 Nginx
sudo systemctl restart nginx

# 4. 查看状态
sudo systemctl status humanizer-api
pm2 status
sudo systemctl status nginx
```

---

## 安全建议

1. **防火墙配置**
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

2. **定期更新**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **API Key 保护**
- 不要将 API Key 提交到 Git
- 使用环境变量管理敏感信息
- 定期轮换 API Key

4. **备份**
```bash
# 备份上传文件
rsync -av /var/www/studyx_human/web/backend/uploads /backup/

# 备份配置文件
cp /var/www/studyx_human/web/backend/.env /backup/
```

---

**部署完成!** 🎉

访问您的域名测试应用是否正常运行。

