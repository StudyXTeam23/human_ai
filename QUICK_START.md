# 🚀 快速启动指南

## 前提条件

- ✅ Node.js 18+ 已安装
- ✅ pnpm 已安装
- ✅ Python 3.11+ 已安装

---

## 🎯 启动步骤

### 步骤 1: 启动后端 (FastAPI)

打开**第一个终端**:

```bash
# 1. 进入后端目录
cd /Users/yuyuan/studyx_human/web/backend

# 2. 激活虚拟环境
source venv/bin/activate

# 3. 启动 FastAPI 服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**预期输出:**
```
INFO:     Will watch for changes in these directories: ['/Users/yuyuan/studyx_human/web/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**验证后端:**
- 访问 http://localhost:18201 - 应该看到欢迎信息
- 访问 http://localhost:18201/docs - 应该看到 Swagger API 文档
- 访问 http://localhost:18201/health - 应该返回 `{"status":"healthy"}`

✅ **后端启动成功!**

---

### 步骤 2: 启动前端 (Next.js)

打开**第二个终端**:

```bash
# 1. 进入前端目录
cd /Users/yuyuan/studyx_human/web/frontend

# 2. 启动开发服务器
pnpm dev
```

**预期输出:**
```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

**验证前端:**
- 访问 http://localhost:3000
- 应该看到 "Free AI Humanizer – 100% Human-Written Quality" 标题
- 应该看到文本输入框和参数选择器

✅ **前端启动成功!**

---

## 🧪 测试功能

### 测试 1: 基本文本处理

1. 在文本框中输入或粘贴至少 300 个字符的文本
   
   **示例文本:**
   ```
   The rain tapped gently against the window pane, a soothing rhythm that calmed my restless soul. Curled up by the fireplace with a good book, I felt a profound sense of peace wash over me. The world outside could wait. This moment was mine alone, a sanctuary from the chaos of daily life. The flickering flames cast dancing shadows on the walls, creating an atmosphere of warmth and comfort. As I turned each page, I found myself transported to another world, another time.
   ```

2. 选择参数:
   - **Length**: Normal (或选择 Concise/Expanded)
   - **Similarity**: Moderate (或选择 Low/High/Neutral)
   - **Style**: Neutral (或尝试 Academic/Creative/等)

3. 点击 **"Humanize"** 按钮

4. **预期结果:**
   - 按钮显示 loading 状态 (~1秒)
   - 看到 "成功" 的 Toast 通知
   - 下方显示处理后的文本
   - 显示字符统计

5. **测试操作:**
   - 点击 **"Copy"** 按钮 → 文本复制到剪贴板
   - 点击 **"Download"** 按钮 → 下载 .txt 文件
   - 点击 **"Clear"** 按钮 → 清空所有内容

### 测试 2: 自定义风格

1. 输入文本 (300+ 字符)
2. Style 选择 **"Custom"**
3. 在出现的输入框中输入: `"Professional and engaging"`
4. 点击 **"Humanize"**
5. 查看结果中是否包含 `[Professional and engaging]` 标记

### 测试 3: 验证规则

**测试最小字符数:**
- 输入少于 300 字符
- 应该看到红色错误提示: "最少需要 300 个字符"
- "Humanize" 按钮应该被禁用

**测试最大字符数:**
- 输入超过 5000 字符
- 应该看到红色错误提示: "最多支持 5000 个字符"
- "Humanize" 按钮应该被禁用

---

## 📱 访问地址总结

| 服务 | 地址 | 说明 |
|------|------|------|
| **前端应用** | http://localhost:3000 | 主应用界面 |
| **API 文档** | http://localhost:18201/docs | Swagger UI |
| **API Root** | http://localhost:18201 | API 根路径 |
| **健康检查** | http://localhost:18201/health | 健康状态 |

---

## 🛑 停止服务

### 停止后端
在后端终端按 `Ctrl + C`

### 停止前端
在前端终端按 `Ctrl + C`

---

## ❓ 常见问题

### Q1: 后端启动失败: "ModuleNotFoundError"
**解决方案:**
```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
pip install -r requirements.txt
```

### Q2: 前端启动失败: "command not found: pnpm"
**解决方案:**
```bash
npm install -g pnpm
```

### Q3: 端口被占用
**后端端口 8000 被占用:**
```bash
# 使用不同端口
uvicorn app.main:app --reload --port 8001
```

**前端端口 3000 被占用:**
```bash
# Next.js 会自动使用 3001
pnpm dev
```

### Q4: CORS 错误
**确保后端配置正确:**
- 检查 `web/backend/app/config.py`
- `cors_origins` 应该包含 `http://localhost:3000`

### Q5: API 调用失败
**检查环境变量:**
1. 创建 `web/frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:18201
```
2. 重启前端服务

---

## 🎯 快速命令参考

**一键启动脚本 (可选):**

创建 `start.sh`:
```bash
#!/bin/bash

# 启动后端
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &

# 等待后端启动
sleep 3

# 启动前端
cd /Users/yuyuan/studyx_human/web/frontend
pnpm dev
```

使用:
```bash
chmod +x start.sh
./start.sh
```

---

## ✅ 验证清单

- [ ] 后端在 http://localhost:18201 运行
- [ ] 前端在 http://localhost:3000 运行
- [ ] API 文档可访问 http://localhost:18201/docs
- [ ] 可以输入文本并处理
- [ ] 可以看到处理结果
- [ ] 复制和下载功能正常
- [ ] 参数选择正常工作
- [ ] 字符计数实时更新

---

**全部完成后,你就可以开始使用 AI Text Humanizer 了!** 🎉

