import { User, UserRole, AnalysisResult, SystemStats, AuthResponse } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION ---
// These are injected by Vite at build time based on your .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_KEY;
const customApiUrl = process.env.VITE_CUSTOM_API_URL;

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseKey && supabaseUrl !== '' && supabaseKey !== '';
const supabase = isSupabaseConfigured ? createClient(supabaseUrl!, supabaseKey!) : null;

// Initialize Gemini API
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

// --- LOCAL STORAGE HELPERS (FALLBACK) ---
const STORAGE_KEYS = {
  USERS: 'cordforge_users',
  RESULTS: 'cordforge_results',
  SESSION: 'cordforge_session'
};

const getLocalData = <T>(key: string): T[] => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

const setLocalData = (key: string, data: any[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API IMPLEMENTATION ---

export const api = {
  status: {
    isDatabaseConfigured: () => isSupabaseConfigured,
    isCustomModelConnected: () => !!customApiUrl,
    checkHealth: async (): Promise<boolean> => {
        if (!supabase) return false;
        try {
            // Check connection by reading profiles count
            const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            return !error;
        } catch {
            return false;
        }
    }
  },

  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      // 1. Try Supabase
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("No user data returned");

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
             console.error("Profile fetch error", profileError);
             // Fallback: Return basic user info if profile table isn't synced yet
             const user: User = {
                id: data.user.id,
                email: data.user.email || '',
                username: data.user.user_metadata?.username || 'User',
                role: (data.user.user_metadata?.role as UserRole) || UserRole.USER,
                createdAt: new Date().toISOString(),
                isActive: true
             };
             return { user, token: data.session?.access_token || '' };
        }
        
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          username: profile.username,
          role: profile.role as UserRole,
          createdAt: profile.created_at,
          isActive: profile.is_active
        };
        return { user, token: data.session?.access_token || '' };
      }

      // 2. Local Fallback
      const users = getLocalData<any>(STORAGE_KEYS.USERS);
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) throw new Error("Invalid credentials (Local Mode)");
      if (!user.isActive) throw new Error("Account is deactivated");

      const sessionUser: User = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          isActive: user.isActive
      };
      
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));

      return { user: sessionUser, token: 'mock-jwt-token' };
    },

    register: async (username: string, email: string, password: string): Promise<User> => {
      // 1. Try Supabase
      if (supabase) {
        // The Trigger in SQL will automatically copy metadata to the 'profiles' table.
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
              role: 'USER' // Default role
            }
          }
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error("Registration failed. Please check your email.");

        return {
          id: data.user.id,
          email,
          username,
          role: UserRole.USER,
          createdAt: new Date().toISOString(),
          isActive: true
        };
      }

      // 2. Local Fallback
      const users = getLocalData<any>(STORAGE_KEYS.USERS);
      if (users.find(u => u.email === email)) throw new Error("User already exists");

      const newUser = {
        id: crypto.randomUUID(),
        email,
        username,
        password,
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      users.push(newUser);
      setLocalData(STORAGE_KEYS.USERS, users);

      const { password: _, ...publicUser } = newUser;
      return publicUser as User;
    },

    requestPasswordReset: async (email: string): Promise<void> => {
      if (supabase) {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/#/reset-password',
        });
      } else {
        console.log(`[Local Mode] Password reset requested for ${email}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    },

    logout: async () => {
      if (supabase) {
        await supabase.auth.signOut();
      } else {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    },

    getSession: async (): Promise<AuthResponse | null> => {
        if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return null;

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            const username = profile?.username || session.user.user_metadata?.username || 'User';
            const role = (profile?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || UserRole.USER;

            const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                username: username,
                role: role,
                createdAt: profile?.created_at || new Date().toISOString(),
                isActive: profile?.is_active ?? true
            };
            return { user, token: session.access_token };
        }

        const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
        if (!sessionStr) return null;
        return { user: JSON.parse(sessionStr), token: 'mock-jwt-token' };
    }
  },

  analysis: {
    create: async (userId: string, text: string, image?: string, runOcr: boolean = false, runObj: boolean = false): Promise<AnalysisResult> => {
      const startTime = Date.now();
      let sentimentData: any;

      try {
        if (customApiUrl) {
           // Custom Model Implementation
           const response = await fetch(customApiUrl, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               text,
               image,
               userId,
               options: { ocr: runOcr, objectDetection: runObj }
             })
           });

           if (!response.ok) throw new Error(`Custom Model Error: ${response.statusText}`);
           sentimentData = await response.json();

        } else if (ai) {
            // Gemini Fallback Implementation
            const parts: any[] = [];
            let promptText = `Analyze this Sinhala content. Return strictly valid JSON.
            Tasks: 1. Sentiment (Positive/Negative/Neutral). 2. Sarcasm (bool). 3. Humor (bool).`;

            if (runOcr && image) promptText += ` 4. Extract text (OCR).`;
            if (runObj && image) promptText += ` 5. Detect main objects.`;
            
            promptText += `\nText: "${text || ''}"`;
            parts.push({ text: promptText });

            if (image) {
              const matches = image.match(/^data:(.+);base64,(.+)$/);
              if (matches) parts.push({ inlineData: { mimeType: matches[1], data: matches[2] } });
            }

            const responseSchema = {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Neutral'] },
                sarcasm: { type: Type.BOOLEAN },
                humor: { type: Type.BOOLEAN },
                ocrText: { type: Type.STRING },
                detectedObjects: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            };

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: { parts },
              config: { responseMimeType: 'application/json', responseSchema }
            });

            sentimentData = JSON.parse(response.text);
        } else {
            // Simple offline mocking
             sentimentData = {
                sentiment: 'Neutral',
                sarcasm: false,
                humor: false,
                ocrText: null,
                detectedObjects: []
             };
        }

        // Common Result Construction
        const resultBase = {
          originalText: text,
          ocrText: sentimentData.ocrText || (runOcr && !sentimentData.ocrText ? 'No text found' : null),
          detectedObjects: sentimentData.detectedObjects || [],
          sentiment: sentimentData.sentiment || 'Neutral',
          sarcasm: sentimentData.sarcasm || false,
          humor: sentimentData.humor || false,
          confidenceScore: sentimentData.confidenceScore || 0.9,
          processingTimeMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        };

        // Persistence - Supabase
        if (supabase) {
            const dbPayload = {
                user_id: userId,
                original_text: resultBase.originalText,
                image_url: image ? 'Stored as Base64 (Truncated for DB)' : null,
                ocr_text: resultBase.ocrText,
                detected_objects: resultBase.detectedObjects,
                sentiment: resultBase.sentiment,
                sarcasm: resultBase.sarcasm,
                humor: resultBase.humor,
                confidence_score: resultBase.confidenceScore,
                processing_time_ms: resultBase.processingTimeMs
            };

            const { data: savedData, error } = await supabase
                .from('analysis_results')
                .insert([dbPayload])
                .select()
                .single();

            if (error) {
                 console.error("Supabase Save Error:", error);
                 return { id: crypto.randomUUID(), userId: userId, imageUrl: image, ...resultBase };
            }

            return { id: savedData.id, userId: savedData.user_id, imageUrl: image, ...resultBase };
        }

        // Persistence - Local Storage
        const newResult: AnalysisResult = {
            id: crypto.randomUUID(),
            userId: userId,
            imageUrl: image,
            ...resultBase
        };

        const results = getLocalData<AnalysisResult>(STORAGE_KEYS.RESULTS);
        results.unshift(newResult);
        if (results.length > 20) results.pop(); 
        setLocalData(STORAGE_KEYS.RESULTS, results);

        return newResult;

      } catch (error: any) {
        console.error("Analysis Error:", error);
        throw new Error(error.message || "Analysis failed.");
      }
    },

    getByUser: async (userId: string): Promise<AnalysisResult[]> => {
      if (supabase) {
        const { data, error } = await supabase
          .from('analysis_results')
          .select('*')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false });

        if (error) return [];

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
      }

      const results = getLocalData<AnalysisResult>(STORAGE_KEYS.RESULTS);
      return results.filter(r => r.userId === userId);
    },
  },

  admin: {
    getAllUsers: async (): Promise<User[]> => {
      if (supabase) {
        // Admin RLS policy allows selecting all profiles
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Admin: Error fetching users", error);
            throw new Error(error.message);
        }
        return data.map((p: any) => ({
          id: p.id,
          username: p.username,
          email: p.email,
          role: p.role as UserRole,
          createdAt: p.created_at,
          isActive: p.is_active
        }));
      }
      
      const users = getLocalData<any>(STORAGE_KEYS.USERS);
      return users.map(({ password, ...u }) => u as User);
    },

    toggleUserStatus: async (userId: string) => {
      if (supabase) {
        const { data } = await supabase.from('profiles').select('is_active').eq('id', userId).single();
        if (data) {
            await supabase.from('profiles').update({ is_active: !data.is_active }).eq('id', userId);
        }
      } else {
        const users = getLocalData<any>(STORAGE_KEYS.USERS);
        const user = users.find(u => u.id === userId);
        if (user) {
            user.isActive = !user.isActive;
            setLocalData(STORAGE_KEYS.USERS, users);
        }
      }
    },

    deleteUser: async (userId: string) => {
       if (supabase) {
         // This deletes from profiles, but due to FK constraint it might require cascade or calling auth.admin.deleteUser (which requires Service Role key, unsafe for frontend).
         // Safe approach for frontend: Delete profile, let cascade handle (if configured) or just soft delete.
         // For this setup, we just delete the profile row.
         await supabase.from('profiles').delete().eq('id', userId);
       } else {
         const users = getLocalData<any>(STORAGE_KEYS.USERS);
         const newUsers = users.filter(u => u.id !== userId);
         setLocalData(STORAGE_KEYS.USERS, newUsers);
       }
    },

    getStats: async (): Promise<SystemStats> => {
      if (supabase) {
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        
        // Admin RLS policy allows selecting all analysis results
        const { data: analysis, error } = await supabase.from('analysis_results').select('sentiment, sarcasm, humor');
        
        if (error) console.error("Admin Stats Error", error);
        
        const safeAnalysis = analysis || [];
        
        return {
          totalUsers: userCount || 0,
          totalAnalyses: safeAnalysis.length,
          positiveCount: safeAnalysis.filter((a: any) => a.sentiment === 'Positive').length,
          negativeCount: safeAnalysis.filter((a: any) => a.sentiment === 'Negative').length,
          neutralCount: safeAnalysis.filter((a: any) => a.sentiment === 'Neutral').length,
          sarcasmCount: safeAnalysis.filter((a: any) => a.sarcasm).length,
          humorCount: safeAnalysis.filter((a: any) => a.humor).length,
          activeUsersToday: Math.max(1, Math.floor((userCount || 0) * 0.2)) // Mocking 'active today' for now
        };
      } else {
        const users = getLocalData<any>(STORAGE_KEYS.USERS);
        const analysis = getLocalData<any>(STORAGE_KEYS.RESULTS);
        return {
          totalUsers: users.length,
          totalAnalyses: analysis.length,
          positiveCount: analysis.filter((a: any) => a.sentiment === 'Positive').length,
          negativeCount: analysis.filter((a: any) => a.sentiment === 'Negative').length,
          neutralCount: analysis.filter((a: any) => a.sentiment === 'Neutral').length,
          sarcasmCount: analysis.filter((a: any) => a.sarcasm).length,
          humorCount: analysis.filter((a: any) => a.humor).length,
          activeUsersToday: Math.max(1, Math.floor(users.length * 0.2))
        };
      }
    }
  }
};
