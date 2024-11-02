// src/pages/recorder.js

import React from 'react';
import SeparateMediaRecorder from '@/components/SeparateMediaRecorder';

function RecorderPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">감정 분석을 위한 녹화 시작</h1>
      <p className="text-lg text-gray-600 mb-8">나의 감정을 기록하고 분석하기 위한 영상을 녹화하세요.</p>
      
      {/* SeparateMediaRecorder 컴포넌트 */}
      <SeparateMediaRecorder />
    </div>
  );
}

export default RecorderPage;
