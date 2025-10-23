# 🔧 API 配置管理指南

## 📋 概述

前端项目已实现**集中式 API 配置管理**,所有接口地址统一在 `lib/config.ts` 中管理,方便统一修改和维护。

---

## 📂 文件结构

```
web/frontend/
├── lib/
│   ├── config.ts        # 🎯 全局配置文件 (核心)
│   └── api.ts           # API 调用函数
├── .env.local           # 开发环境变量 (可选)
├── .env.production      # 生产环境变量 (必需)
└── .env.example         # 环境变量示例
```

---

## 🎯 如何修改 API 地址

### 方式 1: 修改环境变量 (推荐) ⭐

#### 开发环境
```bash
# 创建 web/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:18201
```

#### 生产环境
```bash
# 创建 web/frontend/.env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**优势**: 不需要修改代码,只需修改环境变量文件

---

### 方式 2: 修改配置文件

编辑 `web/frontend/lib/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://api.yourdomain.com'  // 👈 修改这里 (生产环境)
             : 'http://localhost:18201'),    // 👈 或修改这里 (开发环境)
  // ...
}
```

---

## 📊 配置优先级

```
1. .env.production (生产环境)
   ↓ (如果未设置)
2. .env.local (开发环境)
   ↓ (如果未设置)
3. config.ts 中的默认值
```

---

## 🔍 当前配置

### 核心配置文件: `lib/config.ts`

```typescript
export const API_CONFIG = {
  // 后端 API 基础 URL (唯一需要修改的地方)
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://api.yourdomain.com'
             : 'http://localhost:18201'),
  
  // API 端点 (无需修改,只需修改 BASE_URL)
  ENDPOINTS: {
    HEALTH: '/health',
    HUMANIZE: '/api/v1/humanize',
    HUMANIZE_FILE: '/api/v1/humanize-file',
    UPLOAD: '/api/v1/upload',
  },
}
```

### 使用方式

#### 1. 直接使用 API_BASE_URL
```typescript
import { API_BASE_URL } from '@/lib/config';

fetch(`${API_BASE_URL}/api/v1/humanize`, { ... });
```

#### 2. 使用辅助函数 (推荐)
```typescript
import { getApiUrl } from '@/lib/config';

// 自动拼接完整 URL
fetch(getApiUrl('HUMANIZE'), { ... });
```

---

## 🚀 快速切换环境

### 场景 1: 本地开发 → 测试服务器

```bash
# 1. 创建 .env.local
echo "NEXT_PUBLIC_API_URL=http://test-server-ip:18201" > web/frontend/.env.local

# 2. 重启开发服务器
pnpm dev
```

### 场景 2: 测试 → 生产环境

```bash
# 1. 修改 .env.production
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" > web/frontend/.env.production

# 2. 重新构建
pnpm build

# 3. 启动
pnpm start
```

### 场景 3: 使用 IP 地址

```bash
# .env.production
NEXT_PUBLIC_API_URL=http://123.45.67.89:18201
```

---

## 📋 环境变量配置示例

### `.env.local` (开发环境)
```env
# 本地后端
NEXT_PUBLIC_API_URL=http://localhost:18201

# 或连接远程后端
# NEXT_PUBLIC_API_URL=http://192.168.1.100:18201
```

### `.env.production` (生产环境)
```env
# 生产域名
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# 或生产服务器 IP
# NEXT_PUBLIC_API_URL=http://123.45.67.89:18201
```

### `.env.example` (模板)
```env
# API URL (required)
# Development: http://localhost:18201
# Production: https://api.yourdomain.com
NEXT_PUBLIC_API_URL=http://localhost:18201
```

---

## 🔧 配置文件详解

### `lib/config.ts` 核心功能

#### 1. API_BASE_URL (全局 API 地址)
```typescript
export const API_BASE_URL = API_CONFIG.BASE_URL;
```

#### 2. getApiUrl (获取端点 URL)
```typescript
// 使用
getApiUrl('HUMANIZE')  // → http://localhost:18201/api/v1/humanize
getApiUrl('UPLOAD')    // → http://localhost:18201/api/v1/upload
```

#### 3. getCustomApiUrl (自定义路径)
```typescript
// 使用
getCustomApiUrl('/custom/endpoint')  // → http://localhost:18201/custom/endpoint
```

---

## 🧪 验证配置

### 1. 查看当前配置
```typescript
// 在浏览器控制台
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
```

### 2. 测试连接
```typescript
// 在浏览器控制台
fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`)
  .then(r => r.json())
  .then(console.log);
```

