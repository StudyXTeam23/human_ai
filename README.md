# AI Text Humanizer

一个基于 AI 的文本人性化工具,使用 OpenAI API 将机械化的文本转换为更自然、更人性化的内容。

## 🎯 项目状态

✅ **后端**: 完全实现并测试通过  
✅ **OpenAI 集成**: 成功集成并运行  
✅ **文件上传**: 完全实现并测试通过  
✅ **前端**: 核心功能实现完成

## 🚀 快速开始

### 前置要求
- Python 3.10+
- Node.js 18+
- OpenAI API Key

### 启动步骤

1. **启动后端**
```bash
./start-backend.sh
```
后端将运行在: http://localhost:18201

2. **启动前端**
```bash
./start-frontend.sh
```
前端将运行在: http://localhost:3000

3. **访问应用**
在浏览器中打开: http://localhost:3000

## 📚 文档

### 核心文档
- 📘 **[OPENAI_SETUP_COMPLETE.md](OPENAI_SETUP_COMPLETE.md)** - OpenAI 集成完成文档 (推荐首先阅读)
- 📗 **[FILE_UPLOAD_COMPLETE.md](FILE_UPLOAD_COMPLETE.md)** - ✨ 文件上传功能完成文档 (最新功能)
- 📕 **[FILE_UPLOAD_GUIDE.md](FILE_UPLOAD_GUIDE.md)** - 文件上传详细使用指南
- 📙 **[OPENAI_INTEGRATION.md](OPENAI_INTEGRATION.md)** - OpenAI 集成详细技术文档
- 📊 **[START_HERE.md](START_HERE.md)** - 完整的项目启动指南

### 其他文档
- 📄 **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - 从 Gemini 迁移到 OpenAI 的完整说明
- 📄 **[UPDATE_NOTES.md](UPDATE_NOTES.md)** - 更新说明
- 📄 **[QUICK_START.md](QUICK_START.md)** - 快速开始指南
- 📄 **[CODE_REVIEW_GUIDE.md](CODE_REVIEW_GUIDE.md)** - 代码审查指南

## 🏗️ 技术架构

### 后端
- **框架**: FastAPI
- **语言**: Python 3.10+
- **AI 服务**: OpenAI (gpt-4o-mini)
- **HTTP 客户端**: httpx
- **验证**: Pydantic

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **UI 组件**: shadcn/ui
- **表单**: React Hook Form + Zod

## ✨ 功能特性

### 已实现 ✅
- **文本输入**
  - 300-5000 字符支持
  - 实时字符计数
  - 输入验证
- **文档上传** ✨ 新功能
  - 点击上传
  - 拖拽上传
  - 支持 PDF, DOCX, PPTX, TXT
  - 最大 40MB
  - 自动文本提取
  - Base64 转换
- **参数配置**
  - **Length**: Normal, Concise, Expanded
  - **Similarity**: Low, Moderate, High, Neutral
  - **Style**: Neutral, Academic, Business, Creative, Technical, Friendly, Informal, Reference, Custom
- **AI 处理**
  - OpenAI API 集成
  - 异步处理
  - 完整的错误处理
  - 响应时间追踪
- **用户体验**
  - 结果复制
  - 结果下载 (.txt)
  - Toast 通知
  - 响应式设计

### 计划中 📋
- 历史记录显示
- 输出调优工具
- 移动端优化
- 批量文件处理
- OCR 支持

## 🧪 测试

### 测试 OpenAI API 连接
```bash
cd web/backend
source venv/bin/activate
python test_openai.py
```

### 测试完整端点
```bash
cd web/backend
source venv/bin/activate
python test_endpoint.py
```

### 使用 curl 测试
```bash
curl -X POST http://localhost:18201/api/v1/humanize \
  -H "Content-Type: application/json" \
  -d '{
    "source": {
      "text": "人工智能是计算机科学的一个分支,致力于创建能够执行通常需要人类智能才能完成的任务的系统。这些任务包括视觉感知、语音识别、决策制定和语言翻译等。近年来,随着深度学习和神经网络技术的发展,人工智能取得了突破性进展。从自动驾驶汽车到智能助手,从医疗诊断到金融分析,AI正在改变我们生活和工作的方方面面。然而,随着技术的快速发展,我们也需要关注AI带来的伦理和社会问题,确保技术的发展能够造福全人类。",
      "type": "text",
      "mode": "text"
    },
    "params": {
      "length": "Normal",
      "similarity": "Moderate",
      "style": "Friendly"
    }
  }'
```

