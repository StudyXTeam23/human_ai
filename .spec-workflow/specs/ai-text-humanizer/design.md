# AI 文本人性化重写系统 - 技术设计文档

## 1. 系统架构

### 1.1 整体架构
本系统采用前后端分离的架构,前端使用 Next.js 14 (App Router) + React,后端使用 Python FastAPI。

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Side                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js 14 App (App Router)                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │ Components │  │   Hooks    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Utils    │  │   Schemas  │  │   Types    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Server Side                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              FastAPI Backend                         │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Routes   │  │  Services  │  │   Models   │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐                     │  │
│  │  │   Utils    │  │ Validators │                     │  │
│  │  └────────────┘  └────────────┘                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈选型

#### 1.2.1 前端技术栈
- **框架**: Next.js 14 (App Router)
  - 理由: 提供 SSR、优秀的性能、内置路由系统
- **语言**: TypeScript 5.x
  - 理由: 类型安全、更好的开发体验
- **样式**: TailwindCSS 3.x
  - 理由: 快速开发、原子化 CSS、易于维护
- **UI 组件**: shadcn/ui
  - 理由: 基于 Radix UI,无障碍性好,可定制
- **表单**: React Hook Form 7.x + Zod 3.x
  - 理由: 性能优秀、声明式验证、TypeScript 友好
- **图标**: lucide-react
  - 理由: 现代化、可定制、树摇优化
- **测试**: vitest + @testing-library/react
  - 理由: 快速、与 Vite 集成良好

#### 1.2.2 后端技术栈
- **框架**: FastAPI 0.104+
  - 理由: 高性能、自动 API 文档、类型提示
- **语言**: Python 3.11+
  - 理由: 丰富的生态、易于维护
- **文档解析**: 
  - PDF: PyPDF2 / pdfplumber
  - DOCX: python-docx
  - PPT: python-pptx
  - TXT: 内置
- **验证**: Pydantic 2.x
  - 理由: 与 FastAPI 无缝集成,数据验证强大
- **CORS**: fastapi-cors
  - 理由: 处理跨域请求

### 1.3 项目结构

```
/Users/yuyuan/studyx_human/web/
├── frontend/                      # Next.js 前端
│   ├── app/                       # App Router 目录
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # 主页
│   │   ├── api/                  # API 路由(可选,用于代理)
│   │   │   └── humanize/
│   │   │       └── route.ts      # 代理到后端 API
│   │   └── globals.css           # 全局样式
│   ├── components/               # React 组件
│   │   ├── ui/                   # shadcn/ui 组件
│   │   │   ├── button.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── card.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── UploadDropzone.tsx    # 文档上传组件
│   │   ├── ParamBar.tsx          # 参数控制栏
│   │   ├── OutputPanel.tsx       # 输出面板
│   │   ├── FineTuner.tsx         # 微调器
│   │   └── HistoryRail.tsx       # 历史记录
│   ├── lib/                      # 工具函数
│   │   ├── utils.ts              # 通用工具
│   │   ├── api.ts                # API 调用
│   │   └── storage.ts            # LocalStorage 管理
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useCharCount.ts       # 字符计数
│   │   ├── useHistory.ts         # 历史记录管理
│   │   └── useHumanize.ts        # 人性化处理
│   ├── schemas/                  # Zod 验证模式
│   │   └── humanize.ts           # 表单验证模式
│   ├── types/                    # TypeScript 类型
│   │   └── index.ts              # 类型定义
│   ├── public/                   # 静态资源
│   ├── tests/                    # 测试文件
│   │   ├── unit/                 # 单元测试
│   │   └── integration/          # 集成测试
│   ├── .eslintrc.json            # ESLint 配置
│   ├── .prettierrc               # Prettier 配置
│   ├── tailwind.config.ts        # Tailwind 配置
│   ├── tsconfig.json             # TypeScript 配置
│   ├── next.config.js            # Next.js 配置
│   ├── package.json              # 依赖管理
│   ├── vitest.config.ts          # Vitest 配置
│   └── README.md                 # 前端文档
│
└── backend/                       # FastAPI 后端
    ├── app/                       # 应用主目录
    │   ├── main.py               # FastAPI 应用入口
    │   ├── api/                  # API 路由
    │   │   ├── __init__.py
    │   │   └── humanize.py       # 人性化 API
    │   ├── services/             # 业务逻辑
    │   │   ├── __init__.py
    │   │   ├── text_processor.py # 文本处理服务
    │   │   └── document_parser.py# 文档解析服务
    │   ├── models/               # 数据模型
    │   │   ├── __init__.py
    │   │   └── schemas.py        # Pydantic 模型
    │   ├── utils/                # 工具函数
    │   │   ├── __init__.py
    │   │   ├── validators.py     # 验证器
    │   │   └── helpers.py        # 辅助函数
    │   └── config.py             # 配置文件
    ├── tests/                    # 测试文件
    │   ├── __init__.py
    │   ├── test_api.py           # API 测试
    │   └── test_services.py      # 服务测试
    ├── requirements.txt          # Python 依赖
    ├── Dockerfile                # Docker 配置(可选)
    └── README.md                 # 后端文档
```

