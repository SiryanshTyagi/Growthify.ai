# Growthify - AI-Powered Content Creation Platform

<div align="center">
  <img src="GrowthSync-fronted/public/Growthify.png" alt="GrowthSync Logo" width="200"/>
  
  **Transform your content creation workflow with AI-powered tools**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://growthify-ai-frontend.vercel.app/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Growthify is a comprehensive AI-powered platform designed for content creators to streamline their workflow across multiple social media platforms. It combines trending content discovery, AI-driven content generation, and thumbnail creation into one unified dashboard.

### Key Highlights

- 🤖 **AI Content Generation** - Generate scripts, hooks, titles, captions, and hashtags
- 🎨 **AI Thumbnail Studio** - Create eye-catching thumbnails with customizable moods and styles
- 📈 **Trending Content Discovery** - Track trends across YouTube, Reddit, X (Twitter), and YouTube Music
- 📊 **Project Management** - Organize and manage all your content projects in one place
- 🔄 **Real-time Updates** - Automated cron jobs fetch trending content every 30 minutes
- 🎯 **Multi-Platform Support** - Optimized content for YouTube, Instagram, Reddit, X, and more

---

## ✨ Features

### 1. AI Content Generator
- Generate complete content packages including:
  - Video scripts optimized for different platforms
  - Attention-grabbing hooks
  - SEO-friendly titles
  - Engaging descriptions/captions
  - Relevant hashtags
- Multiple prompt types: Storytelling, Educational, Controversial, Listicle, Short-form
- Real-time refinement with AI chat interface
- Save content to new or existing projects

### 2. AI Thumbnail Studio
- Generate professional thumbnails using AI
- Customizable parameters:
  - Mood selection (Dramatic, Minimalist, Vibrant, Dark & Mysterious, Corporate)
  - Color preferences
  - Visual elements description
- Direct download functionality
- Integration with project workflow

### 3. Trending Content Discovery
- Real-time trending data from:
  - YouTube Videos
  - YouTube Music
  - Reddit Posts
  - X (Twitter) Posts
- Save trends for later reference
- Filter by platform
- View engagement metrics (views, likes, comments)

### 4. Project Management
- Create and organize content projects
- Track project status (draft, in-progress, completed)
- Link content and thumbnails to projects
- Recent projects dashboard
- Project statistics and analytics

### 5. Dashboard & Analytics
- Overview of content performance
- Platform-wise growth tracking
- Recent projects quick access
- Statistics cards for project insights

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **SweetAlert2** - Beautiful alerts

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI & Cloud Services
- **Groq** - AI content generation
- **Cloudflare Workers AI** - AI image generation
- **Cloudinary** - Image hosting and optimization

### DevOps & Utilities
- **node-cron** - Scheduled tasks
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

---

## 🏗 Architecture

```
GROWTHSYNC_FINAL/
│
├── GrowthSync-fronted/          # React Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Shared components (ProjectCard, Modal)
│   │   │   ├── home-widgets/    # Dashboard widgets
│   │   │   └── layout/          # Layout components
│   │   ├── pages/               # Page components
│   │   │   ├── ContentGenerator/
│   │   │   ├── ThumbnailStudio/
│   │   │   ├── Projects/
│   │   │   ├── Trends/
│   │   │   └── ...
│   │   ├── context/             # React Context (Auth)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── theme/               # Theme configuration
│   │   └── constants/           # App constants
│   └── public/                  # Static assets
│
└── GrowthSynch-backend/         # Node.js Backend API
    ├── src/
    │   ├── controllers/         # Request handlers
    │   │   └── AI logic/        # AI generation logic
    │   ├── models/              # Mongoose schemas
    │   ├── routes/              # API routes
    │   ├── services/            # Business logic
    │   │   ├── aiService.js
    │   │   ├── youtubeService.js
    │   │   ├── redditService.js
    │   │   └── xService.js
    │   ├── middlewares/         # Express middlewares
    │   └── utils/               # Utility functions
    ├── db.js                    # Database connections
    ├── config.js                # App configuration
    └── server.js                # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- MongoDB instance
- API keys for external services
- Groq API access
- Cloudflare Workers AI access
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd GROWTH_FINAL
```

2. **Setup Backend**
```bash
cd GrowthSynch-backend
npm install
```

3. **Setup Frontend**
```bash
cd ../GrowthSync-fronted
npm install
```

4. **Configure Environment Variables** (see below)

5. **Start Development Servers**

Backend:
```bash
cd GrowthSynch-backend
npm run dev
```

Frontend:
```bash
cd GrowthSync-fronted
npm run dev
```

The frontend will be available at `http://localhost:5173` and backend at `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/growthsync

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Frontend / CORS
FRONTEND_URL=http://localhost:5173

# Groq
GROQ_API_KEY=your_groq_api_key
GROQ_TEXT_MODEL_ID=llama-3.3-70b-versatile

# Cloudflare Workers AI
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_IMAGE_MODEL=@cf/black-forest-labs/flux-1-schnell
CLOUDFLARE_IMAGE_STEPS=4

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# External APIs
YT_API_KEY=your_youtube_api_key
REGION=IN
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=Growthify/1.0
X_BEARER_TOKEN=your_x_bearer_token
```

