import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
  // CORS 설정을 실행
  await NextCors(req, res, {
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: '*',  // 모든 도메인을 허용하거나 특정 도메인(예: 'https://example.com')을 설정할 수 있습니다.
    optionsSuccessStatus: 200,
  });

  // API 핸들러의 나머지 코드
  res.json({ message: 'CORS enabled' });
}
