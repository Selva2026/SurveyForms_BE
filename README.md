# 📊 Survey Management & Analytics System

A full-stack web application that allows users to create surveys, collect responses, and view real-time analytics with charts.

## 🚀 Features

### 🔐 Authentication
- User login & signup using JWT
- Protected routes for surveys and analytics

### 📝 Survey Management
- Create surveys with title & description
- View all surveys created by the logged-in user
- Delete surveys

### 📥 Responses
- Users can submit responses to surveys
- Responses are stored securely in MongoDB

### 📈 Analytics Dashboard
- View total responses per survey
- Separate analytics for each question
- MCQ questions → Pie chart
- Text questions → Bar chart
- Real-time response updates using Socket.io

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Axios
- Tailwind CSS
- Chart.js
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Socket.io

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Analytics
Each survey displays professional charts with separate visualization per question.

## 👨‍💻 Author
Pandi
