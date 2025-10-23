# IDE 调试设置指南

## 问题原因

您遇到的错误是因为 IDE 使用的是 conda 环境 (`py_11`),但项目依赖安装在 `venv` 虚拟环境中。

## 🎯 推荐解决方案

### 使用 `run_debug.py` 启动

这是最简单的方法!

1. **在 IDE 中打开** `/Users/yuyuan/studyx_human/web/backend/run_debug.py`
2. **右键文件** → **Run 'run_debug'** 或 **Debug 'run_debug'**
3. **访问** http://localhost:8000/docs

## 📋 完整设置步骤

### 方案 1: 使用项目的 venv (推荐)

#### PyCharm / IntelliJ IDEA

1. **打开项目设置**
   - File → Settings (Windows/Linux)
   - PyCharm → Preferences (macOS)

2. **设置 Python 解释器**
   - Project: studyx_human → Python Interpreter
   - 点击齿轮图标 ⚙️ → Add...
   - 选择 "Existing Environment"
   - Interpreter: `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`
   - 点击 OK

3. **运行 run_debug.py**
   - 打开 `web/backend/run_debug.py`
   - 右键 → Run 'run_debug'

#### VS Code

1. **选择 Python 解释器**
   - `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入 "Python: Select Interpreter"
   - 选择 `./web/backend/venv/bin/python`

2. **运行 run_debug.py**
   - 打开 `web/backend/run_debug.py`
   - 按 `F5` 或点击 "Run and Debug"

### 方案 2: 在 conda 环境中安装依赖

如果您想继续使用 conda 环境 `py_11`:

```bash
# 激活 conda 环境
conda activate py_11

# 进入后端目录
cd /Users/yuyuan/studyx_human/web/backend

# 安装依赖
pip install -r requirements.txt

# 安装 pydantic-settings (如果缺失)
pip install pydantic-settings

# 运行
python run_debug.py
```

### 方案 3: 终端运行 (最简单)

如果 IDE 设置太复杂,直接在终端运行:

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
python run_debug.py
```

## 🔍 验证设置

### 检查 Python 解释器

在 IDE 中运行这段代码验证:

```python
import sys
print(f"Python: {sys.executable}")
print(f"版本: {sys.version}")

# 尝试导入依赖
try:
    import fastapi
    import pydantic_settings
    import httpx
    print("✅ 所有依赖已安装")
except ImportError as e:
    print(f"❌ 缺少依赖: {e}")
```

### 检查依赖安装

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
pip list | grep -E "fastapi|pydantic|httpx|uvicorn"
```

应该看到:
```
fastapi          0.104.0+
pydantic         2.12.3
pydantic-settings 2.11.0
httpx            0.25.0+
uvicorn          0.24.0+
```

## 🐛 调试技巧

### 设置断点

在以下位置设置断点:

```
web/backend/app/api/humanize_file.py:34
web/backend/app/services/openai_service.py:112
web/backend/app/services/file_processor.py:45
```

### 查看日志

服务器启动后会显示:
```
🚀 启动 FastAPI 调试服务器
📍 工作目录: /Users/yuyuan/studyx_human/web/backend
📍 Python 路径: /Users/yuyuan/studyx_human/web/backend/venv/bin/python
🌐 代理设置: http://127.0.0.1:7890
🔗 访问地址: http://localhost:8000
📚 API 文档: http://localhost:8000/docs
```

### 测试 API

访问 http://localhost:8000/docs 可以直接测试所有 API 端点。

## 📝 PyCharm 运行配置 (可选)

如果想创建专门的运行配置:

1. Run → Edit Configurations
2. 点击 + → Python
3. 配置:
   - **Name**: `FastAPI Debug Server`
   - **Script path**: `/Users/yuyuan/studyx_human/web/backend/run_debug.py`
   - **Python interpreter**: `venv` 环境
   - **Working directory**: `/Users/yuyuan/studyx_human/web/backend`
4. 点击 OK

现在可以从工具栏直接运行!

## 📝 VS Code launch.json (可选)

创建 `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "FastAPI Debug",
      "type": "debugpy",
      "request": "launch",
      "program": "${workspaceFolder}/web/backend/run_debug.py",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/web/backend",
      "python": "${workspaceFolder}/web/backend/venv/bin/python"
    }
  ]
}
```

## ❓ 常见问题

### Q: 为什么不直接运行 app/main.py?

A: `main.py` 使用相对导入 (`from app.config import ...`),需要正确的 Python 路径设置。`run_debug.py` 会自动处理这些设置。

### Q: conda 环境和 venv 有什么区别?

A: 
- `venv`: 项目自带的虚拟环境,所有依赖已安装
- `conda`: 您系统的 conda 环境,需要单独安装依赖

推荐使用项目的 `venv` 环境。

### Q: 如何切换 IDE 的 Python 解释器?

A: 
- **PyCharm**: Settings → Project → Python Interpreter
- **VS Code**: Cmd+Shift+P → "Python: Select Interpreter"

### Q: 端口 8000 被占用怎么办?

A: 修改 `run_debug.py` 中的端口号:
```python
uvicorn.run(
    app,
    host="0.0.0.0",
    port=8001,  # 改成其他端口
    ...
)
```

## ✅ 快速验证

运行这个命令验证所有设置:

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
python -c "
import sys
print('Python:', sys.executable)
from app.main import app
print('✅ 可以导入 app.main')
import uvicorn
print('✅ 可以导入 uvicorn')
print('✅ 所有设置正确!')
"
```

---

**推荐**: 直接运行 `run_debug.py`,最简单! 🚀

