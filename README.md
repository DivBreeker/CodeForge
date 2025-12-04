<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CordForge Sentiment Analyzer

This is an AI-powered sentiment analysis platform for Sinhala text and images, featuring sarcasm detection, humor detection, OCR, and object recognition.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   # 1. Database (REQUIRED for Global Admin Access)
   # Follow the "Database Setup" section below to get these keys.
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_KEY=your_supabase_anon_key

   # 2. AI Model (Choose One)
   # Option A: Google Gemini (Fallback/Demo)
   API_KEY=your_google_gemini_api_key
   
   # Option B: Custom Python Model (Production)
   VITE_CUSTOM_API_URL=http://localhost:5000/analyze
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup (Centralized User Management)

To allow Admins to manage users from any location, you must set up Supabase:

1.  **Create Account:** Go to [Supabase.com](https://supabase.com) and create a free project.
2.  **Run SQL Setup:**
    *   In your Supabase Dashboard, click on **SQL Editor** (icon on the left).
    *   Click **New Query**.
    *   Open the file `supabase_setup.sql` located in this project folder.
    *   Copy the *entire* content and paste it into the Supabase SQL Editor.
    *   Click **Run** (bottom right). This creates your tables and user permissions.
3.  **Get API Keys:**
    *   Go to **Project Settings** (gear icon) -> **API**.
    *   Copy the `Project URL`.
    *   Copy the `anon` / `public` Key.
    *   Paste these into your `.env` file as `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`.

**Note:** Once configured, any user who registers will be visible in the Admin Dashboard, regardless of which browser or device they use.

## 🧠 Custom AI Model Connection

If you have your own Python/Flask backend for Sinhala analysis:

1. Ensure your backend accepts `POST` requests at `/analyze`.
2. Add the URL to `.env` as `VITE_CUSTOM_API_URL`.
3. The app will automatically switch from Gemini to your Custom Model.
