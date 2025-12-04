import { User, UserRole, AnalysisResult, SystemStats, AuthResponse } from '../types';

// Keys for LocalStorage
const USERS_KEY = 'cordforge_users';
const ANALYSIS_KEY = 'cordforge_analysis';
const SESSION_KEY = 'cordforge_session';

// Helper to delay response (simulate network)
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
      await delay(2000); // Simulate ML processing time

      // Stub Logic for Simulation based on SRS
      const isSinhala = /[\u0D80-\u0DFF]+/.test(text);
      
      const sentiment = Math.random() > 0.6 ? 'Positive' : Math.random() > 0.3 ? 'Negative' : 'Neutral';
      const sarcasm = Math.random() > 0.7;
      const humor = Math.random() > 0.7;

      let ocrText = '';
      let detectedObjects: string[] = [];

      if (runOcr && image) {
        ocrText = "Sample Sinhala OCR Text: මේක හරිම පුදුම වැඩක්"; // Simulated OCR output
      }

      if (runObj && image) {
        detectedObjects = ['Person', 'Mobile Phone', 'Indoor']; // Simulated Object Detection
      }

      const result: AnalysisResult = {
        id: `anl-${Date.now()}`,
        userId,
        originalText: text,
        imageUrl: image,
        ocrText,
        detectedObjects,
        sentiment,
        sarcasm,
        humor,
        confidenceScore: 0.85 + (Math.random() * 0.14),
        timestamp: new Date().toISOString(),
        processingTimeMs: 1200 + Math.floor(Math.random() * 2000)
      };

      const allAnalysis = JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');
      allAnalysis.unshift(result); // Add to top
      localStorage.setItem(ANALYSIS_KEY, JSON.stringify(allAnalysis));

      return result;
    },

    getByUser: async (userId: string): Promise<AnalysisResult[]> => {
      await delay(500);
      const all = JSON.parse(localStorage.getItem(ANALYSIS_KEY) || '[]');
      return all.filter((r: AnalysisResult) => r.userId === userId);
    },

    getAll: async (): Promise<AnalysisResult[]> => {
      await delay(500);
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