# 🧠 Natural Language Task Manager

A modern full-stack application that lets you create tasks using natural language. Simply type your task as you would say it, and the app intelligently parses it into structured data using OpenAI's API.

## ✨ Features

- 📝 Create tasks using natural language
- 🤖 AI-powered parsing of task details
- 📅 Automatic extraction of due dates
- 👥 Assignee detection
- ⭐ Priority level assignment
- 📊 Tasks grouped by priority

## 🚀 Prerequisites

- Node.js
- npm or yarn
- OpenAI API key

## 💻 Setup & Running Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Run Backend & Frontend**

   You'll need two terminal windows to run the servers:

   **Terminal 1 - Backend Server:**

   ```bash
   cd backend
   npm install

   # Create .env file in backend directory
   # Add your OpenAI API key and port (default 3001)
   OPENAI_API_KEY=your_openai_api_key
   PORT=3001

   # Start the server
   npm run dev
   ```

   **Terminal 2 - Frontend Server:**

   ```bash
   cd client
   npm install

   # Optional: Create .env file in client directory
   # By default, frontend will connect to http://localhost:3001
   VITE_API_URL=http://localhost:3001

   # Start the frontend
   npm run dev
   ```

   The application will be available at:

   - Frontend: `http://localhost:8080`
   - Backend: `http://localhost:3001`

## 📝 Example Usage

Try entering tasks in natural language. Here are some examples:

1. **Task with specified priority (P1 - Urgent):**

   > "P1: Submit security patch to Sarah by 5pm today"

   The app will parse this into:

   - Task: Submit security patch
   - Assignee: Sarah
   - Due Date: Today at 5:00 PM
   - Priority: P1 (Urgent)

2. **Task with default priority (P3 - Medium):**

   > "Review design mockups with Alex by next Monday"

   The app will parse this into:

   - Task: Review design mockups
   - Assignee: Alex
   - Due Date: Next Monday
   - Priority: P3 (Medium) - Default

You can specify priorities in your task description:

- P1: Urgent/Critical tasks
- P2: High priority tasks
- P3: Medium priority (default)
- P4: Low priority tasks
