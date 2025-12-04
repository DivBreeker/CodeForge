export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  originalText: string;
  imageUrl?: string; // Base64 or URL
  ocrText?: string;
  detectedObjects?: string[];
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  sarcasm: boolean;
  humor: boolean;
  confidenceScore: number;
  timestamp: string;
  processingTimeMs: number;
}

export interface SystemStats {
  totalUsers: number;
  totalAnalyses: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  sarcasmCount: number;
  humorCount: number;
  activeUsersToday: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
}