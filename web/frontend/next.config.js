/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // API proxy configuration (development environment only)
  async rewrites() {
    // Production environment uses API URL from environment variables
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    // Development environment proxies to local backend
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.52.175.51:18201/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
