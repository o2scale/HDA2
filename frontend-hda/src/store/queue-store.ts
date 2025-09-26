import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProcessingStatus = 'queued' | 'text-processing' | 'translating' | 'in-review' | 'completed' | 'failed';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type ViewMode = 'kanban' | 'list';

export interface DocumentTask {
  id: string;
  filename: string;
  fileSize: number;
  pageCount: number;
  language: string;
  targetLanguage?: string;
  status: ProcessingStatus;
  priority: Priority;
  progress: number;
  queuePosition?: number;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  thumbnail: string;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  error?: string;
  selected?: boolean;
}

export interface FilterState {
  search: string;
  status: ProcessingStatus | 'all';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  languages: string[];
  fileTypes: string[];
  owners: string[];
  priorities: Priority[];
}

export interface QueueMetrics {
  totalWorkers: number;
  activeWorkers: number;
  averageProcessingTime: number;
  queuedCount: number;
  processingCount: number;
  completedToday: number;
  failedCount: number;
}

interface QueueState {
  // Data
  tasks: DocumentTask[];
  viewMode: ViewMode;
  filters: FilterState;
  metrics: QueueMetrics;
  selectedTasks: string[];
  isConnected: boolean;
  
  // Filter presets
  savedFilters: { name: string; filters: FilterState }[];
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setSelectedTasks: (taskIds: string[]) => void;
  toggleTaskSelection: (taskId: string) => void;
  
  // Task management
  updateTaskStatus: (taskId: string, status: ProcessingStatus) => void;
  updateTaskProgress: (taskId: string, progress: number) => void;
  updateTaskPriority: (taskId: string, priority: Priority) => void;
  pauseTask: (taskId: string) => void;
  resumeTask: (taskId: string) => void;
  cancelTask: (taskId: string) => void;
  
  // Bulk actions
  pauseAllTasks: () => void;
  resumeAllTasks: () => void;
  clearCompleted: () => void;
  changePriorityBulk: (taskIds: string[], priority: Priority) => void;
  
  // Real-time simulation
  simulateRealTimeUpdates: () => void;
  stopSimulation: () => void;
}

const defaultFilters: FilterState = {
  search: '',
  status: 'all',
  dateRange: { start: null, end: null },
  languages: [],
  fileTypes: [],
  owners: [],
  priorities: []
};

// Mock data
const mockTasks: DocumentTask[] = [
  {
    id: '1',
    filename: 'Annual_Report_2024.pdf',
    fileSize: 2400000,
    pageCount: 45,
    language: 'English',
    targetLanguage: 'Hindi',
    status: 'text-processing',
    priority: 'high',
    progress: 67,
    owner: {
      id: 'user1',
      name: 'Sarah Wilson',
      avatar: '/placeholder.svg'
    },
    thumbnail: '/placeholder.svg',
    startedAt: new Date(Date.now() - 1200000),
    estimatedCompletion: new Date(Date.now() + 300000)
  },
  {
    id: '2',
    filename: 'Marketing_Strategy.docx',
    fileSize: 890000,
    pageCount: 12,
    language: 'English',
    targetLanguage: 'Spanish',
    status: 'queued',
    priority: 'normal',
    progress: 0,
    queuePosition: 3,
    owner: {
      id: 'user2',
      name: 'John Chen',
      avatar: '/placeholder.svg'
    },
    thumbnail: '/placeholder.svg'
  },
  {
    id: '3',
    filename: 'Legal_Contract_Draft.pdf',
    fileSize: 1200000,
    pageCount: 8,
    language: 'Hindi',
    targetLanguage: 'English',
    status: 'translating',
    priority: 'urgent',
    progress: 34,
    owner: {
      id: 'user3',
      name: 'Priya Sharma',
      avatar: '/placeholder.svg'
    },
    thumbnail: '/placeholder.svg',
    startedAt: new Date(Date.now() - 800000),
    estimatedCompletion: new Date(Date.now() + 600000)
  },
  {
    id: '4',
    filename: 'Product_Manual_v2.pdf',
    fileSize: 3200000,
    pageCount: 67,
    language: 'English',
    targetLanguage: 'German',
    status: 'in-review',
    priority: 'normal',
    progress: 100,
    owner: {
      id: 'user4',
      name: 'Mike Johnson',
      avatar: '/placeholder.svg'
    },
    thumbnail: '/placeholder.svg',
    startedAt: new Date(Date.now() - 2400000),
    completedAt: new Date(Date.now() - 300000)
  },
  {
    id: '5',
    filename: 'Meeting_Notes_Q4.docx',
    fileSize: 450000,
    pageCount: 5,
    language: 'English',
    targetLanguage: 'French',
    status: 'completed',
    priority: 'low',
    progress: 100,
    owner: {
      id: 'user1',
      name: 'Sarah Wilson',
      avatar: '/placeholder.svg'
    },
    thumbnail: '/placeholder.svg',
    startedAt: new Date(Date.now() - 3600000),
    completedAt: new Date(Date.now() - 600000)
  }
];

