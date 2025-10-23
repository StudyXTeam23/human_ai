/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // API 代理配置 (仅开发环境)
  async rewrites() {
    // 生产环境使用环境变量中的 API URL
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    // 开发环境代理到本地后端
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.52.175.51:18201/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