## 2. 前端设计

### 2.1 页面设计

#### 2.1.1 主页 (`app/page.tsx`)
```typescript
// 主要功能:
// 1. 整合所有组件
// 2. 管理全局状态
// 3. 协调组件交互

export default function HomePage() {
  // 表单管理
  const form = useForm<HumanizeFormData>({
    resolver: zodResolver(humanizeSchema),
    defaultValues: { /* ... */ }
  });
  
  // 处理提交
  const { mutate: humanize, isLoading } = useHumanize();
  
  // 历史记录
  const { history, addToHistory } = useHistory();
  
  return (
    <div>
      <Header />
      <InputSection form={form} />
      <ParamBar form={form} />
      <ActionButtons />
      <OutputSection />
      <HistoryRail history={history} />
      <Footer />
    </div>
  );
}
```

### 2.2 核心组件设计

#### 2.2.1 UploadDropzone 组件
```typescript
interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile?: File;
  error?: string;
}

// 功能:
// - 拖拽上传
// - 点击上传
// - 文件验证(格式、大小)
// - 显示文件信息
// - 移除文件
```

#### 2.2.2 ParamBar 组件
```typescript
interface ParamBarProps {
  form: UseFormReturn<HumanizeFormData>;
}

// 功能:
// - 三个下拉选择器(Length, Similarity, Style)
// - Style=Custom 时显示输入框
// - 移动端折叠为 Drawer
// - 参数验证
```

#### 2.2.3 OutputPanel 组件
```typescript
interface OutputPanelProps {
  content: string;
  charCount: number;
  isLoading: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
}

// 功能:
// - 显示重写结果
// - 复制、下载、重新生成按钮
// - 加载状态(skeleton)
// - 字符数统计
```

#### 2.2.4 FineTuner 组件
```typescript
interface FineTunerProps {
  onAdjust: (params: FineTuneParams) => void;
}

// 功能:
// - 语气滑块(Tone: Formal ↔ Casual)
// - 句长滑块(Sentence Length: Short ↔ Long)
// - 复杂度滑块(Complexity: Simple ↔ Complex)
// - 实时预览调整效果(仅前端模拟)
```

#### 2.2.5 HistoryRail 组件
```typescript
interface HistoryRailProps {
  history: HistoryItem[];
  onItemClick: (item: HistoryItem) => void;
}

interface HistoryItem {
  id: string;
  preview: string;        // 前 100 字
  timestamp: number;
  params: {
    length: string;
    similarity: string;
    style: string;
  };
}

// 功能:
// - 显示最近 3 条记录
// - 点击回填
// - 时间格式化
```

### 2.3 数据流设计

#### 2.3.1 表单验证 Schema
```typescript
// schemas/humanize.ts
import { z } from 'zod';

export const humanizeSchema = z.object({
  mode: z.enum(['text', 'document']),
  text: z.string()
    .max(5000, '最多支持 5000 个字符')
    .refine(
      (val) => val.length === 0 || val.length >= 300,
      '最少需要 300 个字符'
    ),
  file: z.instanceof(File).optional(),
  length: z.enum(['Normal', 'Concise', 'Expanded']),
  similarity: z.enum(['Low', 'Moderate', 'High', 'Neutral']),
  style: z.enum([
    'Neutral', 'Academic', 'Business', 'Creative',
    'Technical', 'Friendly', 'Informal', 'Reference', 'Custom'
  ]),
  customStyle: z.string().max(120).optional()
}).refine(
  (data) => {
    if (data.mode === 'document') return !!data.file;
    return data.text.length >= 300;
  },
  { message: '请提供至少 300 字符的文本或上传文件' }
).refine(
  (data) => {
    if (data.style === 'Custom') return !!data.customStyle;
    return true;
  },
  { message: '请提供自定义风格描述' }
);

export type HumanizeFormData = z.infer<typeof humanizeSchema>;
```

