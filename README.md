<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CordForge Sentiment Analyzer

This is an AI-powered sentiment analysis platform for Sinhala text and images, featuring sarcasm detection, humor detection, OCR, and object recognition.

## 🚀 Step 1: Database Setup (Supabase)

To enable the Global Admin Dashboard and data persistence:

1.  **Create Account:** Go to [Supabase.com](https://supabase.com) and create a free project.
2.  **Run SQL Setup:**
    *   In your Supabase Dashboard, click on **SQL Editor** (icon on the left).
    *   Click **New Query**.
    *   Open the file `supabase_setup.sql` located in this project folder.
    *   Copy the **entire content** and paste it into the Supabase SQL Editor.
    *   Click **Run** (bottom right). This creates your tables and user permissions.
3.  **Get API Keys:**
    *   Go to **Project Settings** (gear icon) -> **API**.
    *   Copy the `Project URL`.
    *   Copy the `anon` / `public` Key.

## 💻 Step 2: Local Configuration

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database (Paste your Supabase keys here)
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_KEY=your-anon-key

   # AI Model (Paste your Google Gemini API Key here)
   API_KEY=your_google_gemini_api_key
   ```

3. **Run Locally:**
   ```bash
   npm run dev
   ```

## 🌍 Step 3: Deploying to cordforge.free.nf

Since you are using a static hosting provider (like InfinityFree), follow these exact steps to connect your live site to the database:

1.  **Ensure `.env` is correct:** Make sure your `.env` file on your computer has the correct Supabase URL and Key.
2.  **Build the Project:**
    Run the build command. This takes your code and your keys and packages them into static files.
    ```bash
    npm run build
    ```
3.  **Upload:**
    *   You will see a new folder named `dist` created in your project.
    *   Open your hosting File Manager (e.g., FileZilla or the InfinityFree online file manager).
    *   Navigate to `htdocs`.
    *   **Upload the CONTENTS of the `dist` folder** into `htdocs`. (Do not upload the `dist` folder itself, upload the files inside it: `index.html`, `assets/`, etc.).

Once uploaded, your website `https://cordforge.free.nf/` will be connected to the global database. Any user registering there will appear in your Admin Dashboard.
