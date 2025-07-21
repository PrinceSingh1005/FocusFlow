# 🚀 FocusFlow — MERN Stack Productivity Tracker & Site Blocker

FocusFlow is a full-stack productivity tracking solution built using the MERN stack (MongoDB, Express, React, Node.js). It helps you take control of your online habits by:

* ⏱️ Monitoring your website usage in real time
* 📊 Visualizing activity with interactive charts
* ❌ Blocking distracting sites like social media
* 🔐 Supporting user authentication and session tracking

> Stay focused. Track smart. Build better habits.

---

## 📸 Demo

### 🔐 Login System

A sleek and secure login popup to start tracking your focus session.

![Login Demo](./assets/Login.png)

### ⚙️ Settings Panel

Easily block distracting websites (e.g., Facebook, Twitter) with a minimal UI.

![Settings Demo](./assets/Settings.png)

### 📊 Reports View

Visual pie charts display your time distribution across sites for the day.

![Reports Demo](./assets/Report.png)

---

## 🛠️ Tech Stack

| Frontend             | Backend           | Extension                      | Auth |
| -------------------- | ----------------- | ------------------------------ | ---- |
| React + Tailwind CSS | Node.js + Express | Chrome Extension (Manifest V3) | JWT  |

---

## 📁 Project Structure

```
FocusFlow/
├── backend/           # Express backend with MongoDB integration
├── extension/         # Chrome extension with popup UI
└── README.md
```

---

## ⚖️ Features

* ✅ Real-time site activity tracking (via Chrome Extension)
* 📊 Time reports in interactive pie charts
* 🔒 Secure login/register using JWT
* ⚙️ Settings panel to add/remove blocked websites
* 🌐 Syncs data with your authenticated profile (MongoDB)

---

## 🚀 How to Run Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/PrinceSingh1005/FocusFlow.git
   cd FocusFlow
   ```

2. **Install dependencies**

   ```bash
   cd backend && npm install
   cd ../extension && npm install
   ```

3. **Set environment variables**
   Create a `.env` file inside `backend/` with:

   ```env
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   ```

4. **Run the server**

   ```bash
   cd backend
   npm start
   ```

5. **Load the Chrome extension**

   * Go to `chrome://extensions/`
   * Enable Developer Mode
   * Click “Load unpacked” and select the `extension/` folder

---

## 🌍 Live Demo (coming soon)

Stay tuned for the deployed version on **Vercel** or **Render**.

---

## 👌 Contribution

Pull requests are welcome! For major changes, please open an issue first.

---

## 📜 License

MIT License. Feel free to use and modify with credit.

---

## 👤 Author

**Prince Singh**
GitHub: [@PrinceSingh1005](https://github.com/PrinceSingh1005)

---

> “Discipline is choosing between what you want now and what you want most.” — FocusFlow helps you stay true to what matters most.
