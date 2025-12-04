import { User, UserRole, AnalysisResult, SystemStats, AuthResponse } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// Access variables via process.env which we safely defined in vite.config.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;

// Only initialize if keys are present and not empty strings
const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '') 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- API IMPLEMENTATION ---

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      if (!supabase) throw new Error("Database connection missing. Check .env variables.");

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("No user data returned");

      // Fetch the custom profile data (role, username)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw new Error("Could not fetch user profile");
      if (!profile.is_active) throw new Error("Account is deactivated");

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        username: profile.username,
        role: profile.role as UserRole,
        createdAt: profile.created_at,
        isActive: profile.is_active
      };

      return { user, token: data.session?.access_token || '' };
    },

    register: async (username: string, email: string, password: string): Promise<User> => {
      if (!supabase) throw new Error("Database connection missing.");

      // 1. Sign up the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.user) throw new Error("Registration failed");

      // 2. Create the public profile entry
      // Note: In production, this is better handled by a Postgres Trigger, 
      // but we do it manually here for simplicity.
      const newUserProfile = {
        id: data.user.id,
        email: email,
        username: username,
        role: UserRole.USER,
        is_active: true
      };

      const { error: dbError } = await supabase
        .from('profiles')
        .insert([newUserProfile]);

      if (dbError) {
        // Rollback or handle error - specific for demo
        console.error("Profile creation failed:", dbError);
        throw new Error("Account created but profile setup failed. Please contact support.");
      }

      return {
        id: data.user.id,
        email,
        username,
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        isActive: true
      };
    },

    requestPasswordReset: async (email: string): Promise<void> => {
      if (!supabase) return;
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/#/reset-password',
      });
    },

    logout: async () => {
      if (!supabase) return;
      await supabase.auth.signOut();
    },

    getSession: async (): Promise<AuthResponse | null> => {
        if (!supabase) return null;
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        // Fetch profile to get role and username
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
        if (!profile) return null;

        const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            username: profile.username,
            role: profile.role as UserRole,
            createdAt: profile.created_at,
            isActive: profile.is_active
        };

        return { user, token: session.access_token };
    }
  },

  analysis: {
    create: async (userId: string, text: string, image?: string, runOcr: boolean = false, runObj: boolean = false): Promise<AnalysisResult> => {
      if (!process.env.API_KEY) {
        throw new Error("Configuration Error: API_KEY is missing.");
      }
      if (!supabase) throw new Error("Database connection missing.");

      const startTime = Date.now();

      try {
        // 1. Run AI Analysis
        const parts: any[] = [];
        let promptText = `Analyze the provided content. Input Context: The text is likely in Sinhala.
        Required Output format: JSON.
        Tasks:
        1. Determine Sentiment ('Positive', 'Negative', 'Neutral').
        2. Detect Sarcasm (true/false).
        3. Detect Humor (true/false).
        `;

        if (runOcr && image) promptText += `4. Extract text (OCR).\n`;
        if (runObj && image) promptText += `5. Detect up to 5 main objects.\n`;

        promptText += `\nInput Text to analyze: "${text || ''}"`;
        parts.push({ text: promptText });

        if (image) {
           const matches = image.match(/^data:(.+);base64,(.+)$/);
           if (matches) {
             parts.push({
               inlineData: { mimeType: matches[1], data: matches[2] }
             });
           }
        }

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] },
            sarcasm: { type: Type.BOOLEAN },
            humor: { type: Type.BOOLEAN },
            ocrText: { type: Type.STRING },
            detectedObjects: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['sentiment', 'sarcasm', 'humor']
        };

        const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: { parts },
           config: {
             responseMimeType: 'application/json',
             responseSchema: responseSchema,
             systemInstruction: "You are an intelligent sentiment analysis engine specialized in Sinhala language social media comments."
           }
        });

        const data = JSON.parse(response.text);

        // 2. Prepare Result Object
        const resultPayload = {
          user_id: userId,
          original_text: text,
          image_url: image ? 'Stored as Base64 (Truncated for DB performance)' : null, // Storing massive base64 in DB is bad practice, usually we upload to Storage bucket
          ocr_text: data.ocrText || (runOcr ? 'No text found' : null),
          detected_objects: data.detectedObjects || [],
          sentiment: data.sentiment,
          sarcasm: data.sarcasm,
          humor: data.humor,
          confidence_score: 0.9,
          processing_time_ms: Date.now() - startTime
        };

        // 3. Save to Supabase Database
        const { data: savedData, error } = await supabase
            .from('analysis_results')
            .insert([resultPayload])
            .select()
            .single();

        if (error) {
            console.error("DB Save Error", error);
            throw new Error("Analysis succeeded but failed to save to history.");
        }

        // Map back to frontend type
        return {
            id: savedData.id,
            userId: savedData.user_id,
            originalText: savedData.original_text,
            imageUrl: image, // Return the original image to UI immediately
            ocrText: savedData.ocr_text,
            detectedObjects: savedData.detected_objects,
            sentiment: savedData.sentiment,
            sarcasm: savedData.sarcasm,
            humor: savedData.humor,
            confidenceScore: savedData.confidence_score,
            timestamp: savedData.timestamp,
            processingTimeMs: savedData.processing_time_ms
        };

      } catch (error: any) {
        console.error("AI Analysis Error:", error);
        throw new Error(error.message || "Analysis failed.");
      }
    },

    getByUser: async (userId: string): Promise<AnalysisResult[]> => {
      if (!supabase) return [];
      
      const { data, error } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) throw new Error(error.message);

      return data.map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        originalText: r.original_text,
        ocrText: r.ocr_text,
        detectedObjects: r.detected_objects,
        sentiment: r.sentiment,
        sarcasm: r.sarcasm,
        humor: r.humor,
        confidenceScore: r.confidence_score,
        timestamp: r.timestamp,
        processingTimeMs: r.processing_time_ms
      }));
    },

    getAll: async (): Promise<AnalysisResult[]> => {
      if (!supabase) return [];
      const { data } = await supabase.from('analysis_results').select('*');
      return data as any || [];
    },

    delete: async (id: string) => {
      if (!supabase) return;
      await supabase.from('analysis_results').delete().eq('id', id);
    }
  },

  admin: {
    getAllUsers: async (): Promise<User[]> => {
      if (!supabase) return [];
      
      // Admin query to get all profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw new Error(error.message);

      return data.map((p: any) => ({
        id: p.id,
        username: p.username,
        email: p.email,
        role: p.role as UserRole,
        createdAt: p.created_at,
        isActive: p.is_active
      }));
    },

    toggleUserStatus: async (userId: string) => {
        if (!supabase) return;
        
        // 1. Get current status
        const { data } = await supabase.from('profiles').select('is_active').eq('id', userId).single();
        if (data) {
            // 2. Toggle
            await supabase.from('profiles').update({ is_active: !data.is_active }).eq('id', userId);
        }
    },

    deleteUser: async (userId: string) => {
       // Note: Deleting from Auth table usually requires Service Role key (backend). 
       // For this client-side demo, we will just delete the profile.
       if (!supabase) return;
       await supabase.from('profiles').delete().eq('id', userId);
    },

    getStats: async (): Promise<SystemStats> => {
      if (!supabase) return {
          totalUsers: 0, totalAnalyses: 0, positiveCount: 0, negativeCount: 0, 
          neutralCount: 0, sarcasmCount: 0, humorCount: 0, activeUsersToday: 0
      };

      // In a real high-scale app, use `count` queries instead of fetching all data.
      const { data: users } = await supabase.from('profiles').select('id');
      const { data: analysis } = await supabase.from('analysis_results').select('*');
      
      const safeAnalysis = analysis || [];

      return {
        totalUsers: users?.length || 0,
        totalAnalyses: safeAnalysis.length,
        positiveCount: safeAnalysis.filter((a: any) => a.sentiment === 'Positive').length,
        negativeCount: safeAnalysis.filter((a: any) => a.sentiment === 'Negative').length,
        neutralCount: safeAnalysis.filter((a: any) => a.sentiment === 'Neutral').length,
        sarcasmCount: safeAnalysis.filter((a: any) => a.sarcasm).length,
        humorCount: safeAnalysis.filter((a: any) => a.humor).length,
        activeUsersToday: 5 // Placeholder as we can't easily track live sessions in Supabase Free tier without addons
      };
    }
  }
};