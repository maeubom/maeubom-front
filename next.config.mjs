/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/v1/api/:path*', // 프론트엔드에서 요청할 경로
        destination: 'http://localhost:8000/v1/api/:path*', // 백엔드의 실제 경로
      },
    ];
  },
};

export default nextConfig;