### 3. 检查网络请求
1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 执行一个操作 (如点击 Humanize)
4. 查看请求 URL

---

## 📝 最佳实践

### ✅ 推荐做法

1. **使用环境变量文件**
   ```bash
   # 创建 .env.production
   echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com" > .env.production
   ```

2. **不同环境使用不同配置**
   - 开发: `.env.local`
   - 生产: `.env.production`

3. **使用辅助函数**
   ```typescript
   import { getApiUrl } from '@/lib/config';
   fetch(getApiUrl('HUMANIZE'), { ... });
   ```

### ❌ 避免做法

1. **不要在代码中硬编码 URL**
   ```typescript
   // ❌ 错误
   fetch('http://localhost:18201/api/v1/humanize', { ... });
   
   // ✅ 正确
   fetch(getApiUrl('HUMANIZE'), { ... });
   ```

2. **不要在多个文件中重复定义**
   - 统一在 `lib/config.ts` 中管理

---

## 🔄 更新流程

### 修改 API 地址的完整流程

```bash
# 1. 修改环境变量
vim web/frontend/.env.production
# 或
echo "NEXT_PUBLIC_API_URL=https://new-api.com" > web/frontend/.env.production

# 2. 重新构建 (重要!)
cd web/frontend
pnpm build

# 3. 重启服务
pm2 restart ai-humanizer-web
# 或
pnpm start
```

⚠️ **重要**: 修改环境变量后必须重新构建,因为环境变量在构建时被注入到代码中。

---

## 🐛 常见问题

### Q1: 修改了环境变量但没生效?
**A**: 需要重新构建
```bash
pnpm build
pm2 restart ai-humanizer-web
```

### Q2: 开发环境想临时切换 API?
**A**: 创建 `.env.local` 文件
```bash
echo "NEXT_PUBLIC_API_URL=http://test-server:18201" > .env.local
pnpm dev
```

### Q3: 如何查看当前使用的 API URL?
**A**: 浏览器控制台
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL);
```

### Q4: 生产环境用 IP 还是域名?
**A**: 推荐使用域名,更灵活且支持 HTTPS
```env
# 推荐
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# 也可以用 IP (测试阶段)
NEXT_PUBLIC_API_URL=http://123.45.67.89:18201
```

---

## 📚 文件清单

### 已优化的文件

1. ✅ `lib/config.ts` - 全局配置中心 (新增)
2. ✅ `lib/api.ts` - 使用全局配置
3. ✅ `components/FileUpload.tsx` - 使用全局配置
4. ✅ `.env.example` - 环境变量示例

### 配置文件

- `lib/config.ts` - 核心配置
- `.env.local` - 开发环境 (可选)
- `.env.production` - 生产环境 (必需)
- `next.config.js` - Next.js 配置 (已配置代理)

---

## 🎯 快速参考

### 修改 API 地址只需 3 步:

```bash
# 1. 编辑环境变量
vim .env.production

# 2. 重新构建
pnpm build

# 3. 重启服务
pm2 restart ai-humanizer-web
```

### 常用配置:

| 环境 | 配置文件 | URL 示例 |
|------|----------|----------|
| 本地开发 | `.env.local` | `http://localhost:18201` |
| 测试服务器 | `.env.production` | `http://test-ip:18201` |
| 生产环境 | `.env.production` | `https://api.yourdomain.com` |

---

## ✅ 总结

✨ **现在修改 API 地址只需要:**

1. **编辑一个文件**: `.env.production`
2. **修改一行代码**: `NEXT_PUBLIC_API_URL=新地址`
3. **重新构建**: `pnpm build`

🎉 **无需在整个项目中搜索和替换!**

---

**相关文档**:
- 前端部署: `SIMPLE_FRONTEND_DEPLOY.md`
- 端口配置: `PORT_UPDATE_SUMMARY.txt`
- 完整指南: `DEPLOY_TO_LINUX.md`

