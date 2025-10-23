# 更新说明 - OpenAI 集成

## 日期: 2025-10-23

## 主要变更

### 从 Gemini 切换到 OpenAI

本次更新将 AI 服务提供商从 Google Gemini 切换到 OpenAI,使用直接的 HTTP 请求方式而非 SDK。

### 变更文件列表

#### 1. 配置文件
- **`web/backend/app/config.py`**
  - 移除: `gemini_api_key`, `gemini_model`
  - 新增: `openai_api_key`, `openai_model`, `openai_api_url`

#### 2. 服务层
- **新建: `web/backend/app/services/openai_service.py`**
  - 实现 `OpenAIService` 类
  - 使用 `httpx.AsyncClient` 进行 HTTP 请求
  - 支持所有原有参数配置
  
- **保留: `web/backend/app/services/gemini_service.py`**
  - 暂时保留,可在需要时切换回来

#### 3. API 路由
- **`web/backend/app/api/humanize.py`**
  - 从 `GeminiService` 切换到 `OpenAIService`
  - 添加 `await` 关键字(OpenAI 服务是异步的)

#### 4. 依赖管理
- **`web/backend/requirements.txt`**
  - 移除: `google-generativeai>=0.3.0`
  - 保留: `httpx>=0.25.0` (用于 HTTP 请求)

#### 5. 测试文件
- **新建: `web/backend/test_openai.py`**
  - 验证 OpenAI API 连接
  - 测试基本的 Chat Completions 请求

#### 6. 文档
- **新建: `OPENAI_INTEGRATION.md`**
  - 详细的 OpenAI 集成文档
  - API 使用说明和最佳实践

## 技术差异

### Gemini vs OpenAI

| 特性 | Gemini | OpenAI |
|------|--------|--------|
| SDK 使用 | 使用 `google-generativeai` | 直接 HTTP 请求 |
| 异步支持 | 同步调用 | 异步调用 (httpx) |
| 模型 | `gemini-2.0-flash-exp` | `gpt-4o-mini` |
| API 格式 | Gemini 专有格式 | 标准 Chat Completions |
| 超时设置 | 默认 | 60 秒 |

### API 请求格式

**OpenAI (新)**:
```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "temperature": 0.7,
  "max_tokens": 4000
}
```

**Gemini (旧)**:
```python
model.generate_content(prompt)
```

## 迁移步骤

### 1. 更新依赖

```bash
cd web/backend
source venv/bin/activate
pip install -r requirements.txt
```

注意: 如果之前安装了 `google-generativeai`,它会保留在环境中,但不再需要。

### 2. 验证配置

确保 `app/config.py` 中的 OpenAI API 密钥正确:

```python
openai_api_key: str = "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"
```

### 3. 测试连接

```bash
python test_openai.py
```

预期输出:
```
Calling OpenAI API: https://api.openai.com/v1/chat/completions
Status Code: 200
Success! Response:
Hello! How can I assist you today?
```

### 4. 重启服务

```bash
# 停止现有后端服务 (Ctrl+C)
# 重新启动
cd /Users/yuyuan/studyx_human
./start-backend.sh
```

### 5. 测试完整流程

```bash
curl -X POST http://localhost:8000/api/v1/humanize \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "text": "这是一段测试文本。我们需要验证新的 OpenAI 集成是否工作正常。这段文本包含了足够的字符来满足最小长度要求。让我们看看 OpenAI 如何改写这段文本,使其听起来更加自然和人性化。我们期望得到一个流畅、自然的改写结果,同时保持原文的核心意思不变。",
      "type": "text"
    },
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Friendly"
    }
  }'
```

## 功能一致性

### 保持不变的功能

✅ 所有用户可见的功能完全一致:
- 输入验证 (300-5000 字符)
- 参数选项 (Length, Similarity, Style)
- 输出格式 (content, chars)
- 错误处理
- API 端点路径

### 改进的方面

✅ 性能和可靠性:
- 更明确的超时控制 (60秒)
- 更好的错误日志记录
- 异步处理提高并发性能

## 回滚方案

如果需要回滚到 Gemini:

1. 恢复 `app/api/humanize.py`:
   ```python
   from app.services.gemini_service import GeminiService
   gemini_service = GeminiService()
   ```

2. 恢复 `app/config.py` 中的 Gemini 配置

3. 重新安装依赖:
   ```bash
   echo "google-generativeai>=0.3.0" >> requirements.txt
   pip install google-generativeai
   ```

4. 重启服务

## 测试清单

- [x] OpenAI API 连接测试
- [x] 配置文件更新
- [x] 服务层实现
- [x] API 路由更新
- [x] 依赖更新
- [ ] 完整端到端测试
- [ ] 前端集成测试
- [ ] 错误场景测试
- [ ] 性能测试

## 已知问题

无

## 注意事项

1. **API 密钥安全**: 确保不将 API 密钥提交到版本控制
2. **成本控制**: OpenAI 按 token 计费,监控使用量
3. **速率限制**: 注意 OpenAI 的 API 速率限制
4. **超时处理**: 长文本可能需要更长的处理时间

## 下一步计划

1. 实施完整的端到端测试
2. 添加请求缓存机制
3. 实现重试策略
4. 添加使用量监控
5. 考虑支持流式响应

## 联系和支持

如有问题,请查看:
- `OPENAI_INTEGRATION.md` - OpenAI 集成详细文档
- `START_HERE.md` - 快速开始指南
- `CODE_REVIEW_GUIDE.md` - 代码审查指南

