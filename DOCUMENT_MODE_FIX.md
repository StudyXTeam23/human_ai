# 文档模式修复说明

## 🎯 核心修改

### 问题
文件上传后 Humanize 按钮无反应,因为验证逻辑对文档模式也强制要求 300-5000 字符限制。

### 解决方案
**文档模式不应该有字符长度限制,直接把提取的文本发送给 OpenAI 处理。**

## ✅ 修改内容

### 1. 前端按钮禁用逻辑

**文件**: `web/frontend/app/page.tsx`

**修改前**:
```typescript
disabled={isLoading || (text && (isTooShort || isTooLong)) || (!text)}
```

**修改后**:
```typescript
disabled={
  isLoading || 
  !text || 
  (inputMode === "text" && (isTooShort || isTooLong))
}
```

**说明**: 只在 `text` 模式下检查长度限制,`document` 模式不检查。

### 2. 前端 Zod Schema

**文件**: `web/frontend/schemas/humanize.ts`

**修改前**:
```typescript
text: z
  .string()
  .max(5000, "最多支持 5000 个字符")
  .refine(
    (val) => {
      if (val.length === 0) return true;
      const byteLength = new TextEncoder().encode(val).length;
      return byteLength >= 300;
    },
    { message: "最少需要 300 个字符" }
  ),
```

**修改后**:
```typescript
text: z.string().min(1, "文本不能为空"),

// 在 refine 中根据 mode 验证
.refine(
  (data) => {
    // 只对 text 模式验证长度
    if (data.mode === "text") {
      return data.text.length >= 300 && data.text.length <= 5000;
    }
    // document 模式只需要有文本
    return data.text.length > 0;
  },
  {
    message: "文本模式需要 300-5000 个字符",
    path: ["text"],
  }
)
```

### 3. 后端 Pydantic Schema

**文件**: `web/backend/app/models/schemas.py`

**修改前**:
```python
text: str = Field(
    ...,
    min_length=300,
    max_length=5000,
    description="Text content (300-5000 characters)",
)
```

**修改后**:
```python
text: str = Field(
    ...,
    description="Text content",
)

@field_validator("text")
@classmethod
def validate_text_length(cls, v: str, info) -> str:
    """Validate text length based on mode."""
    data = info.data
    # 只对 text 模式验证长度
    if "mode" in data and data["mode"] == InputMode.TEXT:
        if len(v) < 300:
            raise ValueError("Text must be at least 300 characters for text mode")
        if len(v) > 5000:
            raise ValueError("Text must not exceed 5000 characters for text mode")
    return v
```

### 4. 文件处理器

**文件**: `web/backend/app/services/file_processor.py`

**修改前**:
```python
# Truncate text if too long (max 5000 characters)
if len(text) > 5000:
    logger.warning(f"Text truncated from {len(text)} to 5000 characters")
    text = text[:5000]

# Check minimum length
if len(text) < 300:
    raise ValueError(
        f"Extracted text is too short ({len(text)} characters). Minimum 300 characters required."
    )
```

**修改后**:
```python
# 文档模式不强制长度限制
# 文本将直接发送给 OpenAI
logger.info(f"Extracted {len(text)} characters from document")
```

### 5. UI 提示文字

**文件**: `web/frontend/app/page.tsx`

**修改后**:
```typescript
<span className="text-slate-500">
  已提取 {count} 个字符 (文件模式无长度限制)
</span>
```

## 📊 对比

### Text 模式 (手动输入)
- ✅ 最少 300 字符
- ✅ 最多 5000 字符
- ✅ 前端验证
- ✅ 后端验证

### Document 模式 (文件上传)
- ✅ 无最少字符限制
- ✅ 无最多字符限制
- ✅ 直接发送给 OpenAI
- ✅ 由 OpenAI 的 token 限制控制

## 🎯 工作流程

### Text 模式
```
用户输入文本
  ↓
验证: 300 ≤ length ≤ 5000
  ↓
通过 → 按钮可用
未通过 → 按钮禁用
```

### Document 模式
```
用户上传文件
  ↓
提取文本 (任意长度)
  ↓
检查: length > 0
  ↓
有文本 → 按钮可用
无文本 → 按钮禁用
```

## 🧪 测试验证

### Text 模式测试
```typescript
// < 300 字符 - 按钮禁用 ✅
text = "短文本";
// 300-5000 字符 - 按钮可用 ✅
text = "合适长度的文本...";
// > 5000 字符 - 按钮禁用 ✅
text = "超长文本...";
```

### Document 模式测试
```typescript
// 任意长度 - 按钮可用 ✅
uploadFile("10字文档.txt");   // 可用
uploadFile("1000字文档.txt");  // 可用
uploadFile("10000字文档.txt"); // 可用
```

## 📝 使用说明

### 用户视角

**Text 标签页**:
- 需要手动输入 300-5000 字符
- 字符计数显示: "XXX/5000"
- 少于 300: 显示 "最少需要 300 个字符"
- 超过 5000: 显示 "最多支持 5000 个字符"

**Document 标签页**:
- 上传任意长度的文件
- 字符计数显示: "已提取 XXX 个字符 (文件模式无长度限制)"
- 只要提取到文本,按钮就可用
- 文本长度由 OpenAI API 限制

## 🚀 立即测试

1. **刷新浏览器** (Cmd+Shift+R 或 Ctrl+Shift+R)
2. **切换到 Document 标签页**
3. **上传任意文件**
4. **查看显示**: "已提取 XXX 个字符 (文件模式无长度限制)"
5. **点击 Humanize** - 应该正常工作 ✅

## ✅ 预期结果

### Console 日志
```javascript
File processed: { textLength: 150, filename: "short.txt" }
// 即使只有 150 字符,在 document 模式下也应该可用

Form submitted: {
  mode: "document",
  textLength: 150,
  count: 150,
  isTooShort: true,  // 这个值不重要,因为不检查
  isTooLong: false
}
```

### 按钮状态
- Text 模式 + 150 字符: ❌ 禁用
- Document 模式 + 150 字符: ✅ 可用

---

**修复日期**: 2025-10-23  
**状态**: ✅ 已修复  
**影响**: 前端 + 后端

