# IDE 调试指南

## PyCharm / IntelliJ IDEA 调试配置

### 方法 1: 直接运行 main.py

1. **打开项目**
   - 在 IDE 中打开 `/Users/yuyuan/studyx_human/web/backend`

2. **配置 Python 解释器**
   - File → Settings (或 Preferences on macOS)
   - Project → Python Interpreter
   - 选择虚拟环境: `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`

3. **运行/调试**
   - 右键点击 `app/main.py`
   - 选择 "Run 'main'" 或 "Debug 'main'"
   - 或者直接点击编辑器右上角的绿色运行按钮

4. **访问应用**
   - http://localhost:18201
   - http://localhost:18201/docs (API 文档)

### 方法 2: 创建运行配置

1. **添加新配置**
   - Run → Edit Configurations
   - 点击 "+" → Python

2. **配置参数**
   - Name: `FastAPI Backend`
   - Script path: `/Users/yuyuan/studyx_human/web/backend/app/main.py`
   - Python interpreter: 选择 venv
   - Working directory: `/Users/yuyuan/studyx_human/web/backend`
   - Environment variables:
     ```
     HTTP_PROXY=http://127.0.0.1:7890
     HTTPS_PROXY=http://127.0.0.1:7890
     ```

3. **运行**
   - 点击工具栏的运行或调试按钮

### 方法 3: 使用 uvicorn 命令

创建运行配置:
- Name: `Uvicorn Server`
- Module name: `uvicorn`
- Parameters: `app.main:app --reload --host 0.0.0.0 --port 8000`
- Working directory: `/Users/yuyuan/studyx_human/web/backend`
- Environment variables: (同上)

## VS Code 调试配置

### 1. 创建 launch.json

在 `/Users/yuyuan/studyx_human/.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "FastAPI Backend",
      "type": "debugpy",
      "request": "launch",
      "program": "${workspaceFolder}/web/backend/app/main.py",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/web/backend",
      "env": {
        "HTTP_PROXY": "http://127.0.0.1:7890",
        "HTTPS_PROXY": "http://127.0.0.1:7890"
      },
      "justMyCode": false
    },
    {
      "name": "Uvicorn Server",
      "type": "debugpy",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app.main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "cwd": "${workspaceFolder}/web/backend",
      "env": {
        "HTTP_PROXY": "http://127.0.0.1:7890",
        "HTTPS_PROXY": "http://127.0.0.1:7890"
      },
      "justMyCode": false
    }
  ]
}
```

### 2. 选择 Python 解释器

1. `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
2. 输入 "Python: Select Interpreter"
3. 选择 `./web/backend/venv/bin/python`

### 3. 开始调试

1. 切换到调试视图 (Cmd+Shift+D)
2. 选择 "FastAPI Backend"
3. 按 F5 开始调试

## 调试功能

### 设置断点

1. **在代码行号左侧点击**,添加断点
2. **条件断点**: 右键断点 → Edit Breakpoint → 添加条件

### 常用断点位置

- `app/api/humanize.py:32` - humanize_text 函数入口
- `app/api/humanize_file.py:34` - humanize_file 函数入口
- `app/services/openai_service.py:108` - OpenAI 调用前
- `app/services/file_processor.py:45` - 文件处理逻辑

### 调试快捷键

**PyCharm/IntelliJ**:
- F8 - Step Over (单步跳过)
- F7 - Step Into (单步进入)
- Shift+F8 - Step Out (跳出)
- F9 - Resume (继续)
- Cmd+F8 - Toggle Breakpoint

**VS Code**:
- F10 - Step Over
- F11 - Step Into
- Shift+F11 - Step Out
- F5 - Continue
- Cmd+K Cmd+I - Toggle Breakpoint

## 热重载

`main.py` 中的 `uvicorn.run()` 已启用 `reload=True`,修改代码后会自动重启服务器。

**注意**: 
- 只有 `.py` 文件修改会触发重载
- 修改配置文件可能需要手动重启

## 查看日志

### 控制台输出

启动后会看到:
```
🚀 启动开发服务器...
📍 应用: AI Text Humanizer v1.0.0
🌐 代理: http://127.0.0.1:7890
🔗 访问: http://localhost:18201
📚 文档: http://localhost:18201/docs

INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### API 请求日志

每个请求都会记录:
```
INFO:     127.0.0.1:52345 - "POST /api/v1/humanize-file HTTP/1.1" 200 OK
```

### 自定义日志

在代码中添加日志:
```python
import logging
logger = logging.getLogger(__name__)

logger.info("This is an info message")
logger.error("This is an error message")
logger.debug("This is a debug message")
```

## 测试 API

### 方法 1: Swagger UI

访问 http://localhost:18201/docs

- 可视化 API 文档
- 可以直接测试所有端点
- 自动生成请求示例

### 方法 2: 使用 curl

```bash
# Health check
curl http://localhost:8000/health

# Humanize text
curl -X POST http://localhost:8000/api/v1/humanize \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "mode": "text",
      "text": "这是一个测试文本..."
    },
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Neutral"
    }
  }'
```

### 方法 3: 使用测试脚本

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 测试文件上传
python test_upload.py

# 测试文件人性化
python test_humanize_file.py

# 测试 Base64 传递
python test_base64_file.py
```

## 常见问题

### Q: 代理连接失败

**现象**: `httpcore.ConnectError` 或连接超时

**解决**:
1. 检查代理是否运行: `netstat -an | grep 7890`
2. 确认环境变量已设置: 
   - `main.py` 中已自动设置
   - 或在 IDE 运行配置中添加

### Q: 模块导入错误

**现象**: `ModuleNotFoundError: No module named 'app'`

**解决**:
1. 确认工作目录为 `web/backend`
2. 确认使用正确的虚拟环境

### Q: 端口被占用

**现象**: `Address already in use`

**解决**:
```bash
# 查找占用端口的进程
lsof -i :8000

# 终止进程
kill -9 <PID>
```

### Q: 修改代码不生效

**解决**:
1. 确认 `reload=True` 已启用
2. 检查控制台是否显示 "Reloading..."
3. 手动重启服务器

## 性能分析

### 使用 cProfile

```python
import cProfile
import pstats

profiler = cProfile.Profile()
profiler.enable()

# Your code here

profiler.disable()
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(20)
```

### 使用 line_profiler

```bash
pip install line_profiler

# 在函数上添加装饰器
@profile
def my_function():
    pass

# 运行
kernprof -l -v app/main.py
```

## 数据库调试 (如果使用)

```python
# 查看 SQL 查询
import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

---

**快速开始**:
1. 在 IDE 中打开 `web/backend/app/main.py`
2. 右键 → Run 'main' 或 Debug 'main'
3. 访问 http://localhost:8000/docs
4. 开始调试! 🚀

