# AI Text Humanizer - Backend

一个基于 FastAPI 的 AI 文本人性化重写应用后端。

## 功能特性

- ✅ 文本人性化处理 API
- ✅ 文档解析(PDF/DOCX/PPTX/TXT)
- ✅ 多种参数支持(长度、相似度、风格)
- ✅ 自动 API 文档(OpenAPI/Swagger)
- ✅ CORS 支持
- ✅ 类型安全(Pydantic)

## 技术栈

- **框架**: FastAPI 0.104+
- **语言**: Python 3.11+
- **验证**: Pydantic 2.0+
- **文档解析**: PyPDF2, python-docx, python-pptx
- **测试**: pytest

## 开始使用

### 前置要求

- Python 3.11+
- pip

### 安装依赖

\`\`\`bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

### 开发

\`\`\`bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

访问:
- API: [http://localhost:18201](http://localhost:18201)
- 文档: [http://localhost:18201/docs](http://localhost:18201/docs)
- ReDoc: [http://localhost:18201/redoc](http://localhost:18201/redoc)

### 运行测试

\`\`\`bash
pytest
\`\`\`

### 测试覆盖率

\`\`\`bash
pytest --cov=app --cov-report=html
\`\`\`

## 项目结构

\`\`\`
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI 应用入口
│   ├── config.py        # 配置文件
│   ├── api/             # API 路由
│   │   └── humanize.py
│   ├── services/        # 业务逻辑
│   │   ├── text_processor.py
│   │   └── document_parser.py
│   ├── models/          # 数据模型
│   │   └── schemas.py
│   └── utils/           # 工具函数
│       ├── validators.py
│       └── helpers.py
├── tests/               # 测试文件
│   ├── test_api.py
│   └── test_services.py
├── requirements.txt     # Python 依赖
└── README.md
\`\`\`

## API 端点

### POST /api/v1/humanize

人性化处理文本。

**请求体:**

\`\`\`json
{
  "source": {
    "mode": "text",
    "text": "Your AI-generated text here..."
  },
  "params": {
    "length": "Normal",
    "similarity": "Moderate",
    "style": "Neutral"
  }
}
\`\`\`

**响应:**

\`\`\`json
{
  "content": "Humanized text...",
  "chars": 1234,
  "processingTime": 850
}
\`\`\`

### GET /health

健康检查端点。

**响应:**

\`\`\`json
{
  "status": "healthy",
  "version": "1.0.0"
}
\`\`\`

## 环境变量

创建 \`.env\` 文件:

\`\`\`bash
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
\`\`\`

## 部署

### Docker

\`\`\`bash
docker build -t ai-humanizer-backend .
docker run -p 8000:8000 ai-humanizer-backend
\`\`\`

### 生产环境

\`\`\`bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
\`\`\`

## 贡献

欢迎提交 Pull Request!

## 许可

MIT License

