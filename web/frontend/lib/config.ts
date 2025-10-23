/**
 * 前端全局配置文件
 * 集中管理所有环境相关的配置
 */

/**
 * API 配置
 */
export const API_CONFIG = {
  /**
   * 后端 API 基础 URL
   * 
   * 配置优先级:
   * 1. 环境变量 NEXT_PUBLIC_API_URL
   * 2. 默认值 (根据环境自动选择)
   * 
   * 修改方法:
   * - 开发环境: 修改 DEFAULT_LOCAL_URL
   * - 生产环境: 在 .env.production 中设置 NEXT_PUBLIC_API_URL
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://api.yourdomain.com'  // 生产环境默认域名 (需要修改)
             : 'http://localhost:18201'),    // 开发环境默认本地地址
  
  /**
   * API 端点路径
   */
  ENDPOINTS: {
    HEALTH: '/health',
    HUMANIZE: '/api/v1/humanize',
    HUMANIZE_FILE: '/api/v1/humanize-file',
    UPLOAD: '/api/v1/upload',
  },
  
  /**
   * 请求超时设置 (毫秒)
   */
  TIMEOUT: 120000, // 2 分钟
} as const;

/**
 * 应用配置
 */
export const APP_CONFIG = {
  /**
   * 应用名称
   */
  NAME: 'AI Text Humanizer',
  
  /**
   * 应用版本
   */
  VERSION: '1.0.0',
  
  /**
   * 文件上传配置
   */
  FILE_UPLOAD: {
    MAX_SIZE: 40 * 1024 * 1024, // 40MB
    ALLOWED_TYPES: ['.pdf', '.docx', '.pptx', '.txt'],
  },
  
  /**
   * 文本输入配置
   */
  TEXT_INPUT: {
    MIN_LENGTH: 300,
    MAX_LENGTH: 5000,
  },
} as const;

/**
 * 导出常用配置的快捷访问
 */
export const API_BASE_URL = API_CONFIG.BASE_URL;
export const API_ENDPOINTS = API_CONFIG.ENDPOINTS;

/**
 * 获取完整的 API URL
 */
export function getApiUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}

/**
 * 获取自定义 API URL
 */
export function getCustomApiUrl(path: string): string {
  return `${API_CONFIG.BASE_URL}${path}`;
}

