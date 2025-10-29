/**
 * Frontend global configuration file
 * Centralized management of all environment-related configurations
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  /**
   * Backend API base URL
   * 
   * Configuration priority:
   * 1. Environment variable NEXT_PUBLIC_API_URL
   * 2. Default value (automatically selected based on environment)
   * 
   * How to modify:
   * - Development: Modify DEFAULT_LOCAL_URL
   * - Production: Set NEXT_PUBLIC_API_URL in .env.production
   */
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 
           (process.env.NODE_ENV === 'production' 
             ? 'https://api.yourdomain.com'  // Production environment default domain (needs modification)
             : 'http://localhost:18201'),    // Development environment default local address
  
  /**
   * API endpoint paths
   */
  ENDPOINTS: {
    HEALTH: '/health',
    HUMANIZE: '/api/v1/humanize',
    HUMANIZE_FILE: '/api/v1/humanize-file',
    UPLOAD: '/api/v1/upload',
  },
  
  /**
   * Request timeout setting (milliseconds)
   */
  TIMEOUT: 120000, // 2 minutes
} as const;

/**
 * Application configuration
 */
export const APP_CONFIG = {
  /**
   * Application name
   */
  NAME: 'AI Text Humanizer',
  
  /**
   * Application version
   */
  VERSION: '1.0.0',
  
  /**
   * File upload configuration
   */
  FILE_UPLOAD: {
    MAX_SIZE: 40 * 1024 * 1024, // 40MB
    ALLOWED_TYPES: ['.pdf', '.docx', '.pptx', '.txt'],
  },
  
  /**
   * Text input configuration
   */
  TEXT_INPUT: {
    MIN_LENGTH: 300,
    MAX_LENGTH: 5000,
  },
} as const;

/**
 * Export quick access to commonly used configurations
 */
export const API_BASE_URL = API_CONFIG.BASE_URL;
export const API_ENDPOINTS = API_CONFIG.ENDPOINTS;

/**
 * Get complete API URL
 */
export function getApiUrl(endpoint: keyof typeof API_CONFIG.ENDPOINTS): string {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint]}`;
}

/**
 * Get custom API URL
 */
export function getCustomApiUrl(path: string): string {
  return `${API_CONFIG.BASE_URL}${path}`;
}

