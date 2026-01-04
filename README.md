# 🎬 Film Title Translation Survey

**英中电影片名翻译接受度研究问卷系统**

A beautiful vintage-style web application for conducting academic research on film title translation effectiveness.

## ✨ Features

- 📋 **Complete Survey System** - Multi-section questionnaire with conditional logic
- 🎨 **Vintage Aesthetic Design** - Elegant cream and brown color scheme
- 💾 **MongoDB Cloud Storage** - Free cloud database integration
- 📊 **Admin Dashboard** - View and export responses
- 📱 **Responsive Design** - Works on all devices
- 🌐 **Bilingual** - Chinese and English support

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user
4. Get your connection string
5. Create `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/film-survey
PORT=3000
```

### 3. Run Locally

```bash
npm start
```

Visit: `http://localhost:3000`

## 📦 Deployment

### Deploy to Vercel (Free)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variable in Vercel dashboard:
   - `MONGODB_URI` = your MongoDB connection string

### Deploy to Railway (Free)

1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variable: `MONGODB_URI`
4. Deploy automatically

## 📊 API Endpoints

- `GET /` - Survey homepage
- `GET /admin.html` - Admin dashboard
- `POST /api/submit` - Submit survey response
- `GET /api/responses` - Get all responses
- `GET /api/stats` - Get statistics
- `GET /api/export/csv` - Export as CSV
- `GET /api/health` - Health check

## 🎨 Design Features

- Vintage cream and brown color palette
- Elegant serif typography (Georgia)
- Smooth animations and transitions
- Progress tracking
- Responsive grid layouts
- Beautiful form styling

## 📁 Project Structure

```
film-survey-app/
├── public/
│   ├── index.html       # Main survey page
│   ├── admin.html       # Admin dashboard
│   ├── styles.css       # Vintage CSS styling
│   └── script.js        # Frontend logic
├── server.js            # Express + MongoDB backend
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── README.md           # This file
```

## 👥 For Researchers

This survey collects data on:
- Participant demographics and language background
- Evaluations of 5 film title translations
- Likert scale ratings (1-5) on understanding, appeal, accuracy, and preference
- Open-ended responses on cultural interpretation
- Pilot study feedback

## 📄 License

MIT License - Free for academic research use

## 👨‍🎓 Author

He Yanzheng  
Universiti Putra Malaysia (UPM)  
Bachelor's Dissertation Project

---

**Note**: This is an academic research tool. All data is collected anonymously and used solely for research purposes.
