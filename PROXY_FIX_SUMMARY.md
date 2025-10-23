# 代理连接问题修复总结

## 问题描述

调用 `/api/v1/humanize-file` 接口时返回 400 错误:
```
httpcore.ConnectError
File "httpcore/_async/http_proxy.py", line 316, in handle_async_request
    stream = await stream.start_tls(**kwargs)
```

## 根本原因

- **httpx** 库默认会读取系统的代理设置 (HTTP_PROXY/HTTPS_PROXY 环境变量)
- 当存在代理配置时,httpx 会尝试通过代理连接 OpenAI API
- 代理连接在 TLS 握手阶段失败,导致 `ConnectError`

## 解决方案

在 `openai_service.py` 的 `humanize()` 方法中:

1. **请求前**: 保存并临时清除所有代理环境变量
   ```python
   old_http_proxy = os.environ.get('HTTP_PROXY')
   old_https_proxy = os.environ.get('HTTPS_PROXY')
   # ... 保存其他代理变量
   
   for key in ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy']:
       os.environ.pop(key, None)
   ```

2. **请求完成后**: 在 `finally` 块中恢复原有代理设置
   ```python
   finally:
       if old_http_proxy:
           os.environ['HTTP_PROXY'] = old_http_proxy
       # ... 恢复其他代理变量
   ```

## 修改的文件

- `web/backend/app/services/openai_service.py`
  - 添加 `import os`
  - 在 `humanize()` 方法开头禁用代理
  - 在 `finally` 块恢复代理设置
  - 添加 `httpx.ConnectError` 的专门错误处理

## 测试结果

### 测试前
```bash
❌ 失败: 400
错误: {"detail":"Request failed: "}
httpcore.ConnectError
```

### 测试后
```bash
✅ 成功!
输出字符数: 1320
处理时间: 20212ms
```

## 验证步骤

1. **测试长文本**:
   ```bash
   cd web/backend
   source venv/bin/activate
   python test_long_text.py
   ```

2. **测试 API Key**:
   ```bash
   python test_api_key.py
   ```

3. **测试完整流程**:
   ```bash
   python test_humanize_file.py
   ```

## 影响范围

- 此修复同时影响 `/api/v1/humanize` 和 `/api/v1/humanize-file` 接口
- 两个接口都使用 `OpenAIService.humanize()` 方法
- 不影响其他网络请求(如文件上传等)

## 其他说明

### 为什么不直接使用 `proxies=None`?

尝试过 `httpx.AsyncClient(proxies=None)`,但该版本的 httpx 不支持此参数:
```
AsyncClient.__init__() got an unexpected keyword argument 'proxies'
```

### 为什么不在全局禁用代理?

- 可能影响其他需要代理的服务
- 通过临时禁用,只影响 OpenAI API 调用
- 在 `finally` 块中恢复,确保不影响后续请求

## 后续优化建议

1. **配置化**: 在 `config.py` 中添加 `disable_proxy_for_openai` 配置项
2. **连接池复用**: 考虑创建一个专门的 httpx 客户端实例,避免每次都创建新连接
3. **重试机制**: 添加自动重试逻辑,处理临时网络问题

---

**修复日期**: 2025-10-23  
**状态**: ✅ 已解决  
**测试状态**: ✅ 通过

