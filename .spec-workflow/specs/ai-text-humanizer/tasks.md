# AI 文本人性化重写系统 - 任务分解

## 任务状态说明
- `[ ]` 待处理
- `[-]` 进行中
- `[x]` 已完成

---

## 第一阶段: 项目初始化与基础架构

### - [x] 任务 1.1: 初始化 Next.js 前端项目
**文件**: 
- `web/frontend/package.json`
- `web/frontend/next.config.js`
- `web/frontend/tsconfig.json`
- `web/frontend/tailwind.config.ts`

**需求引用**: NFR-3.5.1, NFR-3.5.2

**描述**: 
创建 Next.js 14 项目,配置 TypeScript、TailwindCSS、ESLint、Prettier

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位资深的 Next.js 全栈工程师,精通 TypeScript 和现代前端工程化。

**任务**: 初始化 Next.js 14 前端项目,配置完整的开发环境

**上下文**: 
- 项目位于 /Users/yuyuan/studyx_human/web/frontend/
- 使用 Next.js 14 App Router
- 需要配置 TypeScript、TailwindCSS、ESLint、Prettier

**步骤**:
1. 在任务开始前,编辑 .spec-workflow/specs/ai-text-humanizer/tasks.md,将任务 1.1 的状态从 [ ] 改为 [-]
2. 在 web/frontend/ 目录初始化 Next.js 14 项目
3. 配置 package.json,包含所有必要依赖
4. 配置 tsconfig.json (严格模式,无 any)
5. 配置 tailwind.config.ts (使用设计文档中的颜色和字体)
6. 配置 .eslintrc.json 和 .prettierrc
7. 创建 app/layout.tsx 和 app/page.tsx 基础结构
8. 创建 app/globals.css
9. 验证项目可以正常构建 (pnpm build)
10. 在任务完成后,编辑 tasks.md,将任务 1.1 的状态从 [-] 改为 [x]

**约束**:
- 使用 pnpm 作为包管理器
- TypeScript 严格模式,不允许 any
- 遵循 Next.js 14 App Router 最佳实践
- 不要安装非必要的依赖

