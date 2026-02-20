import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@mui/material';

const CameraCapture = ({ label, onCapture, nextStep }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      onCapture(blob);
      setCaptured(true);
      if (nextStep) nextStep(); // Trigger next step in parent
    }, 'image/jpeg');
  };

  return (
    <div>
      <h4>{label}</h4>
      <video ref={videoRef} autoPlay style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!captured && (
        <Button variant="contained" color="primary" onClick={handleCapture} sx={{ mt: 1 }}>
          Capture Photo
        </Button>
      )}
      {captured && <p>Photo captured!</p>}
    </div>
  );
};

export default CameraCapture;
