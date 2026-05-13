import React, { useCallback, useEffect, useRef, useState } from "react";
import { loadFaceModels } from "../utils/faceModels";
import { emotionMeta, mapExpressionsToEmotion } from "../utils/emotionMapping";

const CameraView = ({ isActive, onClose, onEmotionChange }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectionInterval = useRef(null);
  const faceapiRef = useRef(null);
  const currentEmotionRef = useRef("neutral");
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [emotion, setEmotion] = useState("neutral");

  const stopCamera = useCallback(() => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const updateEmotion = useCallback((nextEmotion) => {
    if (currentEmotionRef.current === nextEmotion) return;

    currentEmotionRef.current = nextEmotion;
    setEmotion(nextEmotion);
    onEmotionChange?.(nextEmotion);
  }, [onEmotionChange]);

  const startDetection = useCallback(() => {
    if (detectionInterval.current) return;

    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current) return;
      const faceapi = faceapiRef.current;
      if (!faceapi) return;

      const detection = await faceapi
        .detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 320,
            scoreThreshold: 0.3,
          })
        )
        .withFaceExpressions();

      if (!detection) return;

      updateEmotion(mapExpressionsToEmotion(detection.expressions));
    }, 1000);
  }, [updateEmotion]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 320 },
          height: { ideal: 240 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      faceapiRef.current = await loadFaceModels();
      startDetection();
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access is unavailable");
      stopCamera();
    }
  }, [startDetection, stopCamera]);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return stopCamera;
  }, [isActive, startCamera, stopCamera]);

  if (!isActive) return null;

  return (
    <div className={`camera-container ${isMinimized ? "minimized" : ""}`}>
      <div className="camera-header" onClick={() => setIsMinimized((value) => !value)}>
        <span>Camera</span>
        <button
          className="camera-close"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          aria-label="Close camera"
        >
          x
        </button>
      </div>

      {!isMinimized && (
        <div className="camera-preview">
          {error ? (
            <p className="camera-error">{error}</p>
          ) : (
            <>
              <video ref={videoRef} autoPlay muted playsInline className="camera-video" />
              <div className="camera-overlay">
                <span className="camera-emotion-emoji">{emotionMeta[emotion]?.emoji || "😐"}</span>
                <span className="camera-emotion-label">{emotionMeta[emotion]?.label || "Neutral"}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraView;
