# OpenAI API 集成文档

## 概述

本项目使用 OpenAI API 来实现文本人性化功能,通过 HTTP 请求直接调用 OpenAI 的 Chat Completions API。

## 配置

### API 设置

在 `web/backend/app/config.py` 中配置:

```python
class Settings(BaseSettings):
    # OpenAI API Configuration
    openai_api_key: str = "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"
    openai_model: str = "gpt-4o-mini"
    openai_api_url: str = "https://api.openai.com/v1/chat/completions"
```

### 环境变量

你也可以通过 `.env` 文件配置:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
```

## 技术实现

### 服务架构

`OpenAIService` 类位于 `web/backend/app/services/openai_service.py`,负责:

1. **构建提示词** (`_build_prompt`):
   - 根据用户参数(Length、Similarity、Style)生成个性化提示词
   - 支持自定义风格描述
   - 针对不同参数组合优化提示

2. **调用 API** (`humanize`):
   - 使用 `httpx.AsyncClient` 异步发送 HTTP 请求
   - 超时设置: 60 秒
   - 温度参数: 0.7 (平衡创意和一致性)
   - 最大令牌数: 4000

### API 调用流程

```
用户请求 → FastAPI 路由 → OpenAIService → HTTP 请求 → OpenAI API
                ↓                              ↓
            验证参数                       处理响应
                ↓                              ↓
            返回结果 ← 格式化数据 ← 提取文本内容
```

### 请求格式

```python
payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {
            "role": "system",
            "content": "You are a professional text rewriting assistant..."
        },
        {
            "role": "user",
            "content": "用户构建的提示词..."
        }
    ],
    "temperature": 0.7,
    "max_tokens": 4000
}
```

### 响应处理

```python
# 提取改写后的文本
rewritten_text = result["choices"][0]["message"]["content"].strip()

# 返回格式
return {
    "content": rewritten_text,
    "chars": len(rewritten_text)
}
```

## 参数说明

### Length (长度)

- **Normal**: 保持与原文相似的长度
- **Concise**: 精简文本,减少冗余词汇
- **Expanded**: 扩展文本,增加细节和解释

### Similarity (相似度)

- **Low**: 显著重新措辞和重构内容
- **Moderate**: 适度改写,平衡原创性和相似度
- **High**: 非常接近原文措辞,仅做细微调整
- **Neutral**: 保持平衡的相似度

### Style (风格)

- **Neutral**: 中立、平衡的语气
- **Academic**: 正式的学术语言
- **Business**: 专业的商务沟通风格
- **Creative**: 创意和吸引人的语言
- **Technical**: 技术性和精确的语言
- **Friendly**: 温暖友好的对话语气
- **Informal**: 休闲和轻松的语言
- **Reference**: 客观和信息性的参考风格
- **Custom**: 自定义风格(最多120字符描述)

## 错误处理

### 常见错误

1. **API 密钥无效**
   ```
   Status 401: Unauthorized
   ```
   解决方案: 检查 `config.py` 中的 API 密钥

2. **请求超时**
   ```
   httpx.TimeoutException
   ```
   解决方案: 增加超时时间或检查网络连接

3. **配额超限**
   ```
   Status 429: Rate limit exceeded
   ```
   解决方案: 等待或升级 API 配额

4. **请求过大**
   ```
   Status 400: Maximum context length exceeded
   ```
   解决方案: 减少输入文本长度

### 错误处理策略

```python
try:
    result = await openai_service.humanize(...)
except ValueError as e:
    # 客户端错误 (400)
    raise HTTPException(status_code=400, detail=str(e))
except Exception as e:
    # 服务器错误 (500)
    raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
```

## 测试

### 单元测试

运行测试脚本验证 API 连接:

```bash
cd web/backend
source venv/bin/activate
python test_openai.py
```

### API 端点测试

使用 curl 测试完整端点:

```bash
curl -X POST http://localhost:8000/api/v1/humanize \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "text": "这是一段需要人性化的文本。这段文本可能看起来有些机械化,需要让它变得更加自然和人性化,就像是一个真实的人类在说话一样。我们需要保持原意,但是使用更加自然流畅的表达方式。",
      "type": "text"
    },
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Friendly"
    }
  }'
```

## 性能考虑

### 响应时间

- 典型响应时间: 2-5 秒
- 最大超时: 60 秒
- 受因素影响: 文本长度、API 负载、网络延迟

### 成本优化

1. **模型选择**: 使用 `gpt-4o-mini` 而不是 `gpt-4` 可显著降低成本
2. **提示词优化**: 精简提示词可减少 token 使用
3. **缓存策略**: 考虑对相同输入进行缓存(未实现)

### 并发处理

FastAPI 的异步特性允许同时处理多个请求:
- 使用 `asyncio` 和 `httpx.AsyncClient`
- 不会阻塞其他请求
- 受 API 速率限制约束

## 安全考虑

1. **API 密钥保护**
   - 不要提交到版本控制
   - 使用环境变量或密钥管理服务
   - 定期轮换密钥

2. **输入验证**
   - 最小长度: 300 字符
   - 最大长度: 5000 字符
   - 使用 Pydantic 模型验证

3. **速率限制**
   - 考虑添加应用级速率限制
   - 监控 API 使用量
   - 实现降级策略

## 监控与日志

### 日志记录

```python
logger.info(f"Calling OpenAI API: {self.api_url}")
logger.info(f"OpenAI API response received")
logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
```

### 建议监控指标

- API 调用成功率
- 平均响应时间
- 错误率和类型
- Token 使用量
- 成本追踪

## 未来改进

1. **缓存机制**: 对相同输入缓存结果
2. **重试策略**: 实现指数退避重试
3. **流式响应**: 支持实时流式输出
4. **批量处理**: 支持批量文本处理
5. **A/B 测试**: 测试不同提示词策略
6. **质量评估**: 添加输出质量评分

## 参考资源

- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [Chat Completions API](https://platform.openai.com/docs/guides/chat-completions)
- [定价信息](https://openai.com/pricing)
- [速率限制](https://platform.openai.com/docs/guides/rate-limits)