## 📁 项目结构

```
/Users/yuyuan/studyx_human/
├── web/
│   ├── frontend/              # Next.js 前端应用
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React 组件
│   │   ├── lib/              # 工具函数和 API 客户端
│   │   ├── schemas/          # Zod 验证模式
│   │   ├── hooks/            # React Hooks
│   │   └── package.json
│   └── backend/              # FastAPI 后端应用
│       ├── app/
│       │   ├── api/          # API 路由
│       │   ├── services/     # 业务逻辑服务
│       │   ├── models/       # 数据模型
│       │   ├── config.py     # 配置文件
│       │   └── main.py       # 应用入口
│       ├── tests/            # 测试文件
│       └── requirements.txt
├── .spec-workflow/           # 规范工作流文档
├── start-backend.sh          # 后端启动脚本
├── start-frontend.sh         # 前端启动脚本
└── README.md                 # 本文件
```

## 🔧 配置

### OpenAI API 配置

编辑 `web/backend/app/config.py`:
```python
class Settings(BaseSettings):
    openai_api_key: str = "your-api-key"
    openai_model: str = "gpt-4o-mini"
    openai_api_url: str = "https://api.openai.com/v1/chat/completions"
```

或创建 `web/backend/.env` 文件:
```env
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
```

## 🐛 常见问题

### 后端无法启动
**问题**: `ModuleNotFoundError`  
**解决**: 确保虚拟环境已激活并安装依赖
```bash
cd web/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### API 调用失败
**问题**: `401 Unauthorized`  
**解决**: 检查 OpenAI API 密钥是否正确

### 文本太短错误
**问题**: `String should have at least 300 characters`  
**解决**: 确保输入文本至少 300 字符

### 连接被拒绝
**问题**: `Connection refused`  
**解决**: 确保后端服务正在运行
```bash
./start-backend.sh
```

## 📊 API 文档

启动后端后访问:
- Swagger UI: http://localhost:18201/docs
- ReDoc: http://localhost:18201/redoc

## 🔐 安全注意事项

⚠️ **重要**: 
- 不要将 API 密钥提交到版本控制
- 在生产环境中使用环境变量
- 定期轮换 API 密钥
- 监控 API 使用量和成本

## 📈 性能指标

- **平均响应时间**: 2-5 秒
- **最大文本长度**: 5000 字符
- **最小文本长度**: 300 字符
- **超时设置**: 60 秒
- **并发支持**: 是 (异步处理)

## 🤝 贡献

本项目使用规范化的开发流程:
1. 查看 `.spec-workflow/specs/ai-text-humanizer/` 了解需求和设计
2. 参考 `CODE_REVIEW_GUIDE.md` 进行代码审查
3. 运行测试确保质量

## 📝 更新日志

### v1.1.0 (2025-10-23) ✨ 最新
- ✅ 实现文件上传功能
- ✅ 支持 PDF, DOCX, PPTX, TXT 文件
- ✅ 点击上传和拖拽上传
- ✅ 文件保存到本地服务器
- ✅ 自动文本提取
- ✅ Base64 编码转换
- ✅ 完整的测试和文档

### v1.0.0 (2025-10-23)
- ✅ 从 Google Gemini 迁移到 OpenAI
- ✅ 使用 HTTP 请求方式调用 API
- ✅ 实现异步处理
- ✅ 添加处理时间追踪
- ✅ 完善错误处理和日志
- ✅ 创建完整测试套件

## 📞 技术支持

如有问题,请查看:
1. **[OPENAI_SETUP_COMPLETE.md](OPENAI_SETUP_COMPLETE.md)** - 设置完成文档
2. **[START_HERE.md](START_HERE.md)** - 完整启动指南
3. **API 文档**: http://localhost:18201/docs (后端运行后)

## 📜 许可证

本项目仅供学习和研究使用。

## 🙏 致谢

- OpenAI - 提供 GPT 模型 API
- FastAPI - 现代化的 Python Web 框架
- Next.js - React 应用框架
- shadcn/ui - 优秀的 UI 组件库

---

**最后更新**: 2025-10-23  
**版本**: 1.0.0  
**状态**: ✅ OpenAI 集成完成并测试通过