**验收标准**:
- ✅ pnpm build 成功
- ✅ pnpm dev 可以启动开发服务器
- ✅ TypeScript 无错误
- ✅ ESLint 无错误
- ✅ 页面可以正常访问 (http://localhost:3000)
```

---

### - [x] 任务 1.2: 集成 shadcn/ui 组件库
**文件**:
- `web/frontend/components/ui/*.tsx`
- `web/frontend/lib/utils.ts`
- `web/frontend/components.json`

**需求引用**: NFR-3.5.1

**描述**: 
安装和配置 shadcn/ui,初始化需要的基础 UI 组件

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React UI 组件的前端工程师。

**任务**: 集成 shadcn/ui 组件库,安装所有需要的 UI 组件

**上下文**:
- 前端项目已初始化
- 需要的组件: Button, Tabs, Select, Card, Textarea, Input, Tooltip, Progress, Dialog, Toast

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 1.2 的状态改为 [-]
2. 初始化 shadcn/ui (npx shadcn-ui@latest init)
3. 安装所有需要的组件:
   - button
   - tabs
   - select
   - card
   - textarea
   - input
   - tooltip
   - progress
   - dialog
   - toast (sonner)
4. 创建 lib/utils.ts 工具函数
5. 验证组件可以正常导入和使用
6. 在任务完成后,编辑 tasks.md,将任务 1.2 的状态改为 [x]

**约束**:
- 使用 shadcn/ui 官方推荐的配置
- 所有组件放在 components/ui/ 目录
- 不修改组件源码,保持可更新性

**验收标准**:
- ✅ 所有组件安装成功
- ✅ 可以正常导入和使用
- ✅ TypeScript 无错误
```

---

### - [x] 任务 1.3: 初始化 FastAPI 后端项目
**文件**:
- `web/backend/requirements.txt`
- `web/backend/app/main.py`
- `web/backend/app/config.py`

**需求引用**: NFR-3.5.1, NFR-3.5.2

**描述**:
创建 FastAPI 项目,配置 CORS、基础路由、健康检查

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位资深的 Python 后端工程师,精通 FastAPI。

**任务**: 初始化 FastAPI 后端项目,配置基础架构

**上下文**:
- 项目位于 /Users/yuyuan/studyx_human/web/backend/
- 需要配置 CORS 允许前端访问
- 使用 Python 3.11+

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 1.3 的状态改为 [-]
2. 创建项目目录结构
3. 创建 requirements.txt,包含:
   - fastapi>=0.104.0
   - uvicorn[standard]>=0.24.0
   - pydantic>=2.0.0
   - python-multipart
   - PyPDF2 或 pdfplumber
   - python-docx
   - python-pptx
   - pytest
   - httpx
4. 创建 app/main.py,配置 FastAPI 应用
5. 配置 CORS 中间件
6. 创建 / 和 /health 端点
7. 创建 app/config.py 配置文件
8. 验证服务可以正常启动
9. 在任务完成后,编辑 tasks.md,将任务 1.3 的状态改为 [x]

**约束**:
- 使用 Python 虚拟环境 (venv)
- 遵循 FastAPI 最佳实践
- 代码有类型提示

**验收标准**:
- ✅ uvicorn app.main:app --reload 可以启动
- ✅ 访问 http://localhost:8000 返回正常
- ✅ 访问 http://localhost:8000/docs 显示 API 文档
- ✅ 访问 http://localhost:8000/health 返回健康状态
```

---

## 第二阶段: 数据模型与验证

### - [x] 任务 2.1: 创建前端 Zod 验证模式
**文件**:
- `web/frontend/schemas/humanize.ts`
- `web/frontend/types/index.ts`

**需求引用**: FR-2.5.1

**描述**:
定义表单验证模式和 TypeScript 类型

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 TypeScript 和数据验证的前端工程师。

**任务**: 创建 Zod 验证模式和 TypeScript 类型定义

**上下文**:
- 需要验证文本输入(300-5000 字符)
- 需要验证文档上传
- 需要验证参数选择
- 参考设计文档 2.3.1 节

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 2.1 的状态改为 [-]
2. 创建 schemas/humanize.ts
3. 定义 humanizeSchema (参考设计文档)
4. 定义所有相关的 TypeScript 类型
5. 导出 HumanizeFormData 类型
6. 创建 types/index.ts,汇总所有类型
7. 编写单元测试验证 schema
8. 在任务完成后,编辑 tasks.md,将任务 2.1 的状态改为 [x]

**_Leverage**:
- 参考 design.md 第 2.3.1 节的 schema 定义

**_Requirements**:
- FR-2.5.1: 输入验证

**约束**:
- 所有验证规则必须与需求文档一致
- 提供清晰的错误信息
- 支持中文错误消息

**验收标准**:
- ✅ Schema 验证逻辑正确
- ✅ 类型定义完整
- ✅ 单元测试通过
```

---

### - [x] 任务 2.2: 创建后端 Pydantic 模型
**文件**:
- `web/backend/app/models/schemas.py`

**需求引用**: FR-2.5.1

**描述**:
定义 API 请求/响应模型

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 Pydantic 和 FastAPI 的后端工程师。

**任务**: 创建 Pydantic 数据模型

**上下文**:
- 定义 API 的请求和响应结构
- 使用 Pydantic v2
- 参考设计文档 3.2 节

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 2.2 的状态改为 [-]
2. 创建 app/models/schemas.py
3. 定义所有 Enum 类型 (InputMode, Length, Similarity, Style)
4. 定义 Source 模型
5. 定义 Params 模型 (含验证器)
6. 定义 HumanizeRequest 模型
7. 定义 HumanizeResponse 模型
8. 编写单元测试
9. 在任务完成后,编辑 tasks.md,将任务 2.2 的状态改为 [x]

**_Leverage**:
- 参考 design.md 第 3.2.1 节的模型定义

**_Requirements**:
- FR-2.5.1: 输入验证

**约束**:
- 使用 Pydantic v2 语法
- 添加适当的验证器
- 提供示例值 (用于 API 文档)

**验收标准**:
- ✅ 模型定义完整
- ✅ 验证逻辑正确
- ✅ API 文档自动生成
```

---

## 第三阶段: 输入管理

### - [ ] 任务 3.1: 实现字符计数 Hook
**文件**:
- `web/frontend/hooks/useCharCount.ts`

**需求引用**: FR-2.1.3

**描述**:
创建字符计数自定义 Hook

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React Hooks 的前端工程师。

**任务**: 实现字符计数自定义 Hook

**上下文**:
- 需要使用 TextEncoder 统计字符数
- 支持多语言字符
- 返回验证状态

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 3.1 的状态改为 [-]
2. 创建 hooks/useCharCount.ts
3. 实现字符计数逻辑 (使用 TextEncoder)
4. 返回 count, isValid, isTooShort, isTooLong
5. 使用 useMemo 优化性能
6. 编写单元测试
7. 在任务完成后,编辑 tasks.md,将任务 3.1 的状态改为 [x]

**_Leverage**:
- 参考 design.md 第 2.3.3 节

**_Requirements**:
- FR-2.1.3: 字符统计

**约束**:
- 必须使用 TextEncoder().encode(text).length
- 优化性能,避免不必要的计算

**验收标准**:
- ✅ 字符计数准确
- ✅ 支持多语言(中文、emoji)
- ✅ 性能良好
```

---

### - [ ] 任务 3.2: 实现文档上传组件
**文件**:
- `web/frontend/components/UploadDropzone.tsx`

**需求引用**: FR-2.1.2

**描述**:
创建支持拖拽的文档上传组件

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React 和文件处理的前端工程师。

**任务**: 实现文档上传组件 (拖拽 + 点击)

**上下文**:
- 支持 PDF/PPT/DOCX/TXT
- 最大 40MB
- 拖拽和点击上传
- 显示文件信息
- 错误提示

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 3.2 的状态改为 [-]
2. 创建 components/UploadDropzone.tsx
3. 实现拖拽事件处理 (onDragOver, onDrop)
4. 实现点击上传 (input file)
5. 文件验证 (格式、大小)
6. 显示文件信息 (名称、大小、图标)
7. 添加移除按钮
8. 错误状态显示
9. 添加无障碍属性
10. 在任务完成后,编辑 tasks.md,将任务 3.2 的状态改为 [x]

**_Leverage**:
- 使用 shadcn/ui Card 组件
- 使用 lucide-react 图标
- 参考现有设计 HTML

**_Requirements**:
- FR-2.1.2: 文档上传

**约束**:
- 必须验证文件格式和大小
- 提供清晰的用户反馈
- 支持键盘操作

**验收标准**:
- ✅ 拖拽上传正常
- ✅ 点击上传正常
- ✅ 文件验证准确
- ✅ 错误提示友好
- ✅ 无障碍性符合标准
```

---

### - [ ] 任务 3.3: 实现文本输入区域
**文件**:
- `web/frontend/components/InputSection.tsx`

**需求引用**: FR-2.1.1, FR-2.1.3

**描述**:
创建文本输入组件,集成 Tabs 切换

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React Hook Form 的前端工程师。

**任务**: 实现输入区域组件 (Text/Document 切换)

**上下文**:
- 使用 Tabs 切换输入模式
- 文本模式: Textarea + 字符计数
- 文档模式: UploadDropzone
- 集成 React Hook Form

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 3.3 的状态改为 [-]
2. 创建 components/InputSection.tsx
3. 使用 shadcn/ui Tabs 组件
4. 集成 React Hook Form
5. 文本 Tab: Textarea + useCharCount
6. 文档 Tab: UploadDropzone
7. 错误状态显示
8. 实时验证
9. 在任务完成后,编辑 tasks.md,将任务 3.3 的状态改为 [x]

**_Leverage**:
- 使用 components/UploadDropzone.tsx
- 使用 hooks/useCharCount.ts
- 使用 shadcn/ui Tabs, Textarea

**_Requirements**:
- FR-2.1.1: 文本输入
- FR-2.1.3: 字符统计

**约束**:
- 必须使用 React Hook Form Controller
- 验证规则使用 Zod schema
- 支持受控组件

**验收标准**:
- ✅ Tabs 切换正常
- ✅ 表单验证正确
- ✅ 字符计数实时更新
- ✅ 错误提示清晰
```

---

## 第四阶段: 参数控制

### - [ ] 任务 4.1: 实现参数控制栏组件
**文件**:
- `web/frontend/components/ParamBar.tsx`

**需求引用**: FR-2.2.1, FR-2.2.2, FR-2.2.3

**描述**:
创建参数选择组件 (Length, Similarity, Style)

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通表单设计的前端工程师。

**任务**: 实现参数控制栏 (三个下拉选择 + 自定义输入)

**上下文**:
- 三个参数: Length, Similarity, Style
- Style=Custom 时显示额外输入框
- 移动端折叠为 Drawer
- 集成 React Hook Form

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 4.1 的状态改为 [-]
2. 创建 components/ParamBar.tsx
3. 实现三个 Select 组件
4. Style 变化时显示/隐藏自定义输入
5. 移动端使用 Drawer 展示
6. 集成 React Hook Form
7. 添加 Tooltip 说明
8. 响应式布局
9. 在任务完成后,编辑 tasks.md,将任务 4.1 的状态改为 [x]

**_Leverage**:
- 使用 shadcn/ui Select, Input, Drawer, Tooltip
- 使用 React Hook Form Controller

**_Requirements**:
- FR-2.2.1: 长度参数
- FR-2.2.2: 相似度参数
- FR-2.2.3: 风格参数

**约束**:
- 移动端 (<768px) 使用 Drawer
- 桌面端横向排列
- 所有选项必须与需求一致

**验收标准**:
- ✅ 三个下拉正常工作
- ✅ Custom 输入框条件显示
- ✅ 移动端 Drawer 正常
- ✅ 表单集成正确
```

---

## 第五阶段: 后端服务

### - [ ] 任务 5.1: 实现文本处理服务
**文件**:
- `web/backend/app/services/text_processor.py`

**需求引用**: FR-2.3.1

**描述**:
创建模拟文本人性化处理服务

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 Python 和文本处理的后端工程师。

**任务**: 实现文本处理服务 (模拟 AI 转换)

**上下文**:
- 模拟延迟 800-1200ms
- 根据参数进行简单的文本转换
- 不调用真实 AI 模型

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 5.1 的状态改为 [-]
2. 创建 app/services/text_processor.py
3. 实现 TextProcessorService 类
4. 实现 humanize 方法 (模拟延迟)
5. 实现 _mock_transform 方法
6. 根据 length 参数调整文本长度
7. 根据 style 参数调整文本风格
8. 编写单元测试
9. 在任务完成后,编辑 tasks.md,将任务 5.1 的状态改为 [x]

**_Leverage**:
- 参考 design.md 第 3.3.1 节

**_Requirements**:
- FR-2.3.1: 人性化处理

**约束**:
- 必须模拟 800-1200ms 延迟
- 转换逻辑简单但有区分度
- 代码可扩展,便于未来集成真实模型

**验收标准**:
- ✅ 延迟时间符合要求
- ✅ 不同参数返回不同结果
- ✅ 单元测试通过
```

---

### - [ ] 任务 5.2: 实现文档解析服务
**文件**:
- `web/backend/app/services/document_parser.py`

**需求引用**: FR-2.1.2

**描述**:
创建文档解析服务 (PDF/DOCX/PPT/TXT)

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通文档处理的 Python 工程师。

**任务**: 实现文档解析服务

**上下文**:
- 支持 PDF, DOCX, PPTX, TXT
- 提取纯文本内容
- 处理异常情况

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 5.2 的状态改为 [-]
2. 创建 app/services/document_parser.py
3. 实现 DocumentParserService 类
4. 实现 parse_pdf 方法
5. 实现 parse_docx 方法
6. 实现 parse_pptx 方法
7. 实现 parse_txt 方法
8. 实现 parse 统一入口方法
9. 添加错误处理
10. 编写单元测试
11. 在任务完成后,编辑 tasks.md,将任务 5.2 的状态改为 [x]

**_Leverage**:
- 使用 PyPDF2/pdfplumber
- 使用 python-docx
- 使用 python-pptx
- 参考 design.md 第 3.3.2 节

**_Requirements**:
- FR-2.1.2: 文档上传

**约束**:
- 处理编码问题
- 限制解析时间
- 优雅处理错误

**验收标准**:
- ✅ 所有格式都能正确解析
- ✅ 错误处理完善
- ✅ 单元测试通过
```

---

### - [ ] 任务 5.3: 实现人性化 API 路由
**文件**:
- `web/backend/app/api/humanize.py`

**需求引用**: FR-2.3.1

**描述**:
创建 FastAPI 路由,连接服务层

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 FastAPI 的后端工程师。

**任务**: 实现人性化处理 API 端点

**上下文**:
- POST /api/v1/humanize
- 接收 HumanizeRequest
- 返回 HumanizeResponse
- 调用 TextProcessorService

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 5.3 的状态改为 [-]
2. 创建 app/api/humanize.py
3. 创建 APIRouter
4. 实现 /humanize 端点
5. 集成 TextProcessorService
6. 添加错误处理
7. 添加日志记录
8. 在 main.py 中注册路由
9. 编写 API 测试
10. 在任务完成后,编辑 tasks.md,将任务 5.3 的状态改为 [x]

**_Leverage**:
- 使用 app/services/text_processor.py
- 使用 app/models/schemas.py
- 参考 design.md 第 3.4 节

**_Requirements**:
- FR-2.3.1: 人性化处理

**约束**:
- 使用 Pydantic 模型验证
- 返回标准 HTTP 状态码
- 提供清晰的错误信息

**验收标准**:
- ✅ API 端点正常工作
- ✅ 请求验证正确
- ✅ 错误处理完善
- ✅ API 文档生成正确
```

---

## 第六阶段: 前端 API 集成

### - [ ] 任务 6.1: 实现 API 调用层
**文件**:
- `web/frontend/lib/api.ts`

**需求引用**: FR-2.3.1

**描述**:
创建前端 API 调用工具函数

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通前端 API 集成的工程师。

**任务**: 实现 API 调用层

**上下文**:
- 调用后端 /api/v1/humanize
- 类型安全
- 错误处理

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 6.1 的状态改为 [-]
2. 创建 lib/api.ts
3. 定义 HumanizeRequest 和 HumanizeResponse 接口
4. 实现 humanizeText 函数
5. 添加错误处理
6. 添加请求超时
7. 编写单元测试
8. 在任务完成后,编辑 tasks.md,将任务 6.1 的状态改为 [x]

**_Leverage**:
- 使用 types/index.ts
- 参考 design.md 第 2.3.2 节

**_Requirements**:
- FR-2.3.1: 人性化处理

**约束**:
- 必须类型安全
- 处理网络错误
- 支持取消请求

**验收标准**:
- ✅ API 调用正常
- ✅ 类型定义准确
- ✅ 错误处理完善
```

---

### - [ ] 任务 6.2: 实现 useHumanize Hook
**文件**:
- `web/frontend/hooks/useHumanize.ts`

**需求引用**: FR-2.3.1

**描述**:
创建人性化处理自定义 Hook

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React Hooks 和状态管理的前端工程师。

**任务**: 实现 useHumanize Hook

**上下文**:
- 处理表单提交
- 管理加载状态
- 处理文档解析
- 错误提示

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 6.2 的状态改为 [-]
2. 创建 hooks/useHumanize.ts
3. 管理 isLoading, error, result 状态
4. 实现 mutate 函数
5. 处理文档解析 (FileReader)
6. 调用 API
7. 集成 toast 提示
8. 编写单元测试
9. 在任务完成后,编辑 tasks.md,将任务 6.2 的状态改为 [x]

**_Leverage**:
- 使用 lib/api.ts
- 使用 shadcn/ui toast
- 参考 design.md 第 2.3.3 节

**_Requirements**:
- FR-2.3.1: 人性化处理

**约束**:
- 文档内容超过 5000 字符自动截断
- 显示友好的错误提示
- 清理副作用

**验收标准**:
- ✅ 状态管理正确
- ✅ 文档解析成功
- ✅ 错误提示友好
- ✅ 无内存泄漏
```

---

## 第七阶段: 输出与交互

### - [ ] 任务 7.1: 实现输出面板组件
**文件**:
- `web/frontend/components/OutputPanel.tsx`

**需求引用**: FR-2.3.2, FR-2.3.3, FR-2.3.4, FR-2.3.5

**描述**:
创建输出面板,显示结果和操作按钮

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React 和用户体验的前端工程师。

**任务**: 实现输出面板组件

**上下文**:
- 显示重写结果
- 提供复制、下载、重新生成功能
- 加载状态 (skeleton)
- 错误状态

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 7.1 的状态改为 [-]
2. 创建 components/OutputPanel.tsx
3. 使用 Card 布局
4. 显示结果文本 (可滚动)
5. 显示字符数
6. 实现复制按钮 (使用 Clipboard API)
7. 实现下载按钮 (生成 .txt 文件)
8. 实现重新生成按钮
9. 加载状态显示 skeleton
10. 错误状态显示提示
11. 在任务完成后,编辑 tasks.md,将任务 7.1 的状态改为 [x]

**_Leverage**:
- 使用 shadcn/ui Card, Button
- 使用 lucide-react 图标

**_Requirements**:
- FR-2.3.2: 结果展示
- FR-2.3.3: 复制功能
- FR-2.3.4: 下载功能
- FR-2.3.5: 重新生成功能

**约束**:
- 文件名格式: humanized_text_YYYYMMDD_HHMMSS.txt
- 复制成功显示 toast
- 支持键盘快捷键 (Ctrl+C)

**验收标准**:
- ✅ 结果显示正常
- ✅ 复制功能正常
- ✅ 下载功能正常
- ✅ 重新生成正常
- ✅ 加载状态清晰
```

---

### - [ ] 任务 7.2: 实现微调器组件
**文件**:
- `web/frontend/components/FineTuner.tsx`

**需求引用**: FR-2.3.2

**描述**:
创建微调器,前端调整输出参数

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通交互设计的前端工程师。

**任务**: 实现微调器组件 (仅前端模拟)

**上下文**:
- 语气滑块: Formal ↔ Casual
- 句长滑块: Short ↔ Long
- 复杂度滑块: Simple ↔ Complex
- 调整后实时更新显示

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 7.2 的状态改为 [-]
2. 创建 components/FineTuner.tsx
3. 使用 Card 布局
4. 实现三个滑块 (使用 Slider)
5. 滑块变化时触发回调
6. 前端模拟文本调整效果
7. 显示当前参数值
8. 在任务完成后,编辑 tasks.md,将任务 7.2 的状态改为 [x]

**_Leverage**:
- 使用 shadcn/ui Card, Slider

**_Requirements**:
- FR-2.3.2: 结果展示

**约束**:
- 仅前端模拟,不调用 API
- 调整效果明显但简单
- 实时响应

**验收标准**:
- ✅ 滑块交互正常
- ✅ 参数值显示正确
- ✅ 视觉效果友好
```

---

### - [ ] 任务 7.3: 实现清空功能
**文件**:
- `web/frontend/components/ActionButtons.tsx`

**需求引用**: FR-2.3.6

**描述**:
创建操作按钮组 (Humanize + Clear)

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通表单处理的前端工程师。

**任务**: 实现操作按钮组

**上下文**:
- Humanize 按钮 (主按钮)
- Clear 按钮 (次按钮)
- 按钮状态管理

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 7.3 的状态改为 [-]
2. 创建 components/ActionButtons.tsx
3. 实现 Humanize 按钮
4. 实现 Clear 按钮
5. 验证失败时禁用 Humanize
6. 加载时显示 spinner
7. Clear 重置所有状态
8. 添加键盘支持 (Enter 提交)
9. 在任务完成后,编辑 tasks.md,将任务 7.3 的状态改为 [x]

**_Leverage**:
- 使用 shadcn/ui Button
- 使用 React Hook Form

**_Requirements**:
- FR-2.3.6: 清空功能

**约束**:
- Clear 需要确认对话框 (如果有内容)
- 按钮状态反映表单状态
- 提供视觉反馈

**验收标准**:
- ✅ 按钮状态正确
- ✅ Clear 功能正常
- ✅ 键盘支持完善
```

---

## 第八阶段: 历史记录

### - [ ] 任务 8.1: 实现 LocalStorage 管理
**文件**:
- `web/frontend/lib/storage.ts`

**需求引用**: FR-2.4.1

**描述**:
创建 LocalStorage 工具函数

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通浏览器 API 的前端工程师。

**任务**: 实现 LocalStorage 管理工具

**上下文**:
- 保存历史记录 (最多 3 条)
- 类型安全
- 错误处理

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 8.1 的状态改为 [-]
2. 创建 lib/storage.ts
3. 定义 HistoryItem 类型
4. 实现 getHistory 函数
5. 实现 saveHistory 函数
6. 实现 addHistoryItem 函数 (保持最多 3 条)
7. 实现 clearHistory 函数
8. 添加错误处理
9. 编写单元测试
10. 在任务完成后,编辑 tasks.md,将任务 8.1 的状态改为 [x]

**_Leverage**:
- 使用 types/index.ts

**_Requirements**:
- FR-2.4.1: 历史记录显示

**约束**:
- 处理 JSON 解析错误
- 处理 quota 超限
- 数据结构版本控制

**验收标准**:
- ✅ 读写功能正常
- ✅ 最多保存 3 条
- ✅ 错误处理完善
```

---

### - [ ] 任务 8.2: 实现 useHistory Hook
**文件**:
- `web/frontend/hooks/useHistory.ts`

**需求引用**: FR-2.4.1, FR-2.4.2

**描述**:
创建历史记录管理 Hook

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React 状态管理的前端工程师。

**任务**: 实现历史记录 Hook

**上下文**:
- 加载历史记录
- 添加新记录
- 回填记录

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 8.2 的状态改为 [-]
2. 创建 hooks/useHistory.ts
3. 管理 history 状态
4. 实现 addToHistory 函数
5. 实现 loadHistory 函数
6. 同步 LocalStorage
7. 编写单元测试
8. 在任务完成后,编辑 tasks.md,将任务 8.2 的状态改为 [x]

**_Leverage**:
- 使用 lib/storage.ts
- 参考 design.md 第 2.3.3 节

**_Requirements**:
- FR-2.4.1: 历史记录显示
- FR-2.4.2: 历史记录回填

**约束**:
- 组件卸载时清理
- 防止重复添加
- 性能优化

**验收标准**:
- ✅ 历史记录同步正确
- ✅ 添加功能正常
- ✅ 无内存泄漏
```

---

### - [ ] 任务 8.3: 实现历史记录组件
**文件**:
- `web/frontend/components/HistoryRail.tsx`

**需求引用**: FR-2.4.1, FR-2.4.2

**描述**:
创建历史记录显示组件

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 UI 组件的前端工程师。

**任务**: 实现历史记录组件

**上下文**:
- 显示最近 3 条
- 点击回填
- 卡片布局

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 8.3 的状态改为 [-]
2. 创建 components/HistoryRail.tsx
3. 使用 Card 布局
4. 显示预览文本 (前 100 字)
5. 显示参数摘要
6. 显示时间戳 (格式化)
7. 点击回填功能
8. 空状态显示
9. 响应式布局
10. 在任务完成后,编辑 tasks.md,将任务 8.3 的状态改为 [x]

**_Leverage**:
- 使用 shadcn/ui Card
- 使用 hooks/useHistory.ts

**_Requirements**:
- FR-2.4.1: 历史记录显示
- FR-2.4.2: 历史记录回填

**约束**:
- 时间格式: MM/DD/YYYY
- 预览最多 100 字
- 移动端单栏,桌面端三栏

**验收标准**:
- ✅ 历史记录显示正确
- ✅ 点击回填正常
- ✅ 响应式布局正常
- ✅ 空状态友好
```

---

## 第九阶段: 页面组装

### - [ ] 任务 9.1: 实现主页组件
**文件**:
- `web/frontend/app/page.tsx`

**需求引用**: 所有功能需求

**描述**:
组装所有组件,实现完整页面

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 Next.js 和页面架构的全栈工程师。

**任务**: 组装主页,集成所有组件

**上下文**:
- 集成所有已完成的组件
- 管理全局状态
- 实现完整交互流程

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 9.1 的状态改为 [-]
2. 编辑 app/page.tsx
3. 引入所有组件
4. 使用 React Hook Form 管理表单
5. 集成 useHumanize Hook
6. 集成 useHistory Hook
7. 实现组件间数据流
8. 添加页面标题和副标题
9. 添加免责声明 Tooltip
10. 测试完整流程
11. 在任务完成后,编辑 tasks.md,将任务 9.1 的状态改为 [x]

**_Leverage**:
- 所有已完成的组件
- 所有已完成的 Hooks
- schemas/humanize.ts

**_Requirements**:
- 所有功能需求

**约束**:
- 遵循需求文档的 UI 结构
- 保持组件解耦
- 优化性能

**验收标准**:
- ✅ 所有组件正常显示
- ✅ 完整流程可用
- ✅ 无控制台错误
- ✅ 性能良好
```

---

### - [ ] 任务 9.2: 实现页面布局和样式
**文件**:
- `web/frontend/app/layout.tsx`
- `web/frontend/app/globals.css`

**需求引用**: NFR-3.2.2

**描述**:
配置页面布局、全局样式、字体

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 CSS 和布局设计的前端工程师。

**任务**: 实现页面布局和全局样式

**上下文**:
- 配置 Inter 字体
- 设置全局样式
- 响应式布局
- 深色模式支持 (可选)

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 9.2 的状态改为 [-]
2. 编辑 app/layout.tsx
3. 配置 Inter 字体 (next/font/google)
4. 添加 SEO 元信息
5. 编辑 app/globals.css
6. 添加全局样式
7. 配置 Tailwind 基础层
8. 测试不同屏幕尺寸
9. 在任务完成后,编辑 tasks.md,将任务 9.2 的状态改为 [x]

**_Leverage**:
- Next.js Font Optimization
- Tailwind CSS

**_Requirements**:
- NFR-3.2.2: 响应式设计

**约束**:
- 移动优先
- 支持 dark mode (可选)
- 符合 WCAG AA 对比度

**验收标准**:
- ✅ 字体加载正常
- ✅ SEO 元信息完整
- ✅ 响应式布局正常
- ✅ 对比度符合标准
```

---

### - [ ] 任务 9.3: 添加页脚组件
**文件**:
- `web/frontend/components/Footer.tsx`

**需求引用**: 需求文档第 7 节

**描述**:
创建页脚,显示免责声明和链接

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 React 组件的前端工程师。

**任务**: 实现页脚组件

**上下文**:
- 显示免责声明
- 显示相关链接
- 简洁设计

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 9.3 的状态改为 [-]
2. 创建 components/Footer.tsx
3. 显示免责声明文本
4. 添加相关链接 (如有)
5. 响应式布局
6. 在 app/page.tsx 中引入
7. 在任务完成后,编辑 tasks.md,将任务 9.3 的状态改为 [x]

**_Requirements**:
- 需求文档第 7 节: 免责声明

**约束**:
- 文本清晰易读
- 链接在新窗口打开
- 底部固定或内容下方

**验收标准**:
- ✅ 免责声明显示正确
- ✅ 链接功能正常
- ✅ 布局美观
```

---

## 第十阶段: 测试与优化

### - [ ] 任务 10.1: 编写前端单元测试
**文件**:
- `web/frontend/tests/unit/*.test.ts`
- `web/frontend/vitest.config.ts`

**需求引用**: NFR-3.5.1

**描述**:
为关键函数和组件编写单元测试

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通测试的前端工程师。

**任务**: 编写单元测试

**上下文**:
- 测试 Zod schemas
- 测试 Hooks
- 测试工具函数
- 使用 vitest

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 10.1 的状态改为 [-]
2. 配置 vitest.config.ts
3. 测试 schemas/humanize.ts
4. 测试 hooks/useCharCount.ts
5. 测试 lib/api.ts
6. 测试 lib/storage.ts
7. 确保覆盖率 > 70%
8. 在任务完成后,编辑 tasks.md,将任务 10.1 的状态改为 [x]

**_Leverage**:
- vitest
- @testing-library/react

**_Requirements**:
- NFR-3.5.1: 代码质量

**约束**:
- 关键路径必须测试
- 边界情况必须覆盖
- 测试可读性强

**验收标准**:
- ✅ pnpm test 通过
- ✅ 覆盖率 > 70%
- ✅ 测试用例清晰
```

---

### - [ ] 任务 10.2: 编写后端测试
**文件**:
- `web/backend/tests/*.py`

**需求引用**: NFR-3.5.1

**描述**:
为 API 和服务编写测试

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 Python 测试的后端工程师。

**任务**: 编写后端测试

**上下文**:
- 测试 API 端点
- 测试服务层
- 使用 pytest

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 10.2 的状态改为 [-]
2. 完善 tests/test_api.py
3. 完善 tests/test_services.py
4. 测试成功场景
5. 测试失败场景
6. 测试边界情况
7. 确保覆盖率 > 80%
8. 在任务完成后,编辑 tasks.md,将任务 10.2 的状态改为 [x]

**_Leverage**:
- pytest
- FastAPI TestClient

**_Requirements**:
- NFR-3.5.1: 代码质量

**约束**:
- 使用 fixtures
- 隔离测试
- 快速执行

**验收标准**:
- ✅ pytest 通过
- ✅ 覆盖率 > 80%
- ✅ 测试独立可靠
```

---

### - [ ] 任务 10.3: 响应式优化
**文件**:
- `web/frontend/components/*.tsx`

**需求引用**: NFR-3.2.2

**描述**:
优化移动端和平板端体验

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通响应式设计的前端工程师。

**任务**: 优化响应式布局

**上下文**:
- 移动端 < 768px
- 平板端 768-1023px
- 桌面端 ≥ 1024px

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 10.3 的状态改为 [-]
2. 检查所有组件的响应式
3. 参数栏移动端使用 Drawer
4. 输出区移动端单栏
5. 历史记录移动端单栏
6. 调整字体大小和间距
7. 测试不同设备
8. 在任务完成后,编辑 tasks.md,将任务 10.3 的状态改为 [x]

**_Requirements**:
- NFR-3.2.2: 响应式设计

**约束**:
- 移动优先
- 触摸友好
- 性能优化

**验收标准**:
- ✅ 移动端布局正常
- ✅ 平板端布局正常
- ✅ 桌面端布局正常
- ✅ 触摸操作流畅
```

---

### - [ ] 任务 10.4: 无障碍性优化
**文件**:
- `web/frontend/components/*.tsx`

**需求引用**: NFR-3.2.1

**描述**:
优化无障碍性,符合 WCAG AA 标准

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通无障碍性的前端工程师。

**任务**: 优化无障碍性

**上下文**:
- 符合 WCAG AA 标准
- 键盘导航
- 屏幕阅读器支持

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 10.4 的状态改为 [-]
2. 检查所有交互元素的 aria 属性
3. 确保所有表单有 label
4. 添加 role 属性
5. 优化 Tab 顺序
6. 添加焦点样式
7. 使用 Lighthouse 检测
8. 修复问题
9. 在任务完成后,编辑 tasks.md,将任务 10.4 的状态改为 [x]

**_Requirements**:
- NFR-3.2.1: 无障碍性

**约束**:
- 对比度 ≥ 4.5:1
- 所有功能键盘可达
- 语义化 HTML

**验收标准**:
- ✅ Lighthouse 无障碍性 ≥ 90
- ✅ 键盘导航完整
- ✅ 屏幕阅读器友好
```

---

### - [ ] 任务 10.5: 性能优化
**文件**:
- `web/frontend/**/*.tsx`
- `web/frontend/next.config.js`

**需求引用**: NFR-3.1.1

**描述**:
优化前端性能,提升加载和交互速度

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通性能优化的前端工程师。

**任务**: 优化前端性能

**上下文**:
- 减少包体积
- 优化渲染
- 改善 Web Vitals

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 10.5 的状态改为 [-]
2. 使用 React.memo 优化组件
3. 使用 useMemo 和 useCallback
4. 懒加载非关键组件
5. 优化图片和字体
6. 配置 next.config.js
7. 使用 Lighthouse 测试
8. 优化到目标指标
9. 在任务完成后,编辑 tasks.md,将任务 10.5 的状态改为 [x]

**_Requirements**:
- NFR-3.1.1: 响应时间

**约束**:
- FCP < 1.8s
- LCP < 2.5s
- TTI < 3.8s

**验收标准**:
- ✅ Lighthouse Performance ≥ 90
- ✅ 包体积合理
- ✅ 交互响应快
```

---

## 第十一阶段: 文档与部署

### - [ ] 任务 11.1: 编写前端 README
**文件**:
- `web/frontend/README.md`

**需求引用**: NFR-3.5.2

**描述**:
编写前端项目文档

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通技术写作的工程师。

**任务**: 编写前端 README

**上下文**:
- 项目介绍
- 安装步骤
- 运行命令
- 项目结构
- 技术栈

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 11.1 的状态改为 [-]
2. 创建 web/frontend/README.md
3. 项目介绍
4. 功能特性
5. 技术栈
6. 安装步骤
7. 开发命令
8. 项目结构
9. 环境变量
10. 部署指南
11. 在任务完成后,编辑 tasks.md,将任务 11.1 的状态改为 [x]

**_Requirements**:
- NFR-3.5.2: 文档要求

**约束**:
- 清晰易懂
- 包含示例
- 保持更新

**验收标准**:
- ✅ 文档完整
- ✅ 步骤清晰
- ✅ 格式规范
```

---

### - [ ] 任务 11.2: 编写后端 README
**文件**:
- `web/backend/README.md`

**需求引用**: NFR-3.5.2

**描述**:
编写后端项目文档

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 API 文档的工程师。

**任务**: 编写后端 README

**上下文**:
- API 文档
- 安装步骤
- 运行命令
- 项目结构

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 11.2 的状态改为 [-]
2. 创建 web/backend/README.md
3. 项目介绍
4. API 端点说明
5. 数据模型
6. 安装步骤
7. 运行命令
8. 测试命令
9. 部署指南
10. 在任务完成后,编辑 tasks.md,将任务 11.2 的状态改为 [x]

**_Requirements**:
- NFR-3.5.2: 文档要求

**约束**:
- API 文档详细
- 包含请求示例
- 错误码说明

**验收标准**:
- ✅ 文档完整
- ✅ API 说明清晰
- ✅ 示例准确
```

---

### - [ ] 任务 11.3: 配置部署环境
**文件**:
- `web/frontend/.env.example`
- `web/backend/.env.example`
- `web/docker-compose.yml` (可选)

**需求引用**: 设计文档第 9 节

**描述**:
配置生产环境部署

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位精通 DevOps 的全栈工程师。

**任务**: 配置部署环境

**上下文**:
- 环境变量配置
- Docker 配置 (可选)
- 部署脚本

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 11.3 的状态改为 [-]
2. 创建前端 .env.example
3. 创建后端 .env.example
4. (可选) 创建 Dockerfile
5. (可选) 创建 docker-compose.yml
6. 验证构建
7. 编写部署文档
8. 在任务完成后,编辑 tasks.md,将任务 11.3 的状态改为 [x]

**_Leverage**:
- 参考 design.md 第 9 节

**约束**:
- 敏感信息使用环境变量
- 生产配置优化
- 健康检查端点

**验收标准**:
- ✅ 环境变量配置完整
- ✅ 构建成功
- ✅ 部署文档清晰
```

---

### - [ ] 任务 11.4: 最终验收测试
**文件**:
- 所有文件

**需求引用**: 需求文档第 8 节 DoD

**描述**:
执行最终验收测试,确保所有需求满足

**_Prompt**:
```
实现 spec ai-text-humanizer 的任务,首先运行 spec-workflow-guide 获取工作流指南,然后实现任务:

**角色**: 你是一位资深的 QA 工程师。

**任务**: 执行最终验收测试

**上下文**:
- 验证所有功能需求
- 验证所有非功能需求
- 验证 DoD 清单

**步骤**:
1. 在任务开始前,编辑 tasks.md,将任务 11.4 的状态改为 [-]
2. 测试文本输入流程
3. 测试文档上传流程
4. 测试所有参数组合
5. 测试输出功能 (复制/下载/重新生成)
6. 测试历史记录
7. 测试响应式布局
8. 测试无障碍性
9. 执行构建测试
10. 执行单元测试
11. 记录问题并修复
12. 在任务完成后,编辑 tasks.md,将任务 11.4 的状态改为 [x]

**_Requirements**:
- 需求文档第 8 节: 验收标准

**约束**:
- 所有 DoD 项目必须通过
- 关键路径无阻塞问题
- 性能达标

**验收标准**:
- ✅ 所有功能正常
- ✅ pnpm build 成功
- ✅ pnpm test 成功
- ✅ 无 ESLint 错误
- ✅ 移动端正常
- ✅ 无障碍性达标
```

---

## 任务统计

**总任务数**: 40 个任务

**预计时间**:
- 第一阶段 (初始化): 3 任务, ~4 小时
- 第二阶段 (数据模型): 2 任务, ~2 小时
- 第三阶段 (输入管理): 3 任务, ~6 小时
- 第四阶段 (参数控制): 1 任务, ~3 小时
- 第五阶段 (后端服务): 3 任务, ~6 小时
- 第六阶段 (前端 API): 2 任务, ~4 小时
- 第七阶段 (输出交互): 3 任务, ~6 小时
- 第八阶段 (历史记录): 3 任务, ~4 小时
- 第九阶段 (页面组装): 3 任务, ~4 小时
- 第十阶段 (测试优化): 5 任务, ~8 小时
- 第十一阶段 (文档部署): 4 任务, ~4 小时

**总预计时间**: ~51 小时

---

**文档版本**: 1.0  
**创建日期**: 2025-10-22  
**最后更新**: 2025-10-22  
**状态**: 待审核