### Frontend

Create `GrowthSync-fronted/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user
```

### Project Endpoints

```
POST   /api/projects            - Create new project
GET    /api/projects            - Get all user projects
GET    /api/projects/:id        - Get single project
PUT    /api/projects/:id        - Update project
DELETE /api/projects/:id        - Delete project
```

### AI Endpoints

```
POST   /api/ai/generate-content     - Generate AI content
POST   /api/ai/refine-content       - Refine existing content
POST   /api/ai/save-content         - Save content to project
POST   /api/ai/generate-thumbnail   - Generate AI thumbnail
GET    /api/ai/download-thumbnail   - Download thumbnail
```

### Trending Endpoints

```
GET    /api/v1/trending             - Get all trending content
POST   /api/v1/trending/save        - Save a trend
GET    /api/v1/trending/saved       - Get saved trends
DELETE /api/v1/trending/saved       - Delete saved trend
```

### Dashboard Endpoints

```
GET    /api/dashboard               - Get dashboard statistics
```

---

## 📸 Screenshots

### 📊 Dashboard
<img src="https://github.com/user-attachments/assets/54a91063-5024-4337-9b32-2016ba6f482d" width="100%" alt="Dashboard Overview" />
*Overview of your content performance and recent projects*

### 🤖 AI Content Generator
<img src="https://github.com/user-attachments/assets/dcedd0bb-9b2b-45ff-b1f0-38ae21adf56c" width="100%" alt="AI Content Generator" />
*Generate and refine content with AI assistance*

### 🎨 AI Thumbnail Studio
<img src="https://github.com/user-attachments/assets/fbb0bc83-894e-402a-85f1-31cf6f298ca4" width="100%" alt="AI Thumbnail Studio" />
*Create professional thumbnails with AI*

### 🔥 Trending Content
<img src="https://github.com/user-attachments/assets/342c591b-771d-45ec-b92b-fcd2389f9a4f" width="100%" alt="Trending Content" />
*Discover trending content across platforms*
---

## 🌐 Deployment

### Deployed on Vercel + Render

**🚀 Live Demo:** [Growthify.ai](https://growthify-ai-frontend.vercel.app/)

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **AI Content Generation:** Groq
- **AI Image Generation:** Cloudflare Workers AI
- **Image Hosting:** Cloudinary

### Deployment Steps

1. **Deploy Backend on Render**
   - Create a new Web Service on Render
   - Connect the backend GitHub repository
   - If using the monorepo, set the root directory to `GrowthSynch-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Use Node.js v20 or higher

2. **Configure Backend Environment Variables**

   Add the required environment variables in Render:

```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret
FRONTEND_URL=https://growthify-ai-frontend.vercel.app/

GROQ_API_KEY=your_groq_api_key
GROQ_TEXT_MODEL_ID=llama-3.3-70b-versatile

CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_IMAGE_MODEL=@cf/black-forest-labs/flux-1-schnell
CLOUDFLARE_IMAGE_STEPS=4

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

YT_API_KEY=your_youtube_api_key
REGION=IN
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=Growthify/1.0
X_BEARER_TOKEN=your_x_bearer_token
```

3. **Setup MongoDB Atlas**
   - Create a production MongoDB Atlas cluster
   - Create a database user
   - Get the MongoDB connection string
   - Add the connection string as `MONGO_URI` in Render
   - Configure MongoDB Atlas network access so the Render backend can connect

4. **Deploy Frontend on Vercel**
   - Import the frontend repository/project into Vercel
   - If using the monorepo, set the root directory to `GrowthSync-fronted`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Configure Frontend Environment Variable**

   In Vercel, add:

```env
VITE_API_URL=https://your-backend.onrender.com
```

6. **Configure CORS**

   Update the Render environment variable:

```env
FRONTEND_URL=https://growthify-ai-frontend.vercel.app/
```

7. **Verify Deployment**

   Test the following after both services are deployed:

   - User registration and login
   - Dashboard
   - Project creation and management
   - AI content generation
   - AI content refinement
   - AI thumbnail generation
   - Trending content
   - Save/delete trends
   - API connectivity between Vercel and Render

### Deployment Architecture

```text
User
  │
  ▼
Vercel
React + Vite Frontend
  │
  │ HTTPS API Requests
  ▼
Render
Node.js + Express Backend
  │
  ├──► MongoDB Atlas
  │
  ├──► Groq
  │
  ├──► Cloudflare Workers AI
  │
  ├──► Cloudinary
  │
  ├──► YouTube API
  │
  ├──► Reddit API
  │
  └──► X API
```

> **Note:** Backend secrets such as `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUD_API_SECRET`, `REDDIT_CLIENT_SECRET`, and `X_BEARER_TOKEN` should only be stored in Render environment variables and should never be exposed in the frontend.


---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
## 🙏 Acknowledgments

- Groq for fast AI inference
- Cloudflare Workers AI for AI image generation
- Cloudinary for image hosting
- All open-source contributors

---


<div align="center">
  Made with ❤️ by the Growthify.ai Team
  ⭐ Star this repo if you find it helpful!
</div>


---

