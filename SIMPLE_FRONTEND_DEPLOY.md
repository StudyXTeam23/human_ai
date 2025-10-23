# 🚀 前端最简洁部署方案

## 📋 三种部署方式 (按简洁程度排序)

---

## 方式 1: 一键脚本部署 ⭐ (最推荐)

### 步骤 1: 上传项目
```bash
# 本地打包
cd /Users/yuyuan/studyx_human
tar -czf studyx.tar.gz --exclude='node_modules' --exclude='.next' web/frontend/

# 上传到服务器
scp studyx.tar.gz root@your-server-ip:/root/home/yuyuan/

# 服务器解压
ssh root@your-server-ip
cd /root/home/yuyuan
tar -xzf studyx.tar.gz
```

### 步骤 2: 运行部署脚本
```bash
cd /root/home/yuyuan/studyx_human
bash deploy-scripts/deploy-frontend.sh
```

**完成!** 脚本会自动:
- 安装依赖
- 配置环境变量
- 构建生产版本
- 使用 PM2 启动

---

## 方式 2: 手动部署 (5 条命令)

```bash
# 1. 进入目录
cd /root/home/yuyuan/studyx_human/web/frontend

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" > .env.production

# 4. 构建
pnpm build

# 5. 启动
pm2 start npm --name "ai-humanizer-web" -- start
pm2 save
```

**完成!**

---

## 方式 3: 最简单后台运行 (3 条命令)

```bash
# 1. 进入目录并安装
cd /root/home/yuyuan/studyx_human/web/frontend && pnpm install

# 2. 构建
pnpm build

# 3. 后台启动
nohup pnpm start > frontend.log 2>&1 &
```

**完成!** 访问 `http://服务器IP:18200`

---

## 快速启动脚本

创建一键启动脚本:

```bash
cat > /root/home/yuyuan/studyx_human/start-frontend-simple.sh << 'EOF'
#!/bin/bash
cd /root/home/yuyuan/studyx_human/web/frontend
nohup pnpm start > frontend.log 2>&1 &
echo "✅ 前端已启动在端口 18200"
echo "查看日志: tail -f frontend.log"
EOF

chmod +x /root/home/yuyuan/studyx_human/start-frontend-simple.sh
```

以后只需运行:
```bash
/root/home/yuyuan/studyx_human/start-frontend-simple.sh
```

---

## 停止前端

```bash
# 找到进程
ps aux | grep "pnpm start"

# 或查看端口
lsof -i :18200

# 杀死进程
kill $(lsof -t -i:18200)

# 或使用 PM2
pm2 stop ai-humanizer-web
```

---

## 常见问题

### Q: 没有 pnpm 怎么办?
```bash
npm install -g pnpm
```

### Q: 没有 Node.js 怎么办?
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y
```

### Q: 前端无法访问?
```bash
# 检查端口
lsof -i :18200

# 检查防火墙
sudo firewall-cmd --add-port=18200/tcp --permanent
sudo firewall-cmd --reload

# 查看日志
tail -f /root/home/yuyuan/studyx_human/web/frontend/frontend.log
```

### Q: 需要修改端口吗?
前端已配置为 18200 端口,在 `package.json` 中已设置。

### Q: 如何查看日志?
```bash
# 方式 1: nohup 日志
tail -f /root/home/yuyuan/studyx_human/web/frontend/frontend.log

# 方式 2: PM2 日志
pm2 logs ai-humanizer-web

# 方式 3: 实时查看
pm2 logs ai-humanizer-web --lines 100
```

---

## 最佳实践

### 生产环境推荐: PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动
cd /root/home/yuyuan/studyx_human/web/frontend
pm2 start npm --name "ai-humanizer-web" -- start

# 开机自启
pm2 startup
pm2 save

# 管理
pm2 restart ai-humanizer-web  # 重启
pm2 stop ai-humanizer-web     # 停止
pm2 status                     # 状态
pm2 logs ai-humanizer-web     # 日志
```

**优势**:
- 自动重启
- 日志管理
- 开机自启
- 进程监控

---

## 完整流程 (首次部署)

```bash
# 1. 安装 Node.js (如果没有)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs -y
npm install -g pnpm pm2

# 2. 进入项目
cd /root/home/yuyuan/studyx_human/web/frontend

# 3. 配置环境变量
cat > .env.production << 'ENV'
NEXT_PUBLIC_API_URL=http://localhost:18201
ENV

# 4. 安装依赖
pnpm install

# 5. 构建
pnpm build

# 6. 启动
pm2 start npm --name "ai-humanizer-web" -- start
pm2 save
pm2 startup

# 完成!
echo "✅ 访问 http://$(hostname -I | awk '{print $1}'):18200"
```

---

## 验证部署

```bash
# 1. 检查进程
pm2 status
# 或
ps aux | grep node

# 2. 检查端口
netstat -tulpn | grep 18200
# 或
lsof -i :18200

# 3. 测试访问
curl http://localhost:18200
# 应该返回 HTML

# 4. 浏览器访问
# http://服务器IP:18200
```

---

## 更新部署

```bash
# 1. 停止服务
pm2 stop ai-humanizer-web

# 2. 拉取新代码/上传文件
# ...

# 3. 重新构建
cd /root/home/yuyuan/studyx_human/web/frontend
pnpm install
pnpm build

# 4. 重启
pm2 restart ai-humanizer-web

# 或使用一行命令
pm2 restart ai-humanizer-web --update-env
```

---

## 总结

**最简单**: 使用部署脚本
```bash
bash deploy-scripts/deploy-frontend.sh
```

**推荐生产**: PM2 管理
```bash
pm2 start npm --name "ai-humanizer-web" -- start
```

**快速测试**: 后台运行
```bash
nohup pnpm start > frontend.log 2>&1 &
```

**关键信息**:
- 端口: 18200
- 日志: `frontend.log` 或 `pm2 logs`
- 路径: `/root/home/yuyuan/studyx_human/web/frontend`

---

✅ **就这么简单!** 🎉

