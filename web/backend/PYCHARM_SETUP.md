# PyCharm/IntelliJ IDEA 设置指南

## 🚨 当前问题

您的 IDE 使用了错误的 Python 解释器:
- ❌ 当前使用: `/Users/yuyuan/studyx_human/.venv/bin/python`
- ✅ 应该使用: `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`

## 📝 完整设置步骤

### 1. 打开 Python 解释器设置

**macOS**:
- `PyCharm` → `Preferences` → `Project: studyx_human` → `Python Interpreter`

**Windows/Linux**:
- `File` → `Settings` → `Project: studyx_human` → `Python Interpreter`

### 2. 添加正确的解释器

1. 点击齿轮图标 ⚙️
2. 选择 `Add...`
3. 选择 `Existing Environment`
4. 点击 `...` 浏览按钮
5. 导航到: `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`
6. 或者直接粘贴路径: `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`
7. 点击 `OK`

### 3. 设为默认解释器

在解释器列表中,选择刚添加的 `venv` 解释器作为项目默认解释器。

### 4. 验证设置

在 PyCharm 的 Python Console 中运行:

```python
import sys
print(sys.executable)
# 应该输出: /Users/yuyuan/studyx_human/web/backend/venv/bin/python

from app.main import app
print("✅ 成功导入!")
```

## 🎯 推荐的运行方式

### 方法 1: 运行 run_debug.py (推荐!)

1. 在 IDE 中打开: `web/backend/run_debug.py`
2. 确保右上角显示的解释器是 `venv`
3. 右键文件 → `Run 'run_debug'` 或 `Debug 'run_debug'`

### 方法 2: 创建运行配置

1. `Run` → `Edit Configurations...`
2. 点击 `+` → `Python`
3. 配置如下:
   - **Name**: `FastAPI Backend`
   - **Script path**: `/Users/yuyuan/studyx_human/web/backend/run_debug.py`
   - **Python interpreter**: 选择 `venv` (如上设置的)
   - **Working directory**: `/Users/yuyuan/studyx_human/web/backend`
   - **Environment variables**: (可选)
     ```
     HTTP_PROXY=http://127.0.0.1:7890;HTTPS_PROXY=http://127.0.0.1:7890
     ```

4. 点击 `OK`
5. 现在可以从工具栏直接运行 "FastAPI Backend"

## 🐛 设置断点调试

### 推荐断点位置

1. **文件上传处理**
   - `web/backend/app/api/humanize_file.py` 第 34 行
   
2. **OpenAI API 调用**
   - `web/backend/app/services/openai_service.py` 第 112 行
   
3. **文件处理**
   - `web/backend/app/services/file_processor.py` 第 45 行

### 调试步骤

1. 在代码行号左侧点击,添加红点断点
2. 点击工具栏的 🐞 Debug 按钮
3. 在浏览器访问 API 或使用 Swagger UI (http://localhost:8000/docs)
4. 程序会在断点处暂停
5. 使用调试工具:
   - `F8` - Step Over (单步跳过)
   - `F7` - Step Into (单步进入)
   - `F9` - Resume (继续)

## ❌ 常见错误

### 错误 1: ModuleNotFoundError: No module named 'app'

**原因**: 
- 使用了错误的 Python 解释器
- 或直接运行 `app/main.py` 而不是 `run_debug.py`

**解决**: 
1. 设置正确的解释器 (见上文)
2. 运行 `run_debug.py` 而不是 `app/main.py`

### 错误 2: 依赖包未找到

**原因**: 虚拟环境中没有安装依赖

**解决**:
```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
pip install -r requirements.txt
```

### 错误 3: 端口被占用

**解决**:
```bash
# 找到占用端口的进程
lsof -i :8000

# 终止进程
kill -9 <PID>
```

## 🎨 IDE 优化设置

### 1. 启用自动导入

`Preferences` → `Editor` → `General` → `Auto Import`
- ✅ `Show import popup`
- ✅ `Optimize imports on the fly`

### 2. 代码格式化

`Preferences` → `Editor` → `Code Style` → `Python`
- 设置 Line length: 88 (Black 标准)

### 3. 启用类型检查

`Preferences` → `Editor` → `Inspections` → `Python`
- ✅ `Type checker`

## 📊 项目结构视图

正确的项目结构应该是:

```
studyx_human/
├── .venv/                    ❌ 错误的虚拟环境 (不要用这个!)
├── web/
│   └── backend/
│       ├── venv/             ✅ 正确的虚拟环境 (使用这个!)
│       │   └── bin/
│       │       └── python    ← 应该使用这个 Python
│       ├── app/
│       │   └── main.py
│       └── run_debug.py      ← 运行这个文件!
```

## ✅ 验证检查清单

运行这些命令验证设置:

```bash
# 1. 检查虚拟环境
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
which python
# 应该输出: /Users/yuyuan/studyx_human/web/backend/venv/bin/python

# 2. 检查依赖
pip list | grep -E "fastapi|pydantic|httpx"
# 应该看到所有包都已安装

# 3. 测试导入
python -c "from app.main import app; print('✅ 导入成功')"

# 4. 测试运行
python run_debug.py
# 应该看到服务器启动
```

## 🎯 快速开始

**最简单的方式**:

1. 在 IDE 中设置 Python 解释器:
   `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`

2. 打开并运行:
   `web/backend/run_debug.py`

3. 访问:
   http://localhost:8000/docs

就这么简单! 🎉

## 📞 仍然有问题?

如果设置后还是有问题:

1. **重启 IDE**: 有时需要重启才能识别新的解释器
2. **清除缓存**: `File` → `Invalidate Caches / Restart...`
3. **检查日志**: `Help` → `Show Log in Finder` 查看错误日志

---

**记住**: 
- ✅ 使用 `web/backend/venv/bin/python`
- ✅ 运行 `run_debug.py`
- ❌ 不要使用根目录的 `.venv`
- ❌ 不要直接运行 `app/main.py`

