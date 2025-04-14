import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, Loader, AlertCircle } from "lucide-react";

const FileUpload = ({ onFileUpload, isLoading, darkMode }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadError(null);
      const file = acceptedFiles[0];

      if (!file) {
        return;
      }

      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File too large. Maximum size is 10MB.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file (JPEG, PNG, etc.)");
        return;
      }

      console.log(
        `Selected file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
      );

      setUploadedImage(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);

      // Pass the file to the parent component
      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    disabled: isLoading,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-6">
      {uploadError && (
        <div
          className={`p-3 rounded-md ${
            darkMode ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-800"
          } flex items-start`}
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{uploadError}</p>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors 
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : darkMode
              ? "border-gray-600 hover:border-gray-500 hover:bg-gray-700/30"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center">
          <Upload
            className={`h-12 w-12 mb-4 ${
              isDragActive
                ? "text-blue-500"
                : darkMode
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          />

          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Processing image...
              </p>
            </div>
          ) : isDragActive ? (
            <p className="font-medium text-blue-500">Drop the image here</p>
          ) : (
            <div>
              <p className="font-medium mb-1 dark:text-white">
                Drag & drop an image or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supported formats: JPEG, PNG, GIF, WEBP (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {previewUrl && !isLoading && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2 dark:text-gray-300">
            Preview:
          </p>
          <div
            className="relative rounded-lg overflow-hidden shadow-md"
            style={{ maxHeight: "300px" }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full object-contain"
              style={{ maxHeight: "300px" }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gray-900/70 text-white text-xs px-3 py-1 truncate">
              {uploadedImage?.name} ({Math.round(uploadedImage?.size / 1024)}{" "}
              KB)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