#### 2.3.2 API 调用层
```typescript
// lib/api.ts
export interface HumanizeRequest {
  source: {
    mode: 'text' | 'document';
    text: string;
  };
  params: {
    length: string;
    similarity: string;
    style: string;
    customStyle?: string;
  };
}

export interface HumanizeResponse {
  content: string;
  chars: number;
}

export async function humanizeText(
  request: HumanizeRequest
): Promise<HumanizeResponse> {
  const response = await fetch('/api/humanize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error('处理失败');
  }
  
  return response.json();
}
```

#### 2.3.3 自定义 Hooks

**useCharCount Hook**
```typescript
// hooks/useCharCount.ts
export function useCharCount(text: string) {
  const count = useMemo(() => {
    return new TextEncoder().encode(text).length;
  }, [text]);
  
  const isValid = count >= 300 && count <= 5000;
  const isTooShort = count > 0 && count < 300;
  const isTooLong = count > 5000;
  
  return { count, isValid, isTooShort, isTooLong };
}
```

**useHistory Hook**
```typescript
// hooks/useHistory.ts
export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    // 从 LocalStorage 加载
    const stored = localStorage.getItem('humanize_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);
  
  const addToHistory = (item: Omit<HistoryItem, 'id'>) => {
    const newItem = { ...item, id: Date.now().toString() };
    const newHistory = [newItem, ...history].slice(0, 3);
    setHistory(newHistory);
    localStorage.setItem('humanize_history', JSON.stringify(newHistory));
  };
  
  return { history, addToHistory };
}
```

**useHumanize Hook**
```typescript
// hooks/useHumanize.ts
export function useHumanize() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HumanizeResponse | null>(null);
  
  const mutate = async (data: HumanizeFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 处理文档
      let text = data.text;
      if (data.mode === 'document' && data.file) {
        text = await parseDocument(data.file);
        if (text.length > 5000) {
          text = text.slice(0, 5000);
          toast.warning('文档内容超过 5000 字符,已自动截断');
        }
      }
      
      // 调用 API
      const response = await humanizeText({
        source: { mode: data.mode, text },
        params: {
          length: data.length,
          similarity: data.similarity,
          style: data.style,
          customStyle: data.customStyle
        }
      });
      
      setResult(response);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : '处理失败';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { mutate, isLoading, error, result };
}
```

### 2.4 样式设计

#### 2.4.1 Tailwind 配置
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#137fec',
        'background-light': '#f6f7f8',
        'background-dark': '#101922',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;
```

#### 2.4.2 响应式断点
- **Mobile**: < 768px (单栏布局,参数条折叠)
- **Tablet**: 768px - 1023px (优化间距)
- **Desktop**: ≥ 1024px (双栏布局)

### 2.5 无障碍性设计

#### 2.5.1 语义化 HTML
- 使用正确的 HTML5 标签 (`main`, `section`, `nav`, `button`)
- 表单元素关联 `label`
- 使用 `aria-label`、`aria-describedby` 等属性

#### 2.5.2 键盘导航
- Tab 键顺序逻辑
- Enter 键提交表单
- Escape 键关闭对话框
- 焦点可见样式

#### 2.5.3 屏幕阅读器支持
- `role` 属性标记组件角色
- `aria-live` 区域通知状态变化
- 错误提示关联到表单字段

## 3. 后端设计

### 3.1 API 设计

#### 3.1.1 人性化处理 API
```python
# API 端点: POST /api/v1/humanize

# 请求体
{
  "source": {
    "mode": "text",  # "text" | "document"
    "text": "The rain tapped gently..."
  },
  "params": {
    "length": "Normal",      # "Normal" | "Concise" | "Expanded"
    "similarity": "Moderate", # "Low" | "Moderate" | "High" | "Neutral"
    "style": "Neutral",      # ... | "Custom"
    "customStyle": null      # 当 style="Custom" 时必填
  }
}

# 响应体(成功)
{
  "content": "Rain gently tapped against...",
  "chars": 1234,
  "processingTime": 850  # 毫秒
}

