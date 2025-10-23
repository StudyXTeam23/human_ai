# 🚀 快速启动指南

## ⚡ 最简单的启动方式

### 步骤 1: 启动后端

**打开终端 1**,复制粘贴并回车:

```bash
cd /Users/yuyuan/studyx_human/web/backend && source venv/bin/activate && uvicorn app.main:app --reload
```

**看到这个就成功了:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

✅ 测试: 打开浏览器访问 http://localhost:8000/docs

---

### 步骤 2: 启动前端

**打开终端 2**,复制粘贴并回车:

```bash
cd /Users/yuyuan/studyx_human/web/frontend && pnpm dev
```

**看到这个就成功了:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

✅ 测试: 打开浏览器访问 http://localhost:3000

---

## 🎯 测试 Gemini AI

1. **访问** http://localhost:3000

2. **输入测试文本** (复制这段,至少300字符):

```
The rain tapped gently against the window pane, a soothing rhythm that calmed my restless soul. Curled up by the fireplace with a good book, I felt a profound sense of peace wash over me. The world outside could wait. This moment was mine alone, a sanctuary from the chaos of daily life. The flickering flames cast dancing shadows on the walls, creating an atmosphere of warmth and comfort. As I turned each page, I found myself transported to another world, another time. It was in these quiet moments that I truly felt alive.
```

3. **选择参数**:
   - Length: `Normal` (或试试 `Creative`/`Concise`)
   - Similarity: `Moderate`
   - Style: `Creative` (或试试其他风格)

4. **点击 "Humanize"**

5. **等待 1-3 秒** (Gemini AI 正在处理)

6. **查看结果** - 这是真实的 Gemini AI 生成的! 🤖✨

---

## 🔍 如果遇到问题

### 问题 1: 后端 ModuleNotFoundError

**解决方案:**
```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
pip install google-generativeai
```

### 问题 2: 前端端口被占用

**解决方案:**
```bash
# 杀掉占用 3000 端口的进程
lsof -ti:3000 | xargs kill -9
```

### 问题 3: 后端端口被占用

**解决方案:**
```bash
# 杀掉占用 8000 端口的进程
lsof -ti:8000 | xargs kill -9
```

---

## 📊 成功标志

### ✅ 后端成功
- 访问 http://localhost:8000 看到欢迎信息
- 访问 http://localhost:8000/docs 看到 API 文档
- 终端显示 "Application startup complete"

### ✅ 前端成功
- 访问 http://localhost:3000 看到主页
- 看到 "Free AI Humanizer" 标题
- 可以输入文本和选择参数

### ✅ Gemini AI 成功
- 点击 "Humanize" 按钮
- 等待 1-3 秒后看到结果
- 结果文本与输入不同
- 终端显示 API 请求日志

---

## 🎉 测试不同风格

尝试这些组合看看 Gemini 的效果:

### 1. 学术风格
- Style: `Academic`
- 结果: 正式、学术化的语言

### 2. 创意风格
- Style: `Creative`
- 结果: 富有想象力、文学化

### 3. 商务风格
- Style: `Business`
- 结果: 专业、简洁明了

### 4. 自定义风格
- Style: `Custom`
- 在出现的输入框输入: `like a poet writing about nature`
- 结果: 按照你的描述生成

---

## 🛑 停止服务

在两个终端中分别按 `Ctrl + C`

---

## 📱 快速访问链接

- 🌐 前端应用: http://localhost:3000
- 📚 API 文档: http://localhost:8000/docs
- 🏥 健康检查: http://localhost:8000/health

---

**现在就开始吧!** 🚀

复制上面的命令,启动服务,体验 Gemini AI 的魔力!

