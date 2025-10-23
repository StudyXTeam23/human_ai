# 文件上传功能使用指南

## 功能概述

AI Text Humanizer 现在支持文档上传功能,可以直接上传 PDF、DOCX、PPTX、TXT 文件进行文本人性化处理。

## 支持的文件类型

- **PDF** (.pdf) - 便携式文档格式
- **Word** (.docx) - Microsoft Word 文档
- **PowerPoint** (.pptx) - Microsoft PowerPoint 演示文稿
- **Text** (.txt) - 纯文本文件

## 文件限制

- **最大文件大小**: 40MB
- **文本长度**: 300-5000 字符
  - 如果提取的文本少于 300 字符,会提示错误
  - 如果提取的文本超过 5000 字符,会自动截断到 5000 字符

## 使用方法

### 方法 1: 点击上传

1. 切换到 "Document" 标签页
2. 点击上传区域或 "选择文件" 按钮
3. 选择要上传的文件
4. 等待文件上传和处理
5. 查看提取的文本预览
6. 调整参数 (Length、Similarity、Style)
7. 点击 "Humanize" 按钮进行处理

### 方法 2: 拖拽上传

1. 切换到 "Document" 标签页
2. 直接将文件拖拽到上传区域
3. 文件会自动上传和处理
4. 查看提取的文本预览
5. 调整参数后点击 "Humanize" 按钮

## 工作流程

### 前端流程

```
选择/拖拽文件
    ↓
验证文件类型和大小
    ↓
上传文件到后端 (FormData)
    ↓
接收处理结果 (提取的文本 + base64)
    ↓
显示文本预览
    ↓
用户调整参数并点击 Humanize
    ↓
调用 OpenAI API 进行文本人性化
    ↓
显示处理结果
```

### 后端流程

```
接收上传文件
    ↓
验证文件类型和大小
    ↓
保存文件到 uploads/ 目录
    ↓
根据文件类型提取文本
  ├─ PDF: 使用 PyPDF2
  ├─ DOCX: 使用 python-docx
  ├─ PPTX: 使用 python-pptx
  └─ TXT: 直接读取
    ↓
验证文本长度 (300-5000)
    ↓
转换文件为 base64
    ↓
返回提取的文本和 base64
```

## API 端点

### 上传文件

**端点**: `POST /api/v1/upload`

**请求格式**: `multipart/form-data`

**参数**:
- `file`: 上传的文件

**响应格式**: JSON
```json
{
  "filename": "example.pdf",
  "text": "提取的文本内容...",
  "base64": "文件的 base64 编码...",
  "size": "1024567",
  "chars": "1234"
}
```

**错误响应**:
- 400: 文件验证失败 (类型不支持、文件过大、文本太短等)
- 500: 服务器处理错误

### 人性化处理

**端点**: `POST /api/v1/humanize`

**请求格式**: JSON
```json
{
  "source": {
    "mode": "document",
    "text": "提取的文本..."
  },
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Friendly"
  }
}
```

## 技术实现

### 前端 (React + TypeScript)

**组件**: `FileUpload.tsx`

**关键功能**:
- 拖拽上传支持
- 文件类型验证
- 文件大小验证
- 上传进度显示
- 错误处理和提示

**状态管理**:
```typescript
const [isDragging, setIsDragging] = useState(false);
const [isUploading, setIsUploading] = useState(false);
const [uploadedFile, setUploadedFile] = useState<{
  name: string;
  size: number;
} | null>(null);
```

**事件处理**:
- `handleDragEnter`: 拖拽进入
- `handleDragLeave`: 拖拽离开
- `handleDragOver`: 拖拽悬停
- `handleDrop`: 文件放下
- `handleFileSelect`: 文件选择
- `uploadFile`: 上传文件

### 后端 (Python + FastAPI)

**服务**: `FileProcessor`

**关键方法**:
```python
validate_file(filename, file_size)  # 验证文件
save_file(filename, content)         # 保存文件
extract_text_from_pdf(file_path)    # 提取 PDF 文本
extract_text_from_docx(file_path)   # 提取 Word 文本
extract_text_from_pptx(file_path)   # 提取 PPT 文本
extract_text_from_txt(file_path)    # 读取 TXT 文本
process_file(file_path)              # 处理文件并返回结果
```

**存储位置**: `web/backend/uploads/`

**文件命名**: `{timestamp}_{original_filename}`

## 文件存储

### 存储目录
```
web/backend/uploads/
```

### 文件清理

系统包含自动清理功能 (可选):
```python
FileProcessor.cleanup_old_files(max_age_hours=24)
```

默认保留 24 小时内的文件,之后自动删除。

### .gitignore 配置
```gitignore
# 忽略上传的文件,但保留目录
uploads/*
!uploads/.gitkeep
```

