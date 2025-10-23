# 🔧 OpenAI Token 限制修复

## 🐛 问题描述

错误信息:
```
OpenAI API request failed with status 400:
"This model's maximum context length is 128000 tokens. 
However, your messages resulted in 265182 tokens. 
Please reduce the length of the messages."
```

**原因**: 用户上传的文件或输入的文本超过了 OpenAI API 的 token 限制。

## ✅ 解决方案

### 1. 安装 tiktoken 库

```bash
pip install tiktoken
```

`tiktoken` 是 OpenAI 官方的 token 计数库，用于精确计算文本的 token 数量。

### 2. 实现 Token 计数和截断

在 `openai_service.py` 中添加了以下功能:

#### Token 限制配置

```python
class OpenAIService:
    MAX_CONTEXT_TOKENS = 128000  # gpt-4o 和 gpt-4o-mini 最大上下文
    MAX_OUTPUT_TOKENS = 4000     # 预留给输出
    MAX_INPUT_TOKENS = MAX_CONTEXT_TOKENS - MAX_OUTPUT_TOKENS - 1000  # 预留给 prompt
    # 实际输入限制: 123000 tokens
```

#### 核心方法

**1. `_count_tokens(text: str) -> int`**
- 使用 tiktoken 精确计算文本的 token 数量
- 有 fallback 机制: 如果计数失败，使用字符数估算

**2. `_truncate_text(text: str, max_tokens: int) -> tuple[str, bool]`**
- 截断超长文本到指定 token 数量
- 返回 (截断后的文本, 是否被截断)
- 保证截断在 token 边界上，不会破坏文本结构

**3. `humanize()` 方法增强**
- 处理前先检查 token 数量
- 如果超过限制，自动截断
- 记录详细日志
- 在返回结果中添加截断提示

### 3. 工作流程

```
用户输入文本
    ↓
计算 token 数量
    ↓
超过 123000 tokens? ─No→ 正常处理
    ↓ Yes
截断到 123000 tokens
    ↓
发送到 OpenAI API
    ↓
返回结果 + 截断提示
```

## 📊 Token 限制详情

| 项目 | Token 数量 | 说明 |
|------|-----------|------|
| 最大上下文 | 128,000 | OpenAI API 总限制 |
| 输出预留 | 4,000 | AI 生成文本的空间 |
| Prompt 预留 | 1,000 | 系统 prompt 和指令 |
| **实际输入限制** | **123,000** | 用户文本的最大 token 数 |

## 🧮 Token 估算

不同语言的 token 比例:
- **英文**: 1 token ≈ 4 字符 (例: "hello world" ≈ 3 tokens)
- **中文**: 1 token ≈ 1-2 字符 (例: "你好世界" ≈ 4 tokens)
- **代码**: 1 token ≈ 4 字符

大约限制:
- 英文: ~492,000 字符 (123000 * 4)
- 中文: ~184,500 字符 (123000 * 1.5)

## 📝 代码示例

### 使用示例

```python
# 在 humanize 方法中自动处理
result = await openai_service.humanize(
    text=long_text,  # 即使超长也会自动截断
    length="Normal",
    similarity="Moderate",
    style="Friendly"
)

# 检查是否被截断
if result.get("wasTruncated"):
    original_tokens = result.get("originalTokens")
    print(f"文本从 {original_tokens} tokens 被截断到 123000 tokens")
```

### 日志输出

```
INFO: Input text tokens: 265182
WARNING: Text was truncated to 123000 tokens (original: 265182 tokens)
INFO: Total prompt tokens: 123500
```

## 🎯 功能特性

### 1. 自动截断
- ✅ 超长文本自动截断
- ✅ 保证不超过 token 限制
- ✅ 在 token 边界截断，不破坏文本

### 2. 用户提示
- ✅ 在结果末尾添加截断提示
- ✅ 显示原始和截断后的 token 数量
- ✅ 用户可以看到文本被截断了

### 3. 详细日志
- ✅ 记录输入 token 数量
- ✅ 记录是否截断及截断比例
- ✅ 便于调试和监控

### 4. 容错处理
- ✅ Fallback 机制: tiktoken 失败时使用字符估算
- ✅ 不会因为 token 计数失败而中断服务

## 🧪 测试

### 测试截断功能

```python
# 创建超长文本
long_text = "这是一段测试文本。" * 100000  # 约 600,000 字符

# 调用 API
response = await openai_service.humanize(
    text=long_text,
    length="Normal",
    similarity="Moderate",
    style="Friendly"
)

# 检查结果
print(f"处理成功: {len(response['content'])} 字符")
print(f"是否截断: {response.get('wasTruncated', False)}")
```

## 📦 依赖更新

已更新以下文件:
- ✅ `requirements.txt` - 添加 tiktoken>=0.5.2
- ✅ `requirements-prod.txt` - 添加 tiktoken>=0.5.2

## 🚀 部署

### 开发环境

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
pip install tiktoken
# 重启后端服务
```

### 生产环境

```bash
cd /var/www/studyx_human/web/backend
source venv/bin/activate
pip install -r requirements-prod.txt
# 重启服务
pm2 restart humanizer-api
```

## 💡 使用建议

### 对于用户

1. **文本模式**: 
   - 限制: 5000 字符 (远小于 token 限制，不会触发截断)

2. **文档模式**:
   - 大文件会自动截断
   - 建议上传 < 100 页的文档
   - 如果文档太大，会收到截断提示

### 对于开发者

1. **调整限制**:
   ```python
   # 如果需要更保守的限制
   MAX_INPUT_TOKENS = 50000  # 减少输入限制
   ```

2. **前端验证**:
   - 可以在前端添加文件大小限制
   - 超过 10MB 的文档建议拒绝上传

3. **分块处理** (未来优化):
   - 对于超长文档，可以分块处理
   - 每块独立调用 API
   - 最后合并结果

## ⚠️ 注意事项

1. **Token 不等于字符**
   - 中文字符通常需要更多 token
   - 特殊符号和表情符号可能占用多个 token

2. **截断可能影响内容**
   - 文本会在 token 边界截断
   - 可能会截断句子或段落
   - 建议用户上传合适大小的文档

3. **成本考虑**
   - 更多 token = 更高成本
   - 123000 tokens ≈ $0.15 (gpt-4o-mini 输入价格)

## 📚 参考资料

- [OpenAI Token 限制文档](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo)
- [tiktoken GitHub](https://github.com/openai/tiktoken)
- [Token 计算器](https://platform.openai.com/tokenizer)

---

**状态**: ✅ 已实现并测试
**版本**: 1.0.0
**更新日期**: 2024-01-23