# 响应体(失败)
{
  "detail": "Text length must be between 300 and 5000 characters"
}
```

### 3.2 数据模型

#### 3.2.1 Pydantic 模型
```python
# models/schemas.py
from pydantic import BaseModel, Field, validator
from enum import Enum
from typing import Optional

class InputMode(str, Enum):
    TEXT = "text"
    DOCUMENT = "document"

class Length(str, Enum):
    NORMAL = "Normal"
    CONCISE = "Concise"
    EXPANDED = "Expanded"

class Similarity(str, Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    NEUTRAL = "Neutral"

class Style(str, Enum):
    NEUTRAL = "Neutral"
    ACADEMIC = "Academic"
    BUSINESS = "Business"
    CREATIVE = "Creative"
    TECHNICAL = "Technical"
    FRIENDLY = "Friendly"
    INFORMAL = "Informal"
    REFERENCE = "Reference"
    CUSTOM = "Custom"

class Source(BaseModel):
    mode: InputMode
    text: str = Field(..., min_length=300, max_length=5000)

class Params(BaseModel):
    length: Length
    similarity: Similarity
    style: Style
    customStyle: Optional[str] = Field(None, max_length=120)
    
    @validator('customStyle')
    def validate_custom_style(cls, v, values):
        if values.get('style') == Style.CUSTOM and not v:
            raise ValueError('Custom style description is required')
        return v

class HumanizeRequest(BaseModel):
    source: Source
    params: Params

class HumanizeResponse(BaseModel):
    content: str
    chars: int
    processingTime: int
```

### 3.3 服务层设计

#### 3.3.1 文本处理服务
```python
# services/text_processor.py
import random
import time
from typing import Dict

class TextProcessorService:
    """模拟文本人性化处理服务"""
    
    def humanize(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str = None
    ) -> Dict[str, any]:
        """
        模拟人性化处理
        在实际应用中,这里会调用真实的 AI 模型
        """
        # 模拟处理延迟
        delay = random.randint(800, 1200) / 1000
        time.sleep(delay)
        
        # 模拟文本转换
        processed_text = self._mock_transform(
            text, length, similarity, style, custom_style
        )
        
        return {
            "content": processed_text,
            "chars": len(processed_text.encode('utf-8')),
            "processingTime": int(delay * 1000)
        }
    
    def _mock_transform(
        self,
        text: str,
        length: str,
        similarity: str,
        style: str,
        custom_style: str
    ) -> str:
        """模拟文本转换逻辑"""
        # 这里实现简单的模拟转换
        # 实际应用中会调用 AI 模型
        
        result = text
        
        # 根据长度调整
        if length == "Concise":
            result = self._shorten_text(result)
        elif length == "Expanded":
            result = self._expand_text(result)
        
        # 根据风格调整
        if style == "Academic":
            result = self._apply_academic_style(result)
        elif style == "Casual":
            result = self._apply_casual_style(result)
        # ... 其他风格
        
        return result
    
    def _shorten_text(self, text: str) -> str:
        """缩短文本(模拟)"""
        sentences = text.split('. ')
        return '. '.join(sentences[:max(1, len(sentences) // 2)]) + '.'
    
    def _expand_text(self, text: str) -> str:
        """扩展文本(模拟)"""
        expansions = [
            " This is particularly noteworthy.",
            " It's worth mentioning that this creates a unique atmosphere.",
            " The implications of this are quite significant."
        ]
        return text + random.choice(expansions)
    
    def _apply_academic_style(self, text: str) -> str:
        """应用学术风格(模拟)"""
        replacements = {
            "it's": "it is",
            "can't": "cannot",
            "don't": "do not"
        }
        result = text
        for old, new in replacements.items():
            result = result.replace(old, new)
        return result
    
    def _apply_casual_style(self, text: str) -> str:
        """应用非正式风格(模拟)"""
        return text.replace(".", "!").replace("very", "really")
```

#### 3.3.2 文档解析服务
```python
# services/document_parser.py
import io
from typing import BinaryIO
import PyPDF2
from docx import Document
from pptx import Presentation

class DocumentParserService:
    """文档解析服务"""
    
    def parse_pdf(self, file: BinaryIO) -> str:
        """解析 PDF 文件"""
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    
    def parse_docx(self, file: BinaryIO) -> str:
        """解析 DOCX 文件"""
        doc = Document(file)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    
    def parse_pptx(self, file: BinaryIO) -> str:
        """解析 PPTX 文件"""
        prs = Presentation(file)
        text = ""
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text += shape.text + "\n"
        return text.strip()
    
    def parse_txt(self, file: BinaryIO) -> str:
        """解析 TXT 文件"""
        return file.read().decode('utf-8').strip()
    
    def parse(self, file: BinaryIO, filename: str) -> str:
        """根据文件类型解析文档"""
        ext = filename.lower().split('.')[-1]
        
        if ext == 'pdf':
            return self.parse_pdf(file)
        elif ext in ['docx', 'doc']:
            return self.parse_docx(file)
        elif ext in ['pptx', 'ppt']:
            return self.parse_pptx(file)
        elif ext == 'txt':
            return self.parse_txt(file)
        else:
            raise ValueError(f"Unsupported file type: {ext}")
```

### 3.4 路由层设计

```python
# api/humanize.py
from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.schemas import HumanizeRequest, HumanizeResponse
from app.services.text_processor import TextProcessorService
from app.services.document_parser import DocumentParserService

router = APIRouter(prefix="/api/v1", tags=["humanize"])

text_processor = TextProcessorService()
document_parser = DocumentParserService()

@router.post("/humanize", response_model=HumanizeResponse)
async def humanize_text(request: HumanizeRequest):
    """
    人性化处理文本
    
    接收文本或文档内容,根据参数进行人性化重写
    """
    try:
        result = text_processor.humanize(
            text=request.source.text,
            length=request.params.length,
            similarity=request.params.similarity,
            style=request.params.style,
            custom_style=request.params.customStyle
        )
        return HumanizeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/parse-document")
async def parse_document(file: UploadFile = File(...)):
    """
    解析文档并提取文本
    
    注意: 前端版本中,文档解析在客户端完成
    此端点为可选的服务器端实现
    """
    if file.size > 40 * 1024 * 1024:  # 40MB
        raise HTTPException(status_code=400, detail="File too large")
    
    allowed_extensions = ['pdf', 'docx', 'pptx', 'txt']
    ext = file.filename.split('.')[-1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    try:
        content = await file.read()
        text = document_parser.parse(io.BytesIO(content), file.filename)
        
        # 限制长度
        if len(text) > 5000:
            text = text[:5000]
        
        return {"text": text, "truncated": len(text) == 5000}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse document: {str(e)}")
```

### 3.5 应用入口

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import humanize

app = FastAPI(
    title="AI Text Humanizer API",
    description="将 AI 生成的文本转换为人类风格的内容",
    version="1.0.0"
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(humanize.router)

@app.get("/")
async def root():
    return {
        "message": "AI Text Humanizer API",
        "docs": "/docs",
        "health": "ok"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

## 4. 数据交互流程

### 4.1 文本处理流程

```
┌─────────┐
│  用户   │
└────┬────┘
     │ 1. 输入文本 + 选择参数
     ▼
┌─────────────────┐
│  InputSection   │
└────┬────────────┘
     │ 2. 表单验证(React Hook Form + Zod)
     ▼
┌─────────────────┐
│  useHumanize    │ (Hook)
└────┬────────────┘
     │ 3. 调用 API
     ▼
┌─────────────────┐
│  POST /api/     │
│    humanize     │ (Next.js API Route - 可选代理)
└────┬────────────┘
     │ 4. 转发请求
     ▼
┌─────────────────┐
│  FastAPI        │
│  /api/v1/       │
│  humanize       │
└────┬────────────┘
     │ 5. 业务处理
     ▼
┌─────────────────┐
│ TextProcessor   │
│  Service        │
└────┬────────────┘
     │ 6. 模拟转换(800-1200ms)
     ▼
┌─────────────────┐
│  返回结果       │
│  {content,      │
│   chars}        │
└────┬────────────┘
     │ 7. 响应
     ▼
┌─────────────────┐
│  OutputPanel    │ (显示结果)
└────┬────────────┘
     │ 8. 保存历史
     ▼
┌─────────────────┐
│  LocalStorage   │
└─────────────────┘
```

### 4.2 文档上传流程

```
┌─────────┐
│  用户   │
└────┬────┘
     │ 1. 上传文档(拖拽/点击)
     ▼
┌─────────────────┐
│ UploadDropzone  │
└────┬────────────┘
     │ 2. 验证文件(格式、大小)
     ▼
┌─────────────────┐
│  FileReader API │ (前端解析)
└────┬────────────┘
     │ 3. 提取文本
     ▼
┌─────────────────┐
│  检查长度       │
└────┬────────────┘
     │ 4a. ≤ 5000 字符
     │ 4b. > 5000 字符 → 截断 + 提示
     ▼
┌─────────────────┐
│  填充到文本框   │
└────┬────────────┘
     │ 5. 后续流程同文本处理
     ▼
```

## 5. 状态管理

### 5.1 前端状态

#### 5.1.1 表单状态
- 由 React Hook Form 管理
- 实时验证
- 错误信息显示

#### 5.1.2 UI 状态
```typescript
interface UIState {
  isLoading: boolean;        // 处理中
  activeTab: 'text' | 'document';
  showCustomStyleInput: boolean;
  isMobileParamDrawerOpen: boolean;
}
```

#### 5.1.3 数据状态
```typescript
interface DataState {
  inputText: string;
  uploadedFile?: File;
  outputContent?: string;
  outputCharCount?: number;
  history: HistoryItem[];
}
```

### 5.2 LocalStorage 数据结构

```typescript
// Key: "humanize_history"
// Value: HistoryItem[]

interface HistoryItem {
  id: string;               // 唯一标识
  preview: string;          // 前 100 字
  fullText: string;         // 完整输入文本
  outputText: string;       // 完整输出文本
  timestamp: number;        // Unix 时间戳
  params: {
    length: string;
    similarity: string;
    style: string;
    customStyle?: string;
  };
}
```

## 6. 错误处理

### 6.1 前端错误处理

#### 6.1.1 表单验证错误
- 内联错误提示(红色文本)
- 字段边框变红
- 禁用提交按钮

#### 6.1.2 API 错误
- Toast 通知(错误类型 + 消息)
- 内联错误提示
- 提供重试选项

#### 6.1.3 文件上传错误
```typescript
enum FileUploadError {
  INVALID_FORMAT = "不支持的文件格式",
  FILE_TOO_LARGE = "文件大小超过 40MB",
  PARSE_FAILED = "文件解析失败",
  EMPTY_CONTENT = "文件内容为空"
}
```

### 6.2 后端错误处理

#### 6.2.1 HTTP 状态码
- `400 Bad Request`: 请求参数错误
- `413 Payload Too Large`: 文件过大
- `415 Unsupported Media Type`: 文件格式不支持
- `422 Unprocessable Entity`: 验证失败
- `500 Internal Server Error`: 服务器错误

#### 6.2.2 错误响应格式
```json
{
  "detail": "错误描述信息"
}
```

## 7. 性能优化

### 7.1 前端优化

#### 7.1.1 代码分割
- 使用 Next.js 自动代码分割
- 懒加载非关键组件(历史记录、微调器)
- 动态导入大型库

#### 7.1.2 资源优化
- 图片懒加载
- 字体子集化
- 压缩静态资源

#### 7.1.3 渲染优化
- 使用 `React.memo` 防止不必要的重渲染
- `useMemo` 缓存计算结果
- `useCallback` 缓存函数引用
- 虚拟滚动(如历史记录很多时)

#### 7.1.4 网络优化
- API 请求防抖
- 取消未完成的请求(用户快速切换)
- 预加载关键资源

### 7.2 后端优化

#### 7.2.1 响应优化
- 异步处理
- 流式响应(大文本)
- 压缩响应体(gzip)

#### 7.2.2 文档解析优化
- 限制解析时间(超时机制)
- 内存管理(大文件流式读取)
- 缓存解析结果(相同文件)

## 8. 测试策略

### 8.1 前端测试

#### 8.1.1 单元测试
```typescript
// tests/unit/schemas.test.ts
describe('humanizeSchema', () => {
  it('should validate text with 300-5000 chars', () => {
    const valid = humanizeSchema.safeParse({
      mode: 'text',
      text: 'a'.repeat(300),
      length: 'Normal',
      similarity: 'Moderate',
      style: 'Neutral'
    });
    expect(valid.success).toBe(true);
  });
  
  it('should reject text < 300 chars', () => {
    const invalid = humanizeSchema.safeParse({
      mode: 'text',
      text: 'short',
      // ...
    });
    expect(invalid.success).toBe(false);
  });
});
```

#### 8.1.2 组件测试
```typescript
// tests/unit/UploadDropzone.test.tsx
describe('UploadDropzone', () => {
  it('should accept valid file formats', async () => {
    const { getByText } = render(<UploadDropzone {...props} />);
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    
    const dropzone = getByText(/upload/i);
    await userEvent.upload(dropzone, file);
    
    expect(props.onFileSelect).toHaveBeenCalledWith(file);
  });
  
  it('should reject invalid file formats', async () => {
    // ...
  });
});
```

#### 8.1.3 集成测试
```typescript
// tests/integration/humanize-flow.test.tsx
describe('Humanize Flow', () => {
  it('should complete full humanize process', async () => {
    const { getByRole, getByText } = render(<HomePage />);
    
    // 输入文本
    const textarea = getByRole('textbox');
    await userEvent.type(textarea, 'a'.repeat(300));
    
    // 点击提交
    const button = getByText('Humanize');
    await userEvent.click(button);
    
    // 等待结果
    await waitFor(() => {
      expect(getByText(/result/i)).toBeInTheDocument();
    });
  });
});
```

### 8.2 后端测试

#### 8.2.1 API 测试
```python
# tests/test_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_humanize_success():
    response = client.post("/api/v1/humanize", json={
        "source": {
            "mode": "text",
            "text": "a" * 300
        },
        "params": {
            "length": "Normal",
            "similarity": "Moderate",
            "style": "Neutral"
        }
    })
    assert response.status_code == 200
    data = response.json()
    assert "content" in data
    assert "chars" in data

def test_humanize_text_too_short():
    response = client.post("/api/v1/humanize", json={
        "source": {
            "mode": "text",
            "text": "short"
        },
        # ...
    })
    assert response.status_code == 422
```

#### 8.2.2 服务测试
```python
# tests/test_services.py
def test_text_processor():
    processor = TextProcessorService()
    result = processor.humanize(
        text="a" * 300,
        length="Normal",
        similarity="Moderate",
        style="Neutral"
    )
    assert "content" in result
    assert result["chars"] > 0
    assert result["processingTime"] >= 800
```

## 9. 部署架构

### 9.1 开发环境
```bash
# 前端
cd web/frontend
pnpm install
pnpm dev  # http://localhost:3000

# 后端
cd web/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:18201
```

### 9.2 生产环境

#### 9.2.1 前端部署
- **平台**: Vercel / Netlify
- **构建命令**: `pnpm build`
- **输出目录**: `.next`
- **环境变量**: `NEXT_PUBLIC_API_URL`

#### 9.2.2 后端部署
- **平台**: Railway / Render / AWS / Docker
- **启动命令**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **环境变量**: `CORS_ORIGINS`, `LOG_LEVEL`

### 9.3 Docker 部署(可选)

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:18201
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - CORS_ORIGINS=http://localhost:3000
```

## 10. 安全考虑

### 10.1 前端安全
- XSS 防护: 使用 React 的自动转义
- CSRF: Next.js 内置保护
- 敏感数据: 不在客户端存储敏感信息

### 10.2 后端安全
- CORS: 限制允许的来源
- 文件上传: 验证文件类型和大小
- 输入验证: Pydantic 模型验证
- 速率限制: 使用 slowapi 或 nginx

### 10.3 数据隐私
- 用户数据不持久化存储
- 历史记录仅本地保存
- 不记录用户输入日志(生产环境)

## 11. 监控与日志

### 11.1 前端监控
- 错误监控: Sentry
- 性能监控: Web Vitals
- 用户行为: Google Analytics (可选)

### 11.2 后端监控
- 日志: Python logging 模块
- 性能: FastAPI 中间件记录请求时间
- 健康检查: `/health` 端点

## 12. 扩展性考虑

### 12.1 未来功能扩展
- 用户账户系统
- 批量处理
- API 密钥管理
- 更多文件格式支持
- 实时协作编辑
- 风格模板保存

### 12.2 AI 模型集成
当前使用模拟实现,未来可集成:
- OpenAI GPT-4
- Anthropic Claude
- 自训练模型
- 多模型对比

---

**文档版本**: 1.0  
**创建日期**: 2025-10-22  
**最后更新**: 2025-10-22  
**状态**: 待审核