## 测试步骤

### 1. 测试 PDF 上传

创建测试 PDF:
```bash
# 使用任意 PDF 文件
curl -X POST http://localhost:8000/api/v1/upload \
  -F "file=@test.pdf"
```

### 2. 测试 DOCX 上传

创建测试 Word 文档:
```bash
curl -X POST http://localhost:8000/api/v1/upload \
  -F "file=@test.docx"
```

### 3. 测试 TXT 上传

创建测试文本文件:
```bash
# 创建至少 300 字符的文本文件
echo "This is a test text file with more than 300 characters..." > test.txt
# (重复添加文本直到超过 300 字符)

curl -X POST http://localhost:8000/api/v1/upload \
  -F "file=@test.txt"
```

### 4. 前端测试

1. 启动前后端服务
2. 访问 http://localhost:3000
3. 切换到 "Document" 标签页
4. 尝试上传不同类型的文件
5. 验证拖拽上传功能
6. 检查文本提取是否正确
7. 测试 Humanize 功能

## 错误处理

### 常见错误

1. **文件类型不支持**
   ```
   不支持的文件类型: .xlsx
   请上传 PDF、DOCX、PPTX 或 TXT 文件
   ```

2. **文件过大**
   ```
   文件大小 (45.67MB) 超过最大允许大小 (40MB)
   ```

3. **文本太短**
   ```
   提取的文本太短 (125 字符)。最少需要 300 字符
   ```

4. **文件处理失败**
   ```
   无法提取 PDF 文本: 文件可能已损坏
   ```

### 错误处理策略

**前端**:
- 使用 toast 提示显示错误信息
- 清除上传状态
- 重置文件输入

**后端**:
- 捕获并记录详细错误日志
- 返回友好的错误消息
- 清理失败的上传文件

## 安全考虑

### 文件验证

1. **类型检查**: 验证文件扩展名
2. **大小限制**: 40MB 上限
3. **内容验证**: 尝试解析文件确保有效性

### 存储安全

1. **文件名清理**: 使用时间戳前缀避免冲突
2. **目录隔离**: 文件存储在专用 uploads 目录
3. **定期清理**: 删除旧文件防止磁盘占用

### 隐私保护

1. **临时存储**: 文件仅用于处理,可定期清理
2. **访问控制**: 上传的文件不对外暴露
3. **数据处理**: 文本提取后可选择删除原文件

## 性能优化

### 前端优化

1. **异步上传**: 使用 fetch API 异步处理
2. **进度显示**: 显示上传和处理状态
3. **文件验证**: 前端验证减少无效请求

### 后端优化

1. **流式读取**: 处理大文件时使用流式读取
2. **缓存机制**: 可考虑缓存提取的文本
3. **异步处理**: 使用 FastAPI 的异步特性

## 未来改进

### 短期计划

- [ ] 添加上传进度条
- [ ] 支持批量文件上传
- [ ] 文件预览功能
- [ ] 更多文件格式支持 (ODT, RTF 等)

### 长期计划

- [ ] OCR 支持 (扫描文档)
- [ ] 直接从 URL 导入文档
- [ ] 文档格式保留 (保持原有格式)
- [ ] 云存储集成 (S3, GCS 等)

## 故障排查

### 问题 1: 上传失败

**症状**: 点击上传后没有反应或报错

**检查**:
1. 后端服务是否运行 (`http://localhost:8000/docs`)
2. CORS 配置是否正确
3. 浏览器控制台是否有错误
4. 文件是否符合要求

**解决**:
```bash
# 检查后端服务
curl http://localhost:8000/health

# 检查上传端点
curl -X POST http://localhost:8000/api/v1/upload \
  -F "file=@test.txt"
```

### 问题 2: 文本提取失败

**症状**: 文件上传成功但无法提取文本

**检查**:
1. 文件是否损坏
2. 文件是否为受保护的 PDF
3. 后端日志中的错误信息

**解决**:
- 尝试使用不同的文件
- 检查文件权限
- 查看后端日志

### 问题 3: 文本乱码

**症状**: 提取的文本显示乱码

**检查**:
1. 文件编码是否正确
2. TXT 文件编码 (UTF-8 vs GBK)

**解决**:
- 后端已实现多编码尝试 (UTF-8, GBK)
- 如仍有问题,转换文件编码为 UTF-8

## 相关文档

- [README.md](README.md) - 项目概述
- [OPENAI_INTEGRATION.md](OPENAI_INTEGRATION.md) - OpenAI 集成文档
- [START_HERE.md](START_HERE.md) - 快速开始指南

## API 文档

启动后端后访问:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

**更新日期**: 2025-10-23  
**功能状态**: ✅ 已实现并测试  
**版本**: 1.1.0

