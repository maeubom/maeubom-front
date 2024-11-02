import React, { useEffect, useState } from 'react';
import { createSummary, generateImage, createMusicBinary, createText } from 'API.js'; // 필요한 API 불러오기
import Image from 'next/image';

const EmotionResultPage = ({ analysisResult }) => {
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [quote, setQuote] = useState('');

  // 감정 요약 생성
  const fetchSummary = async () => {
    try {
      const result = await createSummary(analysisResult);
      setSummary(result);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  // 이미지 생성
  const fetchImage = async () => {
    try {
      const url = await generateImage(analysisResult);
      setImageUrl(url);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  // 음악 생성
  const fetchMusic = async () => {
    try {
      const result = await createMusicBinary(analysisResult); // assuming this returns { file_name, file_url }
      setMusicUrl(result.file_url);
    } catch (error) {
      console.error('Error generating music:', error);
    }
  };

  // 명언 생성
  const fetchQuote = async () => {
    try {
      const result = await createText(analysisResult);
      setQuote(result.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  // API 요청을 한 번에 실행
  useEffect(() => {
    fetchSummary();
    fetchImage();
    fetchMusic();
    fetchQuote();
  }, [analysisResult]);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-semibold text-center mb-8">감정 분석 결과</h1>
      
      {/* 감정 분석 요약 */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">감정 요약 일기</h2>
        <p className="text-lg text-gray-700">{summary}</p>
      </div>
      
      {/* 이미지 생성 결과 */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">감정 기반 이미지</h2>
        {imageUrl && <Image src={imageUrl} alt="Generated Emotion Image" width={400} height={400} />}
      </div>

      {/* 음악 생성 결과 */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">감정 기반 음악</h2>
        {musicUrl && (
          <audio controls className="mx-auto">
            <source src={musicUrl} type="audio/mp3" />
          </audio>
        )}
      </div>

      {/* 명언 생성 결과 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">오늘의 명언</h2>
        <p className="text-lg text-gray-700">{quote}</p>
      </div>
    </div>
  );
};

export default EmotionResultPage;
