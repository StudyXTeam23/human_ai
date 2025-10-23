# 网络代理设置说明

## 问题现象

后端调用 OpenAI API 时出现连接错误:
- `httpcore.ConnectError`
- `httpcore.ConnectTimeout`
- `Connection failed - please check network/proxy settings`

## 根本原因

您的 macOS 系统配置了本地代理服务器 (`127.0.0.1:7890`),OpenAI API 必须通过此代理才能访问。

### 系统代理配置

```bash
$ scutil --proxy
HTTPProxy: 127.0.0.1
HTTPPort: 7890
HTTPSProxy: 127.0.0.1  
HTTPSPort: 7890
SOCKSProxy: 127.0.0.1
SOCKSPort: 7890
```

## 解决方案

### 1. 更新后端启动脚本

修改 `start-backend.sh`,添加代理环境变量:

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

### 2. OpenAI Service 使用代理

`openai_service.py` 现在使用 `httpx.AsyncClient(timeout=120.0)` (默认 `trust_env=True`),会自动读取环境变量中的代理设置。

### 3. 重启后端服务

```bash
# 停止当前后端 (Ctrl+C)
# 重新启动
./start-backend.sh
```

## 验证

### 检查代理是否运行

```bash
netstat -an | grep 7890
```

应该看到:
```
tcp4       0      0  127.0.0.1.7890         *.*                    LISTEN
```

### 测试代理连接

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
curl -I https://api.openai.com
```

应该返回 HTTP 200 或 301。

### 测试后端 API

```bash
curl -X POST http://localhost:18201/api/v1/humanize-file \
  -H "Content-Type: application/json" \
  -d '{
    "file_path": "/path/to/file",
    "text": "测试文本",
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Neutral"
    }
  }'
```

## 常见问题

### Q: 代理未运行怎么办?

如果您的代理软件(如 Clash, V2Ray)未运行,请先启动它,或者修改 `start-backend.sh`,移除代理设置:

```bash
# 注释掉这两行
# export HTTP_PROXY=http://127.0.0.1:7890
# export HTTPS_PROXY=http://127.0.0.1:7890
```

### Q: 代理端口不是 7890?

检查您的代理软件配置,然后修改 `start-backend.sh` 中的端口号。

### Q: 如何临时禁用代理?

```bash
unset HTTP_PROXY
unset HTTPS_PROXY
```

### Q: 生产环境如何配置?

在生产环境中,将代理设置添加到systemd service file或supervisor配置中:

```ini
[program:backend]
environment=HTTP_PROXY="http://127.0.0.1:7890",HTTPS_PROXY="http://127.0.0.1:7890"
```

## 参考

- httpx 代理文档: https://www.python-httpx.org/advanced/#http-proxying
- macOS 代理设置: `System Settings` → `Network` → `Advanced` → `Proxies`

---

**更新日期**: 2025-10-23  
**状态**: ✅ 已修复

