import React, { useState, useRef, useCallback } from 'react';
import { Video, Mic, Camera, StopCircle, Download } from 'lucide-react';

const SeparateMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const audioChunksRef = useRef([]);

  // 미디어 스트림 시작
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // 비디오와 오디오 트랙 분리
      const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
      const audioStream = new MediaStream([stream.getAudioTracks()[0]]);

      // 비디오 레코더 설정
      videoRecorderRef.current = new MediaRecorder(videoStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      // 오디오 레코더 설정
      audioRecorderRef.current = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      // 비디오 데이터 수집
      videoRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      // 오디오 데이터 수집
      audioRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      // 녹화 완료 시 처리
      videoRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        // todo: 바이너리 데이터를 서버로 전송

        setRecordedVideo(videoBlob);
      };

      audioRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // todo: 바이너리 데이터를 서버로 전송
        setRecordedAudio(audioBlob);

        // 서버로 오디오 파일 전송
        const formData = new FormData();
        formData.append('file', audioBlob);

        try {
          const response = await fetch('/v1/api/audio-to-text', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          console.log("변환된 텍스트:", data.text);

           // 요약 요청
          const summaryResponse = await fetch('/v1/api/text-summary', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: data.text }),
          });
          const summaryData = await summaryResponse.json();
          console.log("요약된 텍스트:", summaryData.summary);
        } catch (error) {
          console.error("오디오를 서버로 보내는 중 오류 발생:", error);
        }
      };

    } catch (err) {
      console.error("미디어 스트림 에러:", err);
    }
  };

  // 녹화 시작
  const startRecording = () => {
    videoChunksRef.current = [];
    audioChunksRef.current = [];
    
    videoRecorderRef.current?.start();
    audioRecorderRef.current?.start();
    setIsRecording(true);
  };

  // 녹화 중지
  const stopRecording = () => {
    videoRecorderRef.current?.stop();
    audioRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // 비디오 다운로드
  const downloadVideo = () => {
    if (recordedVideo) {
      const url = URL.createObjectURL(recordedVideo);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recorded-video-${new Date().getTime()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 오디오 다운로드
  const downloadAudio = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recorded-audio-${new Date().getTime()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // 컴포넌트 마운트 시 스트림 시작
  React.useEffect(() => {
    startStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative w-full max-w-2xl rounded-lg overflow-hidden bg-gray-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full"
        />
      </div>
      
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Camera className="w-5 h-5" />
            녹화 시작
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <StopCircle className="w-5 h-5" />
            녹화 중지
          </button>
        )}
        
        {recordedVideo && (
          <button
            onClick={downloadVideo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Video className="w-5 h-5" />
            비디오 다운로드
          </button>
        )}
        
        {recordedAudio && (
          <button
            onClick={downloadAudio}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Mic className="w-5 h-5" />
            오디오 다운로드
          </button>
        )}
      </div>

      {recordedVideo && (
        <div className="w-full max-w-2xl mt-4">
          <h3 className="text-lg font-semibold mb-2">녹화된 비디오:</h3>
          <video
            controls
            src={URL.createObjectURL(recordedVideo)}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {recordedAudio && (
        <div className="w-full max-w-2xl mt-4">
          <h3 className="text-lg font-semibold mb-2">녹화된 오디오:</h3>
          <audio
            controls
            src={URL.createObjectURL(recordedAudio)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default SeparateMediaRecorder;