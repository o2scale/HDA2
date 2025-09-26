import { create } from 'zustand';

export interface ProcessingJob {
  id: string;
  documentName: string;
  progress: number;
  timeRemaining: string;
  status: 'processing' | 'paused' | 'completed' | 'error';
  type: 'extraction' | 'translation';
}

export interface Document {
  id: string;
  title: string;
  status: 'processing' | 'ready' | 'verified';
  lastModified: string;
  thumbnail: string;
  size: string;
}

export interface QueueStats {
  pending: number;
  processing: number;
  completedToday: number;
}

export interface QualityMetrics {
  averageAccuracy: number;
  textExtractionQuality: number;
  translationQuality: number;
  documentsVerified: number;
}

export interface SystemHealth {
  geminiStatus: 'online' | 'offline';
  openaiStatus: 'online' | 'offline';
  supabaseStatus: 'online' | 'offline';
  quotaUsage: number;
  activeUsers: number;
  lastSync: string;
}

interface DashboardState {
  processingJobs: ProcessingJob[];
  recentDocuments: Document[];
  queueStats: QueueStats;
  qualityMetrics: QualityMetrics;
  systemHealth: SystemHealth;
  isLoading: boolean;
  
  // Actions
  pauseJob: (jobId: string) => void;
  cancelJob: (jobId: string) => void;
  setLoading: (loading: boolean) => void;
}

// Mock data for demonstration
const mockProcessingJobs: ProcessingJob[] = [
  {
    id: '1',
    documentName: 'Technical_Manual_v2.pdf',
    progress: 75,
    timeRemaining: '2m 30s',
    status: 'processing',
    type: 'extraction'
  },
  {
    id: '2',
    documentName: 'Legal_Contract_DE.docx',
    progress: 45,
    timeRemaining: '5m 12s',
    status: 'processing',
    type: 'translation'
  },
  {
    id: '3',
    documentName: 'Marketing_Brochure.pdf',
    progress: 90,
    timeRemaining: '1m 05s',
    status: 'processing',
    type: 'extraction'
  }
];

const mockRecentDocuments: Document[] = [
  {
    id: '1',
    title: 'Product_Specification.pdf',
    status: 'verified',
    lastModified: '2 hours ago',
    thumbnail: '/api/placeholder/150/100',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'User_Manual_FR.docx',
    status: 'ready',
    lastModified: '4 hours ago',
    thumbnail: '/api/placeholder/150/100',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Financial_Report_Q3.pdf',
    status: 'processing',
    lastModified: '6 hours ago',
    thumbnail: '/api/placeholder/150/100',
    size: '5.2 MB'
  },
  {
    id: '4',
    title: 'Technical_Guide_ES.pdf',
    status: 'verified',
    lastModified: '1 day ago',
    thumbnail: '/api/placeholder/150/100',
    size: '3.1 MB'
  }
];

export const useDashboardStore = create<DashboardState>((set) => ({
  processingJobs: mockProcessingJobs,
  recentDocuments: mockRecentDocuments,
  queueStats: {
    pending: 12,
    processing: 3,
    completedToday: 27
  },
  qualityMetrics: {
    averageAccuracy: 96,
    textExtractionQuality: 94,
    translationQuality: 98,
    documentsVerified: 145
  },
  systemHealth: {
    geminiStatus: 'online',
    openaiStatus: 'online',
    supabaseStatus: 'online',
    quotaUsage: 67,
    activeUsers: 24,
    lastSync: '2 minutes ago'
  },
  isLoading: false,

  pauseJob: (jobId: string) =>
    set((state) => ({
      processingJobs: state.processingJobs.map((job) =>
        job.id === jobId ? { ...job, status: job.status === 'processing' ? 'paused' : 'processing' } : job
      )
    })),

  cancelJob: (jobId: string) =>
    set((state) => ({
      processingJobs: state.processingJobs.filter((job) => job.id !== jobId)
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading })
}));