# 📘 FlashNotes

FlashNotes is an AI-powered web app that helps students upload lectures, generate summaries, create flashcards, and practice quizzes — all inside a clean and protected dashboard.

---

## ✨ Features

### 📄 Upload & Manage Notes
- Upload lecture files (PDF, text, etc.)
- View, organize, and manage all your notes in one place

### 🤖 AI Summaries
- Automatically generate clear and concise summaries of any lecture
- Perfect for last-minute revisions

### 🧠 Flashcards Generator
- Create flashcards instantly using AI  
- Study interactively and track your progress

### 📝 AI-Powered Quizzes
- Generate practice quizzes based on your uploaded content  
- Test your understanding without manual question creation

### 🔐 Protected Dashboard
- Secure login/signup  
- Private and personalized workspace  
- Sessions handled smoothly with Redux state

### 🎨 Clean UI
- Modern interface built with Tailwind + Next.js  
- Mobile-friendly layouts  
- Fast routing using App Router

---

## 📷 Screenshots

> Replace these with your real screenshots later.

### 🏠 Home Page  
![Home Screenshot](./screenshots/home.png)

### 📚 Dashboard  
![Dashboard Screenshot](./screenshots/dashboard.png)

### ✍️ Summary Page  
![Summary Screenshot](./screenshots/summary.png)

### 🧠 Flashcards  
![Flashcards Screenshot](./screenshots/flashcards.png)

### 📝 Quiz Page  
![Quiz Screenshot](./screenshots/quiz.png)

---

## 🔧 Environment Variables

Create a `.env` file in your project root:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/flashnotes?schema=public"

# App Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Authentication
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000/api/auth"

# AI Providers
GEMINI_API_KEY="your-gemini-key"
DEEPGRAM_API_KEY="your-deepgram-key"

# Email/Notifications
RESEND_API_KEY="your-resend-key"
```

---

## ▶️ Getting Started

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🚀 Deployment

FlashNotes works perfectly on **Vercel**, but you can deploy it to any Node.js hosting provider.

---

## 🤝 Contributing

PRs and improvements are always welcome!