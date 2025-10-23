# Humanize File API 文档

## 🎯 新增接口说明

为了更好地处理文件上传场景,新增了一个专门的 `humanize-file` 接口,用于处理文档模式的文本人性化。

## 🔄 工作流程

### 旧流程 (humanize 接口)
```
上传文件 → 提取文本 → 发送文本到 humanize → OpenAI 处理 → 返回结果
```

### 新流程 (humanize-file 接口)
```
上传文件 → 保存文件路径 → 发送路径+文本到 humanize-file → 读取文件转 base64 → OpenAI 处理 → 返回结果
```

## 📡 API 端点

### 1. 上传文件 (保持不变)

**端点**: `POST /api/v1/upload`

**请求**: `multipart/form-data`

**响应**:
```json
{
  "filename": "test.pdf",
  "text": "提取的文本内容...",
  "base64": "文件的 base64 编码...",
  "size": "1024567",
  "chars": "1234",
  "file_path": "/path/to/uploads/timestamp_test.pdf"  ← 新增
}
```

### 2. 文本人性化 (文本模式)

**端点**: `POST /api/v1/humanize`

**用途**: 处理手动输入的文本

**请求**:
```json
{
  "source": {
    "mode": "text",
    "text": "用户输入的文本..."
  },
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Friendly"
  }
}
```

### 3. 文件人性化 (文档模式) ✨ 新增

**端点**: `POST /api/v1/humanize-file`

**用途**: 处理上传的文件,支持 base64 转换

**请求**:
```json
{
  "file_path": "/path/to/uploads/timestamp_test.pdf",
  "text": "从文件提取的文本...",
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Friendly"
  }
}
```

**响应**:
```json
{
  "content": "人性化后的文本...",
  "chars": 1234,
  "processingTime": 5000
}
```

## 🔧 实现细节

### 后端实现

**文件**: `web/backend/app/api/humanize_file.py`

**核心功能**:
1. 接收文件路径和提取的文本
2. 验证文件是否存在
3. 读取文件并转换为 base64
4. 构建增强的提示词(包含文件信息)
5. 调用 OpenAI API
6. 返回处理结果

**增强提示词**:
```python
enhanced_text = f"""[File: {file_path.name}]
[Original Content Length: {len(request.text)} characters]

{request.text}

Note: This content is from a document file. Please rewrite it naturally 
while preserving the document's intent and structure."""
```

### 前端实现

**文件**: `web/frontend/lib/api.ts`

**新增函数**:
```typescript
export async function humanizeFile(
  request: HumanizeFileRequest
): Promise<HumanizeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/humanize-file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  return response.json();
}
```

**调用逻辑** (`app/page.tsx`):
```typescript
if (data.mode === "document" && filePath) {
  // 文档模式: 使用 humanize-file 接口
  response = await humanizeFile({
    file_path: filePath,
    text: data.text,
    params: { ... }
  });
} else {
  // 文本模式: 使用 humanize 接口
  response = await humanizeText({
    source: { mode: data.mode, text: data.text },
    params: { ... }
  });
}
```

## 🎯 两个接口的区别

| 特性 | humanize | humanize-file |
|------|----------|---------------|
| **用途** | 文本模式 | 文档模式 |
| **输入** | 文本内容 | 文件路径 + 文本 |
| **Base64** | 不涉及 | 自动转换 |
| **提示词** | 标准提示 | 增强提示(含文件信息) |
| **长度限制** | 300-5000 字符 | 无限制 |
| **调用时机** | Text 标签页 | Document 标签页 |

## 📊 使用场景

### 场景 1: 手动输入文本
```typescript
// 用户在 Text 标签页输入文本
mode: "text"
text: "用户输入的文本..."

// 调用 humanize 接口
POST /api/v1/humanize
```

### 场景 2: 上传文件
```typescript
// 用户在 Document 标签页上传文件
mode: "document"
file_path: "/uploads/123456_document.pdf"
text: "从 PDF 提取的文本..."

// 调用 humanize-file 接口
POST /api/v1/humanize-file
```

## 🧪 测试

### 运行测试脚本

```bash
cd web/backend
source venv/bin/activate
python test_humanize_file.py
```

### 预期输出

```
============================================================
测试 humanize-file 接口
============================================================

📤 步骤 1: 上传文件
✅ 上传成功!
   文件路径: /path/to/uploads/1234567890_test_humanize_file.txt
   提取字符数: 365

🤖 步骤 2: 调用 humanize-file 接口
✅ 处理成功!
   输出字符数: 351
   处理时间: 5000ms

📝 人性化后的文本:
------------------------------------------------------------
人工智能（AI）是计算机科学的一个重要领域...
------------------------------------------------------------

🔄 步骤 3: 对比常规 humanize 接口
✅ 常规接口也成功
   输出字符数: 348
   处理时间: 4800ms

📊 对比:
   humanize-file: 351 字符, 5000ms
   humanize:      348 字符, 4800ms
```

## 🎨 前端用户体验

### Console 日志

用户上传文件并点击 Humanize 时,会看到:

```javascript
// 上传文件
File processed: {
  textLength: 365,
  filename: "document.pdf",
  filepath: "/uploads/123_document.pdf"
}

// 点击 Humanize
Form submitted: {
  mode: "document",
  textLength: 365,
  filePath: "/uploads/123_document.pdf"
}

// 调用接口
Calling humanize-file API with file path: /uploads/123_document.pdf

// 成功提示
Toast: "文档 'document.pdf' 已成功处理"
```

## 🔒 安全考虑

### 文件路径验证

```python
# 验证文件是否存在
file_path = Path(request.file_path)
if not file_path.exists():
    raise ValueError(f"File not found: {request.file_path}")
```

### 路径遍历防护

文件路径应该是上传接口返回的完整路径,不允许用户自定义路径,防止路径遍历攻击。

### 文件大小限制

继承上传接口的 40MB 限制。

## 📈 优势

1. **更好的语义化**
   - `humanize`: 通用文本处理
   - `humanize-file`: 专门的文件处理

2. **更丰富的上下文**
   - 包含文件名信息
   - 明确标注是文档内容
   - OpenAI 可以更好地理解上下文

3. **扩展性**
   - 未来可以添加文件元数据
   - 可以实现文件格式保留
   - 可以支持多文件处理

4. **清晰的职责分离**
   - Text 模式 → humanize
   - Document 模式 → humanize-file

## 🚀 使用方法

### 前端使用

```typescript
import { humanizeFile } from "@/lib/api";

// 在 Document 模式下
const response = await humanizeFile({
  file_path: filePath,  // 从上传响应获取
  text: extractedText,   // 从上传响应获取
  params: {
    length: "Normal",
    similarity: "Moderate",
    style: "Friendly"
  }
});

console.log(response.content);  // 人性化后的文本
```

### 后端使用

```bash
# 测试上传
curl -X POST http://localhost:8000/api/v1/upload \
  -F "file=@test.txt"

# 获取 file_path 后测试人性化
curl -X POST http://localhost:8000/api/v1/humanize-file \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/uploads/123_test.txt",
    "text": "文件内容...",
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Friendly"
    }
  }'
```

## 📝 API 文档

启动后端后访问:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

在文档中可以看到新增的 `humanize-file` 端点。

## 🔄 向后兼容

- ✅ 旧的 `humanize` 接口保持不变
- ✅ Text 模式继续使用 `humanize`
- ✅ Document 模式自动使用 `humanize-file`
- ✅ 用户无需关心底层实现

---

**创建日期**: 2025-10-23  
**接口状态**: ✅ 已实现并测试  
**版本**: 1.2.0

