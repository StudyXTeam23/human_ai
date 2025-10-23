# 400 错误排查

## 问题

调用 `humanize-file` 接口返回 400 错误,错误信息: `{"detail":"Request failed: "}`

## 可能原因

1. **OpenAI API 错误**
   - API 请求被拒绝
   - 文本内容违反 OpenAI 政策
   - 请求格式问题

2. **空错误捕获**
   - httpx.RequestError 被捕获但错误信息为空

## 解决方案

### 方案 1: 查看后端日志

后端日志应该显示详细错误。请查看运行 `./start-backend.sh` 的终端输出。

查找包含以下内容的行:
- `ERROR`
- `OpenAI API request error`
- `File humanization failed`

### 方案 2: 使用 curl 直接测试

```bash
curl -X POST http://localhost:8000/api/v1/humanize-file \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/Users/yuyuan/studyx_human/web/backend/uploads/test.txt",
    "text": "这是一个测试文本。",
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Neutral"
    }
  }'
```

### 方案 3: 测试简短文本

创建一个简短测试:

```python
# test_short.py
import asyncio
import httpx

async def test():
    payload = {
        "file_path": "/tmp/test.txt",
        "text": "这是一个简短的测试文本,用来验证接口是否正常工作。",
        "params": {
            "length": "Normal",
            "similarity": "Moderate",  
            "style": "Neutral"
        }
    }
    
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "http://localhost:8000/api/v1/humanize-file",
            json=payload
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")

asyncio.run(test())
```

### 方案 4: 检查 OpenAI API 配额

可能是 API 配额用尽或速率限制。

```python
# test_quota.py
import openai
from app.config import settings

openai.api_key = settings.openai_api_key
# 检查账户状态
```

## 临时解决方案

使用常规的 `humanize` 接口而不是 `humanize-file`:

```typescript
// 前端代码
if (data.mode === "document") {
  // 暂时使用 humanize 接口
  response = await humanizeText({
    source: {
      mode: "document",
      text: data.text
    },
    params: { ... }
  });
}
```

## 需要的信息

请提供:
1. 后端终端的完整日志输出
2. 是否有任何 ERROR 或 WARNING 信息
3. 尝试使用短文本是否成功

---

**创建日期**: 2025-10-23
**状态**: 正在排查

