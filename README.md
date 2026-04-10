# 🏠 AI-Based Platform for Monitoring Affordable Housing Availability

An intelligent AI-powered full-stack web application that helps users discover affordable housing through real-time analytics, interactive dashboards, smart search, and an AI chatbot.
This system combines Machine Learning, LLMs, and modern web technologies to deliver a scalable and user-friendly housing monitoring platform.

## 🚀 Live Demo

🔗 https://ai-house-price-predicting-analyzer.onrender.com

> Click the link above to access the deployed application.

## 📌 Problem Statement

Traditional housing platforms provide only static listings without intelligent insights.  
Users struggle to analyze affordability, price trends, and availability efficiently.

There is no real-time assistance or AI-based recommendation system to guide decision-making.

## 🎯 Objectives

- Develop an AI-powered housing analytics dashboard  
- Provide real-time insights and recommendations  
- Enable natural language chatbot interaction  
- Offer smart search and filtering  
- Build a secure and scalable full-stack system  

## ✨ Key Features

✅ Interactive dashboard for housing exploration  
✅ Smart search & filtering system  
✅ Real-time AI chatbot support  
✅ Price and availability trend visualization  
✅ Booking history tracking  
✅ Secure authentication  
✅ Cloud deployment ready  

## 🧠 System Architecture

User  
→ React Frontend  
→ Python Backend  
→ AI Model (LLM API)  
→ Database 

### Benefits
- Modular design  
- Scalable architecture  
- Real-time performance  
- Easy maintenance  


## 🗄️ Database Schema

### Entities
- User
- House
- Booking
- ChatHistory

### Relationships
- One User → Many Bookings  
- One House → Many Bookings  
- One User → Many ChatHistory records  

This design ensures efficient data management and tracking.

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS

### Backend
- Python (Flask / FastAPI)

### AI Integration
- Groq LLM API

### Database
- Supabase

### Deployment
- Render

### Version Control
- GitHub

## 📂 Project Structure


## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
https://github.com/GOKUL-S2648/AI-House-Price-Predicting-Analyzer
cd-ypur-repo

### 2️⃣ Install dependencies
npm install
pip install -r requirements.txt


### 3️⃣ Configure environment variables
Create `.env` file:
GROQ_API_KEY=your_api_key_here


### 4️⃣ Run locally
To start both the React frontend and Python ML backend:
```bash
npm run dev:all
```
Or start them separately:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: AI Backend
npm run server
```

