const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

// Initialize the Google Gen AI with API key
const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
console.log(`API Key available: ${apiKey ? "Yes" : "No"}`);
console.log(
  `API Key preview: ${apiKey ? apiKey.substring(0, 4) + "..." : "Not found"}`
);

// Check for valid API key
// if (!apiKey) {
//   console.error("❌ ERROR: No Gemini API key found in environment variables!");
//   console.error(
//     "Please set GOOGLE_API_KEY or GEMINI_API_KEY in your .env file."
//   );
// }

// Use the Gemini model specified in env or default to gemini-2.0-flash
const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
// console.log(`Using Gemini model: ${modelName}`);

// Create the Gemini client with correct library
let genAI;
try {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log("✅ Gemini API client initialized successfully");
} catch (err) {
  console.error("❌ Failed to initialize Gemini API client:", err.message);
  genAI = null;
}

// Helper function to read image file and convert to base64
async function fileToBase64(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    return {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: "image/jpeg",
      },
    };
  } catch (error) {
    console.error("Error reading image file:", error);
    throw new Error("Failed to process image file");
  }
}

// Detect items from image
exports.detectItems = async (req, res) => {
  console.log("🔍 Starting item detection process");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;
    console.log("📸 Processing image from path:", imagePath);
    console.log(
      "📂 File details:",
      req.file.originalname,
      req.file.mimetype,
      req.file.size + " bytes"
    );

    // // Check if API client is available
    // if (!genAI) {
    //   console.error("❌ Cannot use Gemini API - client initialization failed");
    //   return res.status(401).json({
    //     message: "Error",
    //     error: "API client initialization failed. Please check your API key.",
    //   });
    // }

    // Validate that the file exists and is readable
    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({
        message: "Error",
        error: "Uploaded file not found on server. Please try again.",
      });
    }

    // Check file size
    const stats = fs.statSync(imagePath);
    if (stats.size === 0) {
      return res.status(400).json({
        message: "Error",
        error: "Uploaded file is empty. Please upload a valid image.",
      });
    }

    try {
      // console.log("📄 Reading image file...");
      const imageData = await fileToBase64(imagePath);
      // console.log("✅ Image converted to base64 format");

      // console.log("🤖 Initializing Gemini model:", modelName);
      // Get model using correct method - getGenerativeModel
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
      You are a grocery item detector. Analyze this image and identify all grocery items, food products, and household items visible.

      For each distinct item:
      1. Identify the item name
      2. Count how many instances of this item are present

      INSTRUCTIONS:
      - Focus only on grocery items, food products, and household goods
      - Be specific with item descriptions (e.g., "Red Apple" not just "Apple")
      - Count items accurately, including multiples of the same item
      - When multiple similar items are in a package, count the package as 1 item
      
      FORMAT YOUR RESPONSE AS A VALID JSON ARRAY ONLY:
      [
        {
          "itemName": "Item Name",
          "count": number,
          "timestamp": "${new Date().toISOString()}"
        }
      ]
      
      DO NOT include any explanatory text or markdown formatting - ONLY the JSON array.
      `;

      // console.log("🚀 Sending request to Gemini API for item detection...");

      // Use the model to generate content with correct format
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }, imageData],
          },
        ],
      });

      // console.log("✅ Received response from Gemini API");

      // Extract text from response
      const response = await result.response;
      const text = response.text();
      // console.log("📄 Raw API response length:", text.length, "characters");

      // Parse JSON
      try {
        let jsonString = text;
        if (text.includes("[") && text.includes("]")) {
          const startIndex = text.indexOf("[");
          const endIndex = text.lastIndexOf("]") + 1;
          jsonString = text.substring(startIndex, endIndex);
        }

        jsonString = jsonString.replace(/```json|```/g, "").trim();
        console.log("🧹 Cleaned JSON string ready for parsing");

        const parsedResponse = JSON.parse(jsonString);
        console.log(
          "✅ Successfully parsed JSON response with",
          parsedResponse.length,
          "items"
        );

        return res.json({
          message: "Success",
          result: parsedResponse,
        });
      } catch (parseError) {
        console.error("❌ Error parsing JSON:", parseError.message);
        console.log("⚠️ Returning original text response");
        // Return text response if JSON parsing fails
        return res.json({
          message: "Success",
          result: text,
        });
      }
    } catch (apiError) {
      console.error("❌ Gemini API error:", apiError.message);
      return res.status(500).json({
        message: "Error",
        error: `API Error: ${apiError.message}`,
      });
    }
  } catch (error) {
    console.error("❌ Error in detect-items:", error.message, error.stack);
    return res.status(500).json({
      message: "Error",
      error: `Server error: ${error.message}`,
    });
  }
};

// Detect freshness of produce from image
exports.detectFreshness = async (req, res) => {
  console.log("🔍 Starting freshness detection process");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;
    console.log("📸 Processing image from path:", imagePath);
    console.log(
      "📂 File details:",
      req.file.originalname,
      req.file.mimetype,
      req.file.size + " bytes"
    );

    // // Check if API client is available
    // if (!genAI) {
    //   console.error("❌ Cannot use Gemini API - client initialization failed");
    //   return res.status(401).json({
    //     message: "Error",
    //     error: "API client initialization failed. Please check your API key.",
    //   });
    // }

    // Validate that the file exists and is readable
    if (!fs.existsSync(imagePath)) {
      return res.status(400).json({
        message: "Error",
        error: "Uploaded file not found on server. Please try again.",
      });
    }

    // Check file size
    const stats = fs.statSync(imagePath);
    if (stats.size === 0) {
      return res.status(400).json({
        message: "Error",
        error: "Uploaded file is empty. Please upload a valid image.",
      });
    }

    try {
      // console.log("📄 Reading image file...");
      const imageData = await fileToBase64(imagePath);
      // console.log("✅ Image converted to base64 format");

      // console.log("🤖 Initializing Gemini model:", modelName);
      // Get model using correct method - getGenerativeModel
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
      You are a produce freshness expert. Analyze this image and identify all fresh produce items like fruits and vegetables.

      For each produce item:
      1. Identify the specific type (e.g., "Gala Apple" rather than just "Apple")
      2. Assess its current freshness state in detail
      3. Provide an estimate of remaining shelf life in days
      
      ASSESSMENT GUIDELINES:
      - Be detailed in your freshness assessment (color, texture, visible signs)
      - Provide specific shelf life estimates (e.g., "3-4 days" not "a few days")
      - Consider normal storage conditions
      - If produce appears overripe, note this clearly
      
      FORMAT YOUR RESPONSE AS A VALID JSON ARRAY ONLY:
      [
        {
          "produce": "Produce Type",
          "freshness": "Detailed freshness assessment",
          "expectedLifespan": "X days",
          "timestamp": "${new Date().toISOString()}"
        }
      ]
      
      DO NOT include any explanatory text or markdown formatting - ONLY the JSON array.
      If no fresh produce is found, return an empty array [].
      `;

      console.log(
        "🚀 Sending request to Gemini API for freshness detection..."
      );

      // Use the model to generate content with correct format
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }, imageData],
          },
        ],
      });

      // console.log("✅ Received response from Gemini API");

      // Extract text from response
      const response = await result.response;
      const text = response.text();
      console.log("📄 Raw API response length:", text.length, "characters");

      // Parse JSON
      try {
        let jsonString = text;
        if (text.includes("[") && text.includes("]")) {
          const startIndex = text.indexOf("[");
          const endIndex = text.lastIndexOf("]") + 1;
          jsonString = text.substring(startIndex, endIndex);
        }

        jsonString = jsonString.replace(/```json|```/g, "").trim();
        console.log("🧹 Cleaned JSON string ready for parsing");

        const parsedResponse = JSON.parse(jsonString);
        console.log(
          "✅ Successfully parsed JSON response with",
          parsedResponse.length,
          "items"
        );

        return res.json({
          message: "Success",
          result: parsedResponse,
        });
      } catch (parseError) {
        console.error("❌ Error parsing JSON:", parseError.message);
        console.log("⚠️ Returning original text response");
        // Return text response if JSON parsing fails
        return res.json({
          message: "Success",
          result: text,
        });
      }
    } catch (apiError) {
      console.error("❌ Gemini API error:", apiError.message);
      return res.status(500).json({
        message: "Error",
        error: `API Error: ${apiError.message}`,
      });
    }
  } catch (error) {
    console.error("❌ Error in detect-freshness:", error.message, error.stack);
    return res.status(500).json({
      message: "Error",
      error: `Server error: ${error.message}`,
    });
  }
};
