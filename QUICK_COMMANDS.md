# 快速命令参考

## 🚀 启动项目

### 方法 1: 使用启动脚本 (推荐)

```bash
# 启动后端
cd /Users/yuyuan/studyx_human
./start-backend.sh

# 启动前端 (新终端窗口)
cd /Users/yuyuan/studyx_human
./start-frontend.sh
```

### 方法 2: 手动启动

#### 后端

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate  # 注意:使用 source,不是直接运行
python run_debug.py
```

#### 前端

```bash
cd /Users/yuyuan/studyx_human/web/frontend
npm run dev
```

## 🔧 IDE 调试

### 在 PyCharm / IntelliJ IDEA 中

1. **设置 Python 解释器**
   - Settings → Project → Python Interpreter
   - 选择: `/Users/yuyuan/studyx_human/web/backend/venv/bin/python`

2. **运行调试**
   - 打开 `web/backend/run_debug.py`
   - 右键 → Run 'run_debug' 或 Debug 'run_debug'

3. **访问**
   - http://localhost:8000/docs

## 📝 常用命令

### 虚拟环境

```bash
# ❌ 错误 - 不要这样做
venv/bin/activate

# ✅ 正确 - 激活虚拟环境
source venv/bin/activate

# 或者使用完整路径
source /Users/yuyuan/studyx_human/web/backend/venv/bin/activate

# 退出虚拟环境
deactivate
```

### 安装依赖

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
pip install -r requirements.txt
```

### 测试 API

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate

# 测试文件上传
python test_upload.py

# 测试文件人性化
python test_humanize_file.py

# 测试 Base64 传递
python test_base64_file.py
```

### 检查服务状态

```bash
# 检查后端是否运行
curl http://localhost:8000/health

# 检查前端是否运行
curl http://localhost:3000

# 检查代理是否运行
netstat -an | grep 7890
```

## 🐛 常见问题

### Q: Permission denied: venv/bin/activate

**错误原因**: 试图直接运行 activate 脚本

**解决方法**: 使用 `source` 命令
```bash
source venv/bin/activate
```

### Q: ModuleNotFoundError: No module named 'app'

**解决方法**: 
1. 使用 `run_debug.py` 而不是 `app/main.py`
2. 确保使用项目的 venv Python 解释器

### Q: 端口被占用

```bash
# 查找占用 8000 端口的进程
lsof -i :8000

# 终止进程
kill -9 <PID>
```

### Q: 代理连接失败

```bash
# 检查代理是否运行
netstat -an | grep 7890

# 如果没有输出,说明代理未运行
# 启动您的代理软件 (Clash/V2Ray 等)
```

## 📊 项目结构

```
studyx_human/
├── web/
│   ├── backend/          # 后端 (FastAPI)
│   │   ├── venv/        # Python 虚拟环境
│   │   ├── app/         # 应用代码
│   │   ├── run_debug.py # IDE 调试脚本
│   │   └── requirements.txt
│   └── frontend/         # 前端 (Next.js)
│       ├── app/
│       ├── components/
│       └── package.json
├── start-backend.sh      # 后端启动脚本
└── start-frontend.sh     # 前端启动脚本
```

## 🌐 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 | http://localhost:3000 | 用户界面 |
| 后端 API | http://localhost:8000 | API 服务 |
| API 文档 | http://localhost:8000/docs | Swagger UI |
| 健康检查 | http://localhost:8000/health | 服务状态 |

## 🔑 环境变量

后端需要的环境变量 (已在 `start-backend.sh` 中设置):

```bash
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
```

## 💡 快速测试

### 测试后端

```bash
cd /Users/yuyuan/studyx_human/web/backend
source venv/bin/activate
python -c "from app.main import app; print('✅ 后端可以正常导入')"
```

### 测试完整流程

1. 启动后端: `./start-backend.sh`
2. 启动前端: `./start-frontend.sh`
3. 打开浏览器: http://localhost:3000
4. 上传文件并测试

## 📚 相关文档

- `README.md` - 项目总览
- `START_HERE.md` - 详细入门指南
- `IDE_SETUP_GUIDE.md` - IDE 调试配置
- `FILE_UPLOAD_WITH_BASE64.md` - 文件上传实现
- `NETWORK_PROXY_SETUP.md` - 代理设置说明

---

**最常用的命令**:
```bash
# 后端
cd /Users/yuyuan/studyx_human
./start-backend.sh

# 前端
cd /Users/yuyuan/studyx_human
./start-frontend.sh

# IDE 调试
# 打开 web/backend/run_debug.py 并运行
```

