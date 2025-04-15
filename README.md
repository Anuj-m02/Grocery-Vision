![Screenshot 2025-04-15 150812](https://github.com/user-attachments/assets/eff6e32a-eab3-4e64-9d60-b63833504e95)# Grocery Vision

![Grocery Vision]

## Overview

Grocery Vision is a smart inventory assistant that helps you identify grocery items and assess the freshness of produce using your device's camera or uploaded images. Perfect for managing your pantry, planning meals, and reducing food waste.

## Features

- **Item Detection**: Quickly identify grocery items from photos
- **Freshness Analysis**: Get shelf-life estimates for fresh produce
- **Dark Mode**: Comfortable viewing in any environment
- **Multiple Input Methods**: Use your camera or upload existing images
- **Responsive Design**: Works on both desktop and mobile devices

## Technology Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js with Express
- **Image Processing**: Advanced computer vision technology
- **Styling**: Tailwind CSS with custom transitions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/grocery-vision.git
   cd grocery-vision
   ```

2. Install dependencies for both frontend and backend:

   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```


### Running the Application

1. Start the backend server:

   ```
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:

   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
![Screenshot 2025-04-15 150812](https://github.com/user-attachments/assets/066850c2-48b0-4cd9-9395-39d768d0bd87)
![Screenshot 2025-04-15 150828](https://github.com/user-attachments/assets/b0282c8e-5824-48fb-819a-d80344dc87a6)
![Screenshot 2025-04-15 150838](https://github.com/user-attachments/assets/5ed99363-8e32-4509-ab54-029e498b8401)
![Screenshot 2025-04-15 150849](https://github.com/user-attachments/assets/2f9a49e4-da6e-4f0d-ad38-0133f4079eea)


## Usage

1. **Capture Image**: Use the camera tab to take a photo of grocery items or produce
2. **Upload Image**: Alternatively, upload an existing image
3. **View Results**: See detected items and freshness information in the tables below
4. **Dark/Light Mode**: Toggle between dark and light modes using the sun/moon icon

## Project Structure

```
grocery-vision/
├── backend/               # Express server
│   ├── controllers/       # API controllers
│   ├── uploads/           # Temporary image storage
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Server entry point
│
├── frontend/              # React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS styles
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
└── README.md              # Project documentation
```

## Troubleshooting

### Common Issues

- **Backend Not Running**: Make sure the backend server is running on port 5000
- **API Key Issues**: Verify your API key is correctly set in the backend `.env` file
- **Image Upload Errors**: Ensure the image is in a supported format (JPG, PNG, etc.)
- **Request Timeout**: Try using a smaller image or check your internet connection

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Icons provided by [Lucide Icons](https://lucide.dev/)
- Designed with [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ by Coding Crackers
