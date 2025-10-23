# 文件人性化两种模式实现

## 📋 概述

`/api/v1/humanize-file` 接口现在支持两种模式,根据 `text` 参数是否为空自动选择:

### 模式 1: 文本模式 (Text Mode)
- **条件**: `request.text` 不为空
- **行为**: 只传递提取的文本给 OpenAI
- **优点**: 更快,更高效,成本更低
- **适用**: 简单文本文件,已成功提取文本的文档

### 模式 2: 文件 Base64 模式 (File Base64 Mode)
- **条件**: `request.text` 为空或只包含空白字符
- **行为**: 将文件转为 Base64 传递给 OpenAI
- **优点**: 保留完整文件信息,适合复杂格式
- **适用**: 复杂格式文档,图片,表格等

## 🔄 自动模式选择逻辑

```python
has_text = bool(request.text and request.text.strip())

if has_text:
    # 文本模式: 传递 text
    result = await openai_service.humanize(
        text=request.text,
        ...,
        file_data=None
    )
else:
    # Base64 模式: 传递 file_data
    result = await openai_service.humanize(
        text="",
        ...,
        file_data={
            'filename': filename,
            'base64_content': base64_content
        }
    )
```

## 📡 API 调用示例

### 示例 1: 文本模式

**请求**:
```json
{
  "file_path": "/path/to/file.txt",
  "text": "这是提取的文本内容...",
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Friendly"
  }
}
```

**处理**:
- ✅ 检测到 `text` 不为空
- ✅ 使用文本模式
- ✅ 调用 OpenAI 标准 chat completion
- ✅ 返回人性化后的文本

**日志**:
```
INFO: Using text mode: 123 characters
INFO: Calling OpenAI API: https://api.openai.com/v1/chat/completions
```

### 示例 2: Base64 模式

**请求**:
```json
{
  "file_path": "/path/to/document.pdf",
  "text": "",
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Professional"
  }
}
```

**处理**:
- ✅ 检测到 `text` 为空
- ✅ 使用 Base64 模式
- ✅ 读取文件并转为 Base64
- ✅ 调用 OpenAI 文件接口 (带 Base64)
- ✅ 返回人性化后的文本

**日志**:
```
INFO: Using file base64 mode: 45678 characters
INFO: Calling OpenAI API: https://api.openai.com/v1/chat/completions
```

## 🔧 前端集成

### 方式 1: 始终提供文本 (推荐)

```typescript
// 上传文件后
const uploadResult = await uploadFile(formData);

// 调用 humanize-file,传递提取的文本
const response = await humanizeFile({
  file_path: uploadResult.file_path,
  text: uploadResult.text,  // 提取的文本
  params: { ... }
});
```

### 方式 2: 不提供文本 (使用 Base64)

```typescript
// 上传文件后
const uploadResult = await uploadFile(formData);

// 调用 humanize-file,不传递文本
const response = await humanizeFile({
  file_path: uploadResult.file_path,
  text: "",  // 空字符串,触发 Base64 模式
  params: { ... }
});
```

### 方式 3: 动态选择

```typescript
// 根据文件类型选择模式
const shouldUseText = ['txt', 'docx'].includes(fileExtension);

const response = await humanizeFile({
  file_path: uploadResult.file_path,
  text: shouldUseText ? uploadResult.text : "",  // 动态选择
  params: { ... }
});
```

## 📊 性能对比

| 模式 | 请求大小 | 处理速度 | API 成本 | 适用场景 |
|------|---------|---------|---------|---------|
| 文本模式 | 小 (~1KB) | 快 (~2s) | 低 | 纯文本文件 |
| Base64 模式 | 大 (~100KB+) | 较慢 (~5s) | 中 | 复杂文档,图片 |

## 🎯 使用建议

### 推荐使用文本模式的情况

✅ `.txt` 文本文件  
✅ 简单的 `.docx` 文档  
✅ 已成功提取文本的文件  
✅ 不包含重要格式信息  
✅ 追求速度和效率  

### 推荐使用 Base64 模式的情况

✅ 包含图片的文档  
✅ 复杂表格和布局  
✅ `.pdf` 文件  
✅ 文本提取失败或不完整  
✅ 需要保留完整文件信息  

## 🧪 测试

### 运行测试脚本

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
python test_two_modes.py
```

### 预期输出

```
🧪 测试两种模式

======================================================================
测试 1: 文本模式 (text 不为空)
======================================================================

📤 上传文件...
✅ 上传成功: /path/to/uploaded/file.txt
   提取的文本: 人工智能正在改变世界...

🤖 调用 humanize-file (文本模式)...
✅ 成功!
   处理时间: 2500ms
   输出: AI is transforming the world...

======================================================================
测试 2: 文件 Base64 模式 (text 为空)
======================================================================

📤 上传文件...
✅ 上传成功: /path/to/uploaded/file.txt

🤖 调用 humanize-file (文件 Base64 模式)...
✅ 成功!
   处理时间: 4500ms
   输出: Machine learning is an important branch...

✅ 测试完成!
```

## 🔍 调试日志

### 文本模式日志

```
INFO: Processing file: test.txt, text length: 45, base64 length: 1234
INFO: Using text mode: 45 characters
INFO: Calling OpenAI API: https://api.openai.com/v1/chat/completions
INFO: OpenAI API response status: 200
INFO: File humanization completed: test.txt, output length: 52
```

### Base64 模式日志

```
INFO: Processing file: document.pdf, text length: 0, base64 length: 45678
INFO: Using file base64 mode: 45678 characters
INFO: Calling OpenAI API: https://api.openai.com/v1/chat/completions
INFO: OpenAI API response status: 200
INFO: File humanization completed: document.pdf, output length: 234
```

## 🛠️ OpenAI Service 调用

### 文本模式调用

```python
# OpenAI 接收标准消息格式
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "You are a professional text rewriting assistant..."
    },
    {
      "role": "user",
      "content": "Please rewrite this text: 原始文本内容..."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 4000
}
```

### Base64 模式调用

```python
# OpenAI 接收文件格式
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "file",
          "file": {
            "filename": "document.pdf",
            "file_data": "data:application/pdf;base64,JVBERi0x..."
          }
        }
      ]
    },
    {
      "role": "assistant",
      "content": [{"type": "text", "text": "I understand..."}]
    },
    {
      "role": "user",
      "content": "Please rewrite this content..."
    }
  ],
  "temperature": 0.7,
  "max_completion_tokens": 4000
}
```

## 📝 代码位置

- **API 端点**: `web/backend/app/api/humanize_file.py` (第 70-107 行)
- **OpenAI Service**: `web/backend/app/services/openai_service.py` (第 111-160 行)
- **测试脚本**: `web/backend/test_two_modes.py`

## ✅ 验证清单

- [x] 实现两种模式自动选择
- [x] 文本模式正常工作
- [x] Base64 模式正常工作
- [x] 日志清晰显示使用的模式
- [x] 错误处理完善
- [x] 创建测试脚本
- [x] 编写文档

---

**更新日期**: 2025-10-23  
**状态**: ✅ 已实现  
**测试**: 使用 `test_two_modes.py` 进行测试

