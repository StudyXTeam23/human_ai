# 🔧 重启后端服务

## 问题

OpenAI API 连接失败,需要使用系统代理。

## 解决步骤

### 1. 停止当前后端服务

在运行 `./start-backend.sh` 的终端窗口按 `Ctrl+C`

### 2. 重新启动后端

```bash
cd /Users/yuyuan/studyx_human
./start-backend.sh
```

新的启动脚本会自动设置代理环境变量:
- `HTTP_PROXY=http://127.0.0.1:7890`
- `HTTPS_PROXY=http://127.0.0.1:7890`

### 3. 验证服务启动

看到以下输出说明启动成功:
```
🚀 启动后端服务...
📍 切换到后端目录...
🔧 激活虚拟环境...
✅ 使用 Python: /Users/yuyuan/studyx_human/web/backend/venv/bin/python
🌐 使用代理: http://127.0.0.1:7890
✅ 启动 FastAPI 服务器...
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 4. 测试 API

打开新终端窗口:

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
python test_humanize_file.py
```

应该看到 `✅ 处理成功!`

## 前端测试

1. 确保后端已重启并正常运行
2. 打开浏览器访问 `http://localhost:3000`
3. 切换到"文件上传"标签
4. 上传一个文档文件
5. 点击 "Humanize" 按钮
6. 应该看到人性化后的文本

## 故障排除

### 代理未运行

如果看到连接错误,检查代理软件(Clash/V2Ray)是否正在运行:

```bash
netstat -an | grep 7890
```

应该看到端口 7890 在监听。

### 代理端口不对

如果您的代理使用其他端口,修改 `start-backend.sh`:

```bash
export HTTP_PROXY=http://127.0.0.1:YOUR_PORT
export HTTPS_PROXY=http://127.0.0.1:YOUR_PORT
```

---

**注意**: 请确保先停止旧的后端进程再启动新的!

