import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import {
  Camera,
  RefreshCw,
  Camera as CameraIcon,
  Power,
  Clock,
  Smartphone,
} from "lucide-react";

const CameraComponent = ({ onCapture, isLoading, darkMode }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [autoCapture, setAutoCapture] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const webcamRef = useRef(null);
  const autoCaptureTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Get available camera devices
  const handleDevices = useCallback(
    (mediaDevices) => {
      const videoDevices = mediaDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      // Select a default device if available
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    },
    [selectedDeviceId]
  );

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then(handleDevices)
      .catch((err) => console.error("Error getting media devices:", err));

    return () => {
      if (autoCaptureTimerRef.current) {
        clearInterval(autoCaptureTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [handleDevices]);

  const toggleCamera = () => {
    if (isCameraOn) {
      // Turn off camera and clear auto-capture
      setIsCameraOn(false);
      setAutoCapture(false);
      if (autoCaptureTimerRef.current) {
        clearInterval(autoCaptureTimerRef.current);
        autoCaptureTimerRef.current = null;
      }
    } else {
      // Turn on camera
      setIsCameraOn(true);
    }
  };

  const startCountdown = () => {
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          captureImage();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    countdownTimerRef.current = timer;
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
      setCountdown(null);
    }
  }, [onCapture]);

  // Handle auto-capture
  useEffect(() => {
    if (autoCapture && isCameraOn) {
      // Initial capture
      captureImage();

      // Set up interval
      autoCaptureTimerRef.current = setInterval(() => {
        if (!isLoading) {
          captureImage();
        }
      }, 5000); // Capture every 5 seconds
    } else if (!autoCapture && autoCaptureTimerRef.current) {
      clearInterval(autoCaptureTimerRef.current);
      autoCaptureTimerRef.current = null;
    }

    return () => {
      if (autoCaptureTimerRef.current) {
        clearInterval(autoCaptureTimerRef.current);
      }
    };
  }, [autoCapture, isCameraOn, captureImage, isLoading]);

  const toggleAutoCapture = () => {
    setAutoCapture((prev) => !prev);
  };

  const videoConstraints = {
    width: 720,
    height: 480,
    facingMode: "environment",
    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              isCameraOn
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={toggleCamera}
            disabled={isLoading}
          >
            <Power className="h-4 w-4 mr-2" />
            {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
          </button>

          {isCameraOn && (
            <>
              <button
                className={`flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${
                  isLoading || countdown ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={startCountdown}
                disabled={isLoading || countdown !== null}
              >
                <Camera className="h-4 w-4 mr-2" />
                {isLoading ? "Processing..." : "Capture"}
              </button>

              <button
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  autoCapture
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={toggleAutoCapture}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    autoCapture ? "animate-spin" : ""
                  }`}
                />
                Auto-Capture {autoCapture ? "ON" : "OFF"}
              </button>
            </>
          )}
        </div>

        {devices.length > 1 && (
          <div className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <select
              className={`px-3 py-2 rounded-md border text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              disabled={isLoading}
            >
              {devices.map((device, key) => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label || `Camera ${key + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {isCameraOn && (
          <div
            className="relative rounded-lg overflow-hidden shadow-lg"
            style={{ height: "360px" }}
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-70 text-white text-5xl font-bold rounded-full w-20 h-20 flex items-center justify-center animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 animate-spin mb-2" />
                  <p>Processing...</p>
                </div>
              </div>
            )}

            {autoCapture && !isLoading && (
              <div className="absolute top-3 right-3">
                <div className="bg-yellow-500 text-xs text-white px-2 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Auto-Capture On
                </div>
              </div>
            )}
          </div>
        )}

        {!isCameraOn && !capturedImage && (
          <div
            className={`flex items-center justify-center rounded-lg border-2 border-dashed ${
              darkMode
                ? "border-gray-600 text-gray-400"
                : "border-gray-300 text-gray-500"
            }`}
            style={{ height: "360px" }}
          >
            <div className="text-center p-6">
              <CameraIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Camera is turned off</p>
              <p className="text-sm mt-2">Click "Turn On Camera" to start</p>
            </div>
          </div>
        )}

        {capturedImage && (
          <div
            className="relative rounded-lg overflow-hidden shadow-lg"
            style={{ height: "360px" }}
          >
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              Captured Image
            </div>
          </div>
        )}
      </div>

      {autoCapture && (
        <div
          className={`py-2 px-4 rounded text-sm ${
            darkMode
              ? "bg-gray-700 text-yellow-300"
              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
          }`}
        >
          <div className="flex items-start">
            <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <p>
              Auto-capture mode is enabled. Images will be automatically
              analyzed every 5 seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
