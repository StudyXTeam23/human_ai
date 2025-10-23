# 快速参考卡片

## 🎯 文件人性化接口 `/api/v1/humanize-file`

### 两种模式自动选择

```
request.text 不为空  →  文本模式 (快速,推荐)
request.text 为空    →  Base64 模式 (完整信息)
```

### 模式 1: 文本模式 ⚡

**条件**: `text` 参数不为空

```json
{
  "file_path": "/path/to/file.txt",
  "text": "提取的文本内容...",
  "params": { ... }
}
```

**特点**:
- ⚡ 快速 (~2秒)
- 💰 成本低
- 📦 请求小 (~1KB)

**适用**: TXT, 简单 DOCX

---

### 模式 2: Base64 模式 🗂️

**条件**: `text` 参数为空

```json
{
  "file_path": "/path/to/file.pdf",
  "text": "",
  "params": { ... }
}
```

**特点**:
- 🗂️ 完整文件信息
- 📋 保留格式
- 📦 请求大 (~100KB+)

**适用**: PDF, 图片, 复杂文档

---

## 🔄 完整流程

### 1. 上传文件

```bash
POST /api/v1/upload
Content-Type: multipart/form-data

Response:
{
  "file_path": "/path/to/uploaded/file",
  "text": "提取的文本",
  "base64": "...",
  "chars": "123"
}
```

### 2. 人性化处理

**选项 A: 使用提取的文本 (推荐)**

```bash
POST /api/v1/humanize-file
{
  "file_path": "...",
  "text": "提取的文本",  ← 使用 upload 返回的 text
  "params": { ... }
}
```

**选项 B: 使用 Base64**

```bash
POST /api/v1/humanize-file
{
  "file_path": "...",
  "text": "",  ← 空字符串
  "params": { ... }
}
```

---

## 🚀 启动项目

### 后端

```bash
cd /Users/yuyuan/studyx_human
./start-backend.sh
```

或在 IDE 中运行:
```
web/backend/run_debug.py
```

### 前端

```bash
cd /Users/yuyuan/studyx_human
./start-frontend.sh
```

---

## 🧪 测试

### 测试两种模式

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
python test_two_modes.py
```

### 快速测试

```bash
# 健康检查
curl http://localhost:18201/health

# API 文档
open http://localhost:18201/docs
```

---

## 📊 选择建议

| 文件类型 | 推荐模式 | 原因 |
|---------|---------|------|
| `.txt` | 文本模式 | 简单纯文本 |
| `.docx` (简单) | 文本模式 | 提取准确 |
| `.docx` (复杂) | Base64 模式 | 保留格式 |
| `.pdf` | Base64 模式 | 复杂格式 |
| `.pptx` | Base64 模式 | 幻灯片格式 |

---

## 🐛 故障排除

### 问题 1: ModuleNotFoundError

**解决**: 运行 `run_debug.py` 而不是 `app/main.py`

### 问题 2: 连接失败

**检查**: 
```bash
netstat -an | grep 7890  # 代理是否运行
curl http://localhost:8000/health  # 后端是否运行
```

### 问题 3: 文本模式失败

**尝试**: 改用 Base64 模式 (text 设为空字符串)

---

## 📚 文档

- `TWO_MODES_IMPLEMENTATION.md` - 详细实现说明
- `FILE_UPLOAD_WITH_BASE64.md` - Base64 实现细节
- `README.md` - 项目总览
- `START_HERE.md` - 入门指南

---

## 🎯 最佳实践

1. **默认使用文本模式** - 更快更便宜
2. **提取失败时用 Base64** - 作为后备方案
3. **复杂文档用 Base64** - 保留完整信息
4. **监控日志** - 确认使用的模式

---

**快速记忆**:
```
有 text → 用 text (快)
无 text → 用 Base64 (全)
```

