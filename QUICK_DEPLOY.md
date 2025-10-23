# ⚡ 快速部署指南

## 🎯 快速部署步骤

### 1️⃣ 准备服务器

```bash
# SSH 登录服务器
ssh user@your-server-ip

# 安装基础依赖
sudo apt update && sudo apt upgrade -y
sudo apt install python3.11 python3.11-venv python3-pip nodejs npm nginx git -y
npm install -g pnpm pm2
```

### 2️⃣ 上传项目

```bash
# 方式 1: 使用 Git
cd /var/www
sudo git clone https://github.com/yourusername/studyx_human.git

# 方式 2: 使用 SCP (从本地上传)
scp -r /Users/yuyuan/studyx_human user@your-server-ip:/var/www/
```

### 3️⃣ 配置后端

```bash
cd /var/www/studyx_human/web/backend

# 创建虚拟环境
python3.11 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements-prod.txt

# 配置环境变量
cp .env.example .env
nano .env
```

**修改 `.env` 文件**:
```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
CORS_ORIGINS=https://yourdomain.com
HTTP_PROXY=
HTTPS_PROXY=
```

```bash
# 创建上传目录
mkdir -p uploads
chmod 755 uploads

# 测试运行
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 4️⃣ 配置前端

```bash
cd /var/www/studyx_human/web/frontend

# 安装依赖
pnpm install

# 配置环境变量
nano .env.production
```

**修改 `.env.production`**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

```bash
# 构建
pnpm build

# 测试运行
pnpm start
```

### 5️⃣ 使用 PM2 管理服务

```bash
# 启动后端 (使用 Gunicorn)
cd /var/www/studyx_human/web/backend
pm2 start "gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000" --name humanizer-api

# 启动前端
cd /var/www/studyx_human/web/frontend
pm2 start npm --name humanizer-web -- start

# 保存 PM2 配置
pm2 save
pm2 startup

# 查看状态
pm2 status
```

### 6️⃣ 配置 Nginx

```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/humanizer
```

**简化配置 (HTTP)**:
```nginx
# 前端
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# API 后端
server {
    listen 80;
    server_name api.yourdomain.com;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 120s;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/humanizer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7️⃣ 配置 HTTPS (可选)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 申请证书
sudo certbot --nginx -d yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
```

---

## 📦 一键部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 开始部署..."

# 后端部署
echo "📦 部署后端..."
cd /var/www/studyx_human/web/backend
source venv/bin/activate
pip install -r requirements-prod.txt
pm2 restart humanizer-api || pm2 start "gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000" --name humanizer-api

# 前端部署
echo "📦 部署前端..."
cd /var/www/studyx_human/web/frontend
pnpm install
pnpm build
pm2 restart humanizer-web || pm2 start npm --name humanizer-web -- start

# 重启 Nginx
echo "🔄 重启 Nginx..."
sudo systemctl restart nginx

# 保存 PM2 配置
pm2 save

echo "✅ 部署完成!"
echo "📊 查看服务状态:"
pm2 status
```

使用:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 🔧 常用命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs humanizer-api
pm2 logs humanizer-web

# 重启服务
pm2 restart humanizer-api
pm2 restart humanizer-web

# 停止服务
pm2 stop humanizer-api
pm2 stop humanizer-web

# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ 检查清单

- [ ] 服务器基础环境已安装
- [ ] 项目代码已上传
- [ ] 后端 `.env` 配置完成
- [ ] 前端 `.env.production` 配置完成
- [ ] 后端服务正常运行 (PM2)
- [ ] 前端服务正常运行 (PM2)
- [ ] Nginx 配置完成
- [ ] 域名 DNS 解析正确
- [ ] HTTPS 证书配置 (可选)
- [ ] 防火墙规则配置

---

## 🌐 DNS 配置

在你的域名服务商配置:

| 类型 | 主机记录 | 记录值 |
|------|---------|--------|
| A | @ | 你的服务器IP |
| A | api | 你的服务器IP |
| CNAME | www | @ |

---

## 🎉 完成!

访问:
- 前端: `https://yourdomain.com`
- API: `https://api.yourdomain.com/docs`
- 健康检查: `https://api.yourdomain.com/health`

