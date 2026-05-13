import React, { useEffect, useRef, useState } from "react";
import { loadFaceModels } from "../utils/faceModels";
import { emotionMeta, mapExpressionsToEmotion } from "../utils/emotionMapping";

const EmotionCamera = ({ onEmotionChange }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const faceapiRef = useRef(null);
  const onEmotionChangeRef = useRef(onEmotionChange);
  const currentEmotionRef = useRef("neutral");
  const [emotion, setEmotion] = useState("neutral");
  const [error, setError] = useState("");

  useEffect(() => {
    onEmotionChangeRef.current = onEmotionChange;
  }, [onEmotionChange]);

  useEffect(() => {
    let isMounted = true;

    const stopCamera = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const updateEmotion = (nextEmotion) => {
      if (currentEmotionRef.current === nextEmotion) return;

      currentEmotionRef.current = nextEmotion;
      setEmotion(nextEmotion);
      onEmotionChangeRef.current?.(nextEmotion);
    };

    const detectEmotion = async () => {
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
    };

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        faceapiRef.current = await loadFaceModels();

        if (!isMounted) return;

        timeoutRef.current = setTimeout(() => {
          intervalRef.current = setInterval(detectEmotion, 1000);
        }, 1000);
      } catch (err) {
        console.error("Emotion camera error:", err);
        if (isMounted) {
          setError("Camera access is unavailable");
        }
      }
    };

    init();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  return (
    <div className="emotion-camera">
      {error ? (
        <p className="emotion-camera-error">{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          width="300"
          height="200"
          className="emotion-camera-video"
        />
      )}
      <h2 className="emotion-camera-label">
        Emotion: {emotionMeta[emotion]?.emoji} {emotionMeta[emotion]?.label || "Neutral"}
      </h2>
    </div>
  );
};

export default EmotionCamera;
