# 🚀 Chrome Extension Generator

An AI-powered web app that generates basic Chrome extension files (`manifest.json`, `popup.html`, `content.js`) from a simple idea.

---

## 📌 Features

* 🧠 Generate Chrome extension code using AI
* 📂 Outputs:

  * `manifest.json`
  * `popup.html`
  * `content.js`
* 🎨 Clean UI with React
* 📦 Download generated files as ZIP
* ⚡ Fast backend using Node.js + Express

---

## 🏗️ Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js + Express
* **AI:** Google Gemini API
* **Other:** JSZip, FileSaver

---

## 📁 Project Structure

```
Extension-Generator/
│
├── backend/
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <your-repo-link>
cd Extension-Generator
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

Run backend:

```bash
node server.js
```

👉 Runs on: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm install jszip file-saver
```

Run frontend:

```bash
npm start
```

👉 Runs on: `http://localhost:3000` (or 3001)

---

## 🧠 How It Works

1. User enters an idea
2. Frontend sends request to backend
3. Backend sends prompt to Gemini API
4. AI generates Chrome extension files in JSON format
5. Frontend parses and displays files
6. User downloads files as ZIP

---

## 📦 Example Input

```
Create a dark mode Chrome extension
```

---

## 📤 Example Output

```json
{
  "manifest.json": "...",
  "popup.html": "...",
  "content.js": "..."
}
```

---

## ⚠️ Common Issues & Fixes

### ❌ Error: `Invalid JSON from AI`

* AI sometimes returns extra text
* Fix:

  * Use strict prompt in backend
  * Clean response before parsing

---

### ❌ Error: `429 Too Many Requests`

* API quota exceeded

✅ Solutions:

* Wait 15–60 minutes
* Use `gemini-1.5-flash` model
* Create new API key
* Avoid repeated requests

---

### ❌ Error: `500 Internal Server Error`

* Backend failed to call API

✅ Check:

* API key is correct
* Backend is running
* Console logs

---

## 🔧 Future Improvements

* 🌙 Dark/Light mode toggle
* 📋 Copy code button
* 🔍 Live preview of extension
* 🌐 Deploy project online
* 🧠 Better JSON validation

---

## 👩‍💻 Author

Built as part of a guided learning project (Day 1–Day 4).

---

## ⭐ Note

This project may hit API rate limits on free tier. Use responsibly.

---

