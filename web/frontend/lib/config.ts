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
   * 1. Environment variable NEXT_PUBLIC_API_URL (but will use relative path if HTTP in HTTPS context)
   * 2. Default value (automatically selected based on environment)
   * 
   * Note: In Vercel/production HTTPS environments, always use relative paths
   * to avoid mixed content errors. The vercel.json rewrites will proxy to backend.
   */
  BASE_URL: (() => {
    // Check if we're in a production HTTPS environment (like Vercel)
    const isVercel = process.env.VERCEL === '1';
    const isProduction = process.env.NODE_ENV === 'production';
    
    // In Vercel/production, use relative path (empty string) to allow rewrites
    if (isVercel || (isProduction && typeof window !== 'undefined' && window.location.protocol === 'https:')) {
      return '';
    }
    
    // Otherwise use environment variable or default
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
      // Even if env var is set, check if it's HTTP in HTTPS context
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && envUrl.startsWith('http://')) {
        return '';
      }
      return envUrl;
    }
    
    // Default: localhost for development
    return 'http://localhost:18201';
  })(),
  
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
  // Always use relative path in HTTPS environments to avoid mixed content
  let base = API_CONFIG.BASE_URL || "";
  
  // Double-check: if we're in browser and page is HTTPS, force relative path
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    // Remove any HTTP URL to use relative path (Vercel rewrites will handle it)
    if (base.startsWith("http://")) {
      base = "";
    }
  }
  
  return `${base}${API_CONFIG.ENDPOINTS[endpoint]}`;
}

/**
 * Get custom API URL
 */
export function getCustomApiUrl(path: string): string {
  // Same logic as getApiUrl to avoid mixed content
  let base = API_CONFIG.BASE_URL || "";
  
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    if (base.startsWith("http://")) {
      base = "";
    }
  }
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

