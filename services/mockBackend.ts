import { User, UserRole, AnalysisResult, SystemStats, AuthResponse } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// Keys for LocalStorage
const USERS_KEY = 'cordforge_users';
const ANALYSIS_KEY = 'cordforge_analysis';
const SESSION_KEY = 'cordforge_session';

// Initialize Gemini API
// We assume process.env.API_KEY is available in the environment
// NOTE: For live deployment, ensure your build tool (like Vite) exposes this variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to delay response (simulate network for auth operations)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initial Admin User
const seedAdmin = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!users.find((u: User) => u.email === 'admin@cordforge.com')) {
    const admin: User & { password: string } = {
      id: 'admin-1',
      username: 'SystemAdmin',
      email: 'admin@cordforge.com',
      password: 'admin', // In real app, hash this
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    users.push(admin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
};

seedAdmin();

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      await delay(800);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) throw new Error('Invalid credentials');
      if (!user.isActive) throw new Error('Account is deactivated');

      const { password: _, ...userWithoutPass } = user;
      const token = `fake-jwt-${Date.now()}`;
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: userWithoutPass, token }));
      
      return { user: userWithoutPass, token };
    },

    register: async (username: string, email: string, password: string): Promise<User> => {
      await delay(800);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      if (users.find((u: any) => u.email === email)) throw new Error('Email already exists');
      if (users.find((u: any) => u.username === username)) throw new Error('Username already exists');

      const newUser = {
        id: `user-${Date.now()}`,
        username,
        email,
        password, // In real app, hash this
        role: UserRole.USER,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      const { password: _, ...safeUser } = newUser;
      return safeUser;
    },

    requestPasswordReset: async (email: string): Promise<void> => {
      await delay(1000);
      // In a real app, check if email exists and send email
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find((u: any) => u.email === email);
      if (!user) {
        // Security best practice: Don't reveal if user exists or not, but for mock let's just resolve
        return; 
      }
      return;
    },

    logout: async () => {
      localStorage.removeItem(SESSION_KEY);
    },

    getSession: (): AuthResponse | null => {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    }
  },

  analysis: {
    create: async (userId: string, text: string, image?: string, runOcr: boolean = false, runObj: boolean = false): Promise<AnalysisResult> => {
      // Safety check for deployment: Ensure API Key is present
      if (!process.env.API_KEY) {
        throw new Error("Configuration Error: API_KEY is missing in your environment variables. Please check your hosting settings.");
      }

      const startTime = Date.now();

      try {
        // Prepare contents for Gemini
        const parts: any[] = [];
        
        // Construct a strong system prompt within the request
        let promptText = `Analyze the provided content. 
        Input Context: The text is likely in Sinhala.
        
        Required Output format: JSON
        
        Tasks:
        1. Determine Sentiment ('Positive', 'Negative', 'Neutral').
        2. Detect Sarcasm (true/false).
        3. Detect Humor (true/false).
        `;

        if (runOcr && image) {
          promptText += `4. Extract text from the image (OCR). If none, return empty string.\n`;
        }
        if (runObj && image) {
          promptText += `5. Detect up to 5 main objects in the image.\n`;
        }

        promptText += `\nInput Text to analyze: "${text || ''}"`;
        
        parts.push({ text: promptText });

        // Handle Image
        if (image) {
           // Parse base64 string: "data:image/png;base64,....."
           const matches = image.match(/^data:(.+);base64,(.+)$/);
           if (matches) {
             parts.push({
               inlineData: {
                 mimeType: matches[1],
                 data: matches[2]
               }
             });
           }
        }

        // Define strict output schema
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

        // Call Gemini API
        const response = await ai.models.generateContent({
           model: 'gemini-2.5-flash',
           contents: { parts },
           config: {
             responseMimeType: 'application/json',
             responseSchema: responseSchema,
             systemInstruction: "You are an intelligent sentiment analysis engine specialized in Sinhala language social media comments. You understand slang, cultural references, sarcasm, and humor. Always return valid JSON."
           }
        });

        const data = JSON.parse(response.text);

        const result: AnalysisResult = {
          id: `anl-${Date.now()}`,
          userId,
          originalText: text,
          imageUrl: image,
          ocrText: data.ocrText || (runOcr ? 'No text found' : undefined),
          detectedObjects: data.detectedObjects || [],
          sentiment: data.sentiment as any,
          sarcasm: data.sarcasm,
          humor: data.humor,
          confidenceScore: 0.9, // Gemini is highly capable
          timestamp: new Date().toISOString(),
          processingTimeMs: Date.now() - startTime
        };

        // Save to "Database" (LocalStorage)
        const allAnalysis = JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');
        allAnalysis.unshift(result); 
        localStorage.setItem(ANALYSIS_KEY, JSON.stringify(allAnalysis));

        return result;

      } catch (error: any) {
        console.error("AI Analysis Error:", error);
        // Fallback for demo if API key is missing or invalid
        throw new Error(error.message || "Analysis failed. Please check your network connection.");
      }
    },

    getByUser: async (userId: string): Promise<AnalysisResult[]> => {
      await delay(300); // Small delay for realism
      const all = JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');
      return all.filter((r: AnalysisResult) => r.userId === userId);
    },

    getAll: async (): Promise<AnalysisResult[]> => {
      await delay(300);
      return JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');
    },

    delete: async (id: string) => {
      await delay(300);
      let all = JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');
      all = all.filter((r: AnalysisResult) => r.id !== id);
      localStorage.setItem(ANALYSIS_KEY, JSON.stringify(all));
    }
  },

  admin: {
    getAllUsers: async (): Promise<User[]> => {
      await delay(500);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      return users.map((u: any) => {
        const { password, ...rest } = u;
        return rest;
      });
    },

    toggleUserStatus: async (userId: string) => {
      await delay(300);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const userIndex = users.findIndex((u: User) => u.id === userId);
      if (userIndex > -1) {
        users[userIndex].isActive = !users[userIndex].isActive;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    },

    deleteUser: async (userId: string) => {
      await delay(300);
      let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      users = users.filter((u: User) => u.id !== userId);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    getStats: async (): Promise<SystemStats> => {
      await delay(500);
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const analysis = JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');

      return {
        totalUsers: users.length,
        totalAnalyses: analysis.length,
        positiveCount: analysis.filter((a: AnalysisResult) => a.sentiment === 'Positive').length,
        negativeCount: analysis.filter((a: AnalysisResult) => a.sentiment === 'Negative').length,
        neutralCount: analysis.filter((a: AnalysisResult) => a.sentiment === 'Neutral').length,
        sarcasmCount: analysis.filter((a: AnalysisResult) => a.sarcasm).length,
        humorCount: analysis.filter((a: AnalysisResult) => a.humor).length,
        activeUsersToday: Math.floor(users.length * 0.4) // Simulated
      };
    }
  }
};