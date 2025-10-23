# 文件上传 Base64 传递实现

## 概述

已更新文件上传功能,当调用 `/api/v1/humanize-file` 接口时,文件内容会以 Base64 格式直接传递给 OpenAI API,遵循 OpenAI 的文件传递规范。

## 实现方式

### OpenAI API 调用格式

参考您提供的示例,使用以下格式传递文件:

```json
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
            "file_data": "data:application/pdf;base64,BASE64_CONTENT_HERE"
          }
        }
      ]
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "I understand. This is the extracted content from document.pdf:..."
        }
      ]
    },
    {
      "role": "user",
      "content": "Please rewrite this text..."
    }
  ],
  "temperature": 0.7,
  "max_completion_tokens": 4000,
  "response_format": {"type": "text"}
}
```

### 代码实现

#### 1. OpenAI Service (`openai_service.py`)

`humanize()` 方法新增 `file_data` 参数:

```python
async def humanize(
    self,
    text: str,
    length: str,
    similarity: str,
    style: str,
    custom_style: str | None = None,
    file_data: dict | None = None,  # 新增
) -> dict:
    if file_data:
        # 文件模式:使用 Base64 传递
        filename = file_data['filename']
        base64_content = file_data['base64_content']
        
        # 根据文件扩展名确定 MIME 类型
        mime_type = get_mime_type(filename)
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "file",
                            "file": {
                                "filename": filename,
                                "file_data": f"data:{mime_type};base64,{base64_content}"
                            }
                        }
                    ]
                },
                {
                    "role": "assistant",
                    "content": [
                        {
                            "type": "text",
                            "text": f"I understand. This is the extracted content from {filename}..."
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": prompt  # 人性化改写指令
                }
            ],
            "temperature": 0.7,
            "max_completion_tokens": 4000,
            "response_format": {"type": "text"}
        }
    else:
        # 文本模式:标准调用
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a professional text rewriting assistant..."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 4000
        }
```

#### 2. Humanize File Endpoint (`humanize_file.py`)

调用时传递文件数据:

```python
result = await openai_service.humanize(
    text=request.text,  # 提取的文本
    length=request.params.length.value,
    similarity=request.params.similarity.value,
    style=request.params.style.value,
    custom_style=request.params.customStyle,
    file_data={
        'filename': file_path.name,
        'base64_content': file_base64  # 已从文件读取的 Base64
    }
)
```

### MIME 类型映射

支持的文件类型及其 MIME 类型:

| 扩展名 | MIME 类型 |
|--------|-----------|
| `.pdf` | `application/pdf` |
| `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| `.pptx` | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| `.txt` | `text/plain` |
| 其他 | `application/octet-stream` |

## API 请求流程

### 1. 上传文件

```bash
POST /api/v1/upload
Content-Type: multipart/form-data

file: [binary file data]
```

**响应**:
```json
{
  "filename": "document.pdf",
  "text": "提取的文本内容...",
  "base64": "BASE64_CONTENT...",
  "file_path": "/path/to/uploaded/file",
  "size": "12345",
  "chars": "1000"
}
```

### 2. 人性化处理

```bash
POST /api/v1/humanize-file
Content-Type: application/json

{
  "file_path": "/path/to/uploaded/file",
  "text": "提取的文本内容...",
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Neutral"
  }
}
```

**后端处理**:
1. 读取 `file_path` 指定的文件
2. 将文件内容转换为 Base64
3. 调用 OpenAI API,传递:
   - 文件名
   - Base64 编码的文件内容
   - 提取的文本
   - 改写参数

**响应**:
```json
{
  "content": "人性化后的文本...",
  "chars": 1050,
  "processingTime": 3500
}
```

## 前端调用

前端 (`page.tsx`) 已更新为条件调用:

```typescript
const onSubmit = async (data: HumanizeFormData) => {
  let response;
  
  if (data.mode === "document" && filePath) {
    // 文件模式:调用 humanize-file
    response = await humanizeFile({
      file_path: filePath,
      text: data.text,
      params: { /* ... */ }
    });
  } else {
    // 文本模式:调用 humanize
    response = await humanizeText({
      source: { mode: data.mode, text: data.text },
      params: { /* ... */ }
    });
  }
};
```

## 测试

### 重启后端(必需)

```bash
# 停止当前后端 (Ctrl+C)
cd /Users/yuyuan/studyx_human
./start-backend.sh
```

确保看到:
```
🌐 使用代理: http://127.0.0.1:7890
```

### 测试脚本

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
python test_humanize_file.py
```

### 测试前端

1. 访问 http://localhost:3000
2. 切换到"文档上传"标签
3. 上传 PDF/DOCX/PPTX/TXT 文件
4. 点击"Humanize"
5. 查看结果

## 优势

1. **完整信息**: OpenAI 同时接收文件原始数据和提取文本
2. **更好理解**: AI 可以处理文件格式特定信息(如表格、图片等)
3. **标准格式**: 遵循 OpenAI 官方文档的文件传递规范
4. **灵活性**: 保留文本模式的简单调用方式

## 注意事项

1. **文件大小**: Base64 编码后大小约为原文件的 1.33 倍
2. **API 限制**: OpenAI 对请求体大小有限制(通常 20MB)
3. **处理时间**: 大文件可能需要更长处理时间
4. **代理设置**: 确保后端启动时设置了正确的代理环境变量

## 相关文件

- `web/backend/app/services/openai_service.py` - OpenAI API 调用
- `web/backend/app/api/humanize_file.py` - 文件人性化端点
- `web/backend/app/services/file_processor.py` - 文件处理
- `web/frontend/app/page.tsx` - 前端逻辑
- `web/frontend/lib/api.ts` - API 调用函数

---

**更新日期**: 2025-10-23  
**状态**: ✅ 已实现  
**下一步**: 重启后端并测试