const mockMetrics: QueueMetrics = {
  totalWorkers: 10,
  activeWorkers: 7,
  averageProcessingTime: 15,
  queuedCount: 12,
  processingCount: 8,
  completedToday: 34,
  failedCount: 2
};

let simulationInterval: NodeJS.Timeout | null = null;

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: mockTasks,
      viewMode: 'kanban',
      filters: defaultFilters,
      metrics: mockMetrics,
      selectedTasks: [],
      isConnected: true,
      savedFilters: [],
      
      // View and filter actions
      setViewMode: (mode) => set({ viewMode: mode }),
      
      updateFilters: (newFilters) => 
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      
      clearFilters: () => set({ filters: defaultFilters }),
      
      setSelectedTasks: (taskIds) => set({ selectedTasks: taskIds }),
      
      toggleTaskSelection: (taskId) =>
        set((state) => ({
          selectedTasks: state.selectedTasks.includes(taskId)
            ? state.selectedTasks.filter(id => id !== taskId)
            : [...state.selectedTasks, taskId]
        })),
      
      // Task management
      updateTaskStatus: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId 
              ? { 
                  ...task, 
                  status,
                  ...(status === 'completed' && { completedAt: new Date() }),
                  ...(status === 'text-processing' || status === 'translating' ? { startedAt: new Date() } : {})
                } 
              : task
          )
        })),
      
      updateTaskProgress: (taskId, progress) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, progress } : task
          )
        })),
      
      updateTaskPriority: (taskId, priority) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === taskId ? { ...task, priority } : task
          )
        })),
      
      pauseTask: (taskId) => {
        // Implementation for pausing task
        console.log('Pausing task:', taskId);
      },
      
      resumeTask: (taskId) => {
        // Implementation for resuming task
        console.log('Resuming task:', taskId);
      },
      
      cancelTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== taskId)
        })),
      
      // Bulk actions
      pauseAllTasks: () => {
        console.log('Pausing all tasks');
      },
      
      resumeAllTasks: () => {
        console.log('Resuming all tasks');
      },
      
      clearCompleted: () =>
        set((state) => ({
          tasks: state.tasks.filter(task => task.status !== 'completed')
        })),
      
      changePriorityBulk: (taskIds, priority) =>
        set((state) => ({
          tasks: state.tasks.map(task =>
            taskIds.includes(task.id) ? { ...task, priority } : task
          )
        })),
      
      // Real-time simulation
      simulateRealTimeUpdates: () => {
        if (simulationInterval) return;
        
        simulationInterval = setInterval(() => {
          const state = get();
          const processingTasks = state.tasks.filter(
            task => task.status === 'text-processing' || task.status === 'translating'
          );
          
          if (processingTasks.length > 0) {
            const randomTask = processingTasks[Math.floor(Math.random() * processingTasks.length)];
            const newProgress = Math.min(100, randomTask.progress + Math.random() * 15);
            
            if (newProgress >= 100) {
              const nextStatus = randomTask.status === 'text-processing' ? 'translating' : 'in-review';
              get().updateTaskStatus(randomTask.id, nextStatus);
            } else {
              get().updateTaskProgress(randomTask.id, newProgress);
            }
          }
        }, 2000);
      },
      
      stopSimulation: () => {
        if (simulationInterval) {
          clearInterval(simulationInterval);
          simulationInterval = null;
        }
      }
    }),
    {
      name: 'queue-settings',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
        savedFilters: state.savedFilters
      })
    }
  )
);