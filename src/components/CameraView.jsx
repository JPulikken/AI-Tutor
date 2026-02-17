import React, { useRef, useEffect, useState } from 'react'

const CameraView = ({ isActive, onClose }) => {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (isActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isActive])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user', // Use front camera
          width: { ideal: 320 },
          height: { ideal: 240 }
        },
        audio: false
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch (err) {
      console.error('Camera error:', err)
      setError('Could not access camera. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  if (!isActive) return null

  return (
    <div className={`camera-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Camera Header */}
      <div className="camera-header" onClick={toggleMinimize}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📷</span>
          <span style={{ fontWeight: '600', fontSize: '14px' }}>
            {isMinimized ? '' : 'Camera'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              background: stream ? '#66BB6A' : '#EF5350',
              animation: stream ? 'pulse 2s infinite' : 'none'
            }}
          />
          <span style={{ fontSize: '12px', opacity: 0.8 }}>
            {stream ? 'Active' : 'Inactive'}
          </span>
          <button 
            className="btn btn-small"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            style={{ 
              padding: '4px 8px', 
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '12px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Camera Preview */}
      {!isMinimized && (
        <div className="camera-preview">
          {error ? (
            <div className="camera-error">
              <span style={{ fontSize: '32px', marginBottom: '8px' }}>😕</span>
              <p style={{ fontSize: '12px', color: '#fff', textAlign: 'center' }}>{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera-video"
              />
              {/* Fun overlay for kids */}
              <div className="camera-overlay">
                <span style={{ fontSize: '24px' }}>😊</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Minimize indicator */}
      {isMinimized && (
        <div className="camera-minimized-preview">
          <span style={{ fontSize: '20px' }}>📷</span>
        </div>
      )}

      <style jsx>{`
        .camera-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 280px;
          background: linear-gradient(135deg, #5B9BD5 0%, #9575CD 100%);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          z-index: 1000;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .camera-container.minimized {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }

        .camera-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(0,0,0,0.1);
          cursor: pointer;
        }

        .camera-preview {
          padding: 16px;
        }

        .camera-video {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          background: #2C3E50;
        }

        .camera-error {
          width: 100%;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
        }

        .camera-overlay {
          position: absolute;
          bottom: 24px;
          right: 32px;
          background: rgba(255,255,255,0.9);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          animation: bounce 2s infinite;
        }

        .camera-minimized-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #5B9BD5 0%, #9575CD 100%);
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default CameraView

