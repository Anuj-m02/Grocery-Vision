import { useState, useEffect } from "react";
import CameraComponent from "./components/CameraComponent";
import ItemsTable from "./components/ItemsTable";
import FreshnessTable from "./components/FreshnessTable";
import FileUpload from "./components/FileUpload";
import {
  Sun,
  Moon,
  ShoppingCart,
  Leaf,
  Info,
  AlertTriangle,
  Camera,
  Upload,
  Sparkles,
  Box,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);
  const [freshProduce, setFreshProduce] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [activeTab, setActiveTab] = useState("camera"); // camera, upload
  const [isBackendRunning, setIsBackendRunning] = useState(true);

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Check if backend is running
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        await axios.get(API_URL);
        setIsBackendRunning(true);
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          setIsBackendRunning(false);
          setError(
            "Backend server is not running. Please start the backend server."
          );
        }
      }
    };

    checkBackendStatus();
  }, []);

  const onImageCapture = async (imageSrc) => {
    if (!isBackendRunning) {
      setError(
        "Backend server is not running. Please start the backend server."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await processImage(imageSrc);
    } catch (err) {
      setError(`Error processing image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const processImage = async (imageSrc) => {
    try {
      // Convert data URL to blob more reliably
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();

      // Add the image with a unique name including timestamp to avoid caching issues
      const timestamp = new Date().getTime();
      formData.append("image", blob, `image_${timestamp}.jpg`);

      console.log("📦 FormData created with image:", blob.size, "bytes");

      // Process in sequence to avoid overwhelming the backend
      await detectItems(formData);
      await detectFreshness(formData);
    } catch (err) {
      console.error("❌ Error in processImage:", err);
      setError(`Error processing image: ${err.message}`);
    }
  };

  const detectItems = async (formData) => {
    try {
      console.log("🚀 Sending item detection request to API...");
      setError(null);

      // Use API URL from environment variables
      const url = `${API_URL}/api/detect-items`;
      console.log("📡 Sending request to:", url);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60-second timeout for API processing
        withCredentials: false,
      });

      console.log("📊 Response status:", response.status);

      if (response.data && response.data.message === "Success") {
        if (Array.isArray(response.data.result)) {
          console.log(
            "✅ Received",
            response.data.result.length,
            "items from API"
          );
          setItems(response.data.result);
        } else if (typeof response.data.result === "string") {
          // Parse string response
          const text = response.data.result;
          console.log("📝 Parsing text response");
          const items = parseTextToItems(text);
          console.log("✅ Parsed", items.length, "items");
          setItems(items);
        } else {
          console.warn("⚠️ Unknown response format");
          setItems([]);
        }
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      } else {
        console.warn("⚠️ Invalid response format");
        setItems([]);
      }
    } catch (error) {
      console.error("❌ Error detecting items:", error);

      // Set appropriate error message based on error type
      if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to backend server. Please make sure the backend is running on port 5000."
        );
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. The server took too long to respond.");
      } else if (error.response?.data?.error) {
        setError(`API Error: ${error.response.data.error}`);
      } else if (error.response?.status === 500) {
        setError(
          "Server error (500). This might be due to an invalid API key or server configuration issue."
        );
      } else {
        setError(`Error: ${error.message}`);
      }

      setItems([]);
    }
  };

  const detectFreshness = async (formData) => {
    try {
      console.log("🚀 Sending freshness detection request to API...");
      setError(null);

      // Use API URL from environment variables
      const url = `${API_URL}/api/detect-freshness`;
      console.log("📡 Sending request to:", url);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60-second timeout for API processing
        withCredentials: false,
      });

      console.log("📊 Response status:", response.status);

      if (response.data && response.data.message === "Success") {
        if (Array.isArray(response.data.result)) {
          console.log(
            "✅ Received",
            response.data.result.length,
            "produce items from API"
          );
          setFreshProduce(response.data.result);
        } else if (typeof response.data.result === "string") {
          // Parse string response
          const text = response.data.result;
          console.log("📝 Parsing text response");
          const produce = parseTextToProduce(text);
          console.log("✅ Parsed", produce.length, "produce items");
          setFreshProduce(produce);
        } else {
          console.warn("⚠️ Unknown response format");
          setFreshProduce([]);
        }
      } else if (response.data && response.data.error) {
        throw new Error(response.data.error);
      } else {
        console.warn("⚠️ Invalid response format");
        setFreshProduce([]);
      }
    } catch (error) {
      console.error("❌ Error detecting freshness:", error);

      // Set appropriate error message based on error type
      if (error.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to backend server. Please make sure the backend is running on port 5000."
        );
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. The server took too long to respond.");
      } else if (error.response?.data?.error) {
        setError(`API Error: ${error.response.data.error}`);
      } else if (error.response?.status === 500) {
        setError(
          "Server error (500). This might be due to an invalid API key or server configuration issue."
        );
      } else {
        setError(`Error: ${error.message}`);
      }

      setFreshProduce([]);
    }
  };

  const onFileUpload = async (file) => {
    if (!isBackendRunning) {
      setError(
        "Backend server is not running. Please start the backend server."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      await detectItems(formData);
      await detectFreshness(formData);
    } catch (err) {
      setError(`Error processing file: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMnY2aDZ2LTZoLTZ6bTEyIDEydjZoNnYtNmgtNnptMC0xMnY2aDZ2LTZoLTZ6bS0yNCAxMnY2aDZ2LTZoLTZ6bTAtMTJ2Nmg2di02aC02em0xMiAwdjZoNnYtNmgtNnptMCAxMnY2aDZ2LTZoLTZ6bS0xMi0yNHY2aDZ2LTZoLTZ6bTEyIDB2Nmg2di02aC02em0xMiAwdjZoNnYtNmgtNnptMCAxMnY2aDZ2LTZoLTZ6bS0yNCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60 dark:opacity-20 pointer-events-none"></div>

      <div className="container relative z-10 mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl p-3 shadow-xl">
                <ShoppingCart className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 dark:bg-yellow-300 rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                <Sparkles className="h-3 w-3 text-yellow-900" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Grocery Vision
                </span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Smart inventory assistant powered by advanced vision technology
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-blue-600" />
              )}
            </button>
          </div>
        </header>

        {!isBackendRunning && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-500 dark:border-amber-600 text-amber-800 dark:text-amber-200 rounded-xl shadow-lg flex items-start">
            <AlertTriangle className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Backend Not Running
              </h3>
              <p className="text-sm mb-3">
                The backend server is not running. Please start it with:
              </p>
              <div className="bg-amber-100/80 dark:bg-amber-900/40 p-4 rounded-lg shadow-inner font-mono text-sm border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-1.5"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1.5"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="ml-3 text-amber-700 dark:text-amber-300 opacity-70">
                    Terminal
                  </span>
                </div>
                <code className="block text-amber-800 dark:text-amber-300">
                  cd backend
                  <br />
                  npm run dev
                </code>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-10 border border-gray-100/80 dark:border-gray-700/80 transition-all duration-300">
          <div className="flex mb-6 border-b dark:border-gray-700">
            <button
              onClick={() => setActiveTab("camera")}
              className={`px-5 py-3 font-medium flex items-center gap-2 transition-all ${
                activeTab === "camera"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 translate-y-[1px]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Camera
                className={`h-5 w-5 ${
                  activeTab === "camera"
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <span>Use Camera</span>
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-5 py-3 font-medium flex items-center gap-2 transition-all ${
                activeTab === "upload"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 translate-y-[1px]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Upload
                className={`h-5 w-5 ${
                  activeTab === "upload"
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              />
              <span>Upload Image</span>
            </button>
          </div>

          {activeTab === "camera" && (
            <CameraComponent
              onCapture={onImageCapture}
              isLoading={isLoading}
              darkMode={darkMode}
            />
          )}

          {activeTab === "upload" && (
            <FileUpload
              onFileUpload={onFileUpload}
              isLoading={isLoading}
              darkMode={darkMode}
            />
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl shadow-lg my-6 overflow-hidden transition-all duration-300">
            <div className="px-4 py-3 bg-red-100/50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="font-medium">Error</span>
            </div>
            <div className="p-4 flex items-start">
              <div className="w-full">
                <p className="font-medium">{error}</p>
                {error &&
                  (error.includes("API key not valid") ||
                    error.includes("API key") ||
                    error.includes("Gemini API")) && (
                    <div className="mt-3 text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-red-100 dark:border-red-900">
                      <p className="font-semibold mb-2">
                        Fix the API key issues:
                      </p>
                      <ol className="list-decimal ml-5 mt-1 space-y-2">
                        <li>
                          Get a free API key from{" "}
                          <a
                            href="https://makersuite.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline"
                          >
                            Google MakerSuite
                          </a>
                        </li>
                        <li>Open the backend/.env file</li>
                        <li>Update the GOOGLE_API_KEY with your API key</li>
                        <li>
                          Restart the backend server:{" "}
                          <code className="bg-red-50 dark:bg-red-900/50 px-2 py-1 rounded font-mono">
                            npm run dev
                          </code>
                        </li>
                      </ol>
                    </div>
                  )}

                {error && error.includes("backend server") && (
                  <div className="mt-3 text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-red-100 dark:border-red-900">
                    <p className="font-semibold mb-2">
                      Start the backend server:
                    </p>
                    <ol className="list-decimal ml-5 mt-1 space-y-2">
                      <li>Open a new terminal</li>
                      <li>
                        Navigate to the backend directory:{" "}
                        <code className="bg-red-50 dark:bg-red-900/50 px-2 py-1 rounded font-mono">
                          cd backend
                        </code>
                      </li>
                      <li>
                        Start the server:{" "}
                        <code className="bg-red-50 dark:bg-red-900/50 px-2 py-1 rounded font-mono">
                          npm run dev
                        </code>
                      </li>
                    </ol>
                  </div>
                )}

                {error && error.includes("timed out") && (
                  <div className="mt-3 text-sm bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-red-100 dark:border-red-900">
                    <p className="font-semibold mb-2">
                      The request timed out. Try these steps:
                    </p>
                    <ol className="list-decimal ml-5 mt-1 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>Check your internet connection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>
                          Try again with a smaller image or a clearer photo
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>The API might be experiencing high traffic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>Restart the backend server and try again</span>
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/80 dark:border-gray-700/80">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <Box className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>Item Detection</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Analysis of grocery items found in your image
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-800/40 rounded-full h-8 w-8 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                    {items.length}
                  </span>
                </div>
              </div>

              <div className="p-0">
                <ItemsTable items={items} darkMode={darkMode} />
              </div>
            </div>
          </div>

          <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/80 dark:border-gray-700/80">
              <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                    <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Fresh Produce</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Detailed freshness assessment of detected produce
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-800/40 rounded-full h-8 w-8 flex items-center justify-center shadow-inner">
                  <span className="text-xs font-bold text-green-800 dark:text-green-300">
                    {freshProduce.length}
                  </span>
                </div>
              </div>

              <div className="p-0">
                <FreshnessTable
                  freshProduce={freshProduce}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
          <div className="flex items-center mb-2">
            <ShoppingCart className="h-4 w-4 mr-1" />
            <p>Smart Grocery Assistant</p>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Grocery Vision - Smart inventory
            made simple
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

// Helper function to parse text response into structured items
const parseTextToItems = (text) => {
  try {
    // Try to find a JSON array in the text first
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.log("Failed to parse JSON from text");
      }
    }

    // Otherwise, try to parse as a table
    const lines = text.split("\n").filter((line) => line.trim().length > 0);

    // Find header row and identify columns
    const headerRowIndex = lines.findIndex(
      (line) =>
        line.includes("Item Name") ||
        line.includes("Count") ||
        line.includes("Freshness")
    );

    if (headerRowIndex === -1) {
      console.log("Could not find header row in text response");
      return [];
    }

    // Parse the table rows
    const items = [];
    const timestamp = new Date().toISOString();

    for (let i = headerRowIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        const columns = line
          .split("|")
          .map((col) => col.trim())
          .filter(Boolean);
        if (columns.length >= 2) {
          const itemName = columns[0];
          const countStr = columns[1];
          const count = parseInt(countStr) || 1;

          items.push({
            itemName,
            count,
            timestamp,
          });
        }
      }
    }

    return items;
  } catch (error) {
    console.error("Error parsing text to items:", error);
    return [];
  }
};

// Helper function to parse text response into structured produce items
const parseTextToProduce = (text) => {
  try {
    // Try to find a JSON array in the text first
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.log("Failed to parse JSON from text");
      }
    }

    // Otherwise, try to parse as a table
    const lines = text.split("\n").filter((line) => line.trim().length > 0);

    // Find header row and identify columns
    const headerRowIndex = lines.findIndex(
      (line) =>
        line.includes("Produce") ||
        line.includes("Freshness") ||
        line.includes("Expected Life") ||
        line.includes("Lifespan")
    );

    if (headerRowIndex === -1) {
      console.log("Could not find header row in text response");
      return [];
    }

    // Parse the table rows
    const produceItems = [];
    const timestamp = new Date().toISOString();

    for (let i = headerRowIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("|") && line.endsWith("|")) {
        const columns = line
          .split("|")
          .map((col) => col.trim())
          .filter(Boolean);
        if (columns.length >= 3) {
          const produce = columns[0];
          const freshness = columns[1];
          const expectedLifespan = columns[2];

          if (
            produce !== "N/A" &&
            produce !== "-" &&
            !produce.toLowerCase().includes("packaged")
          ) {
            produceItems.push({
              produce,
              freshness,
              expectedLifespan,
              timestamp,
            });
          }
        }
      }
    }

    return produceItems;
  } catch (error) {
    console.error("Error parsing text to produce:", error);
    return [];
  }
};
