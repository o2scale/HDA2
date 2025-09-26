import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'ready' | 'processing' | 'error' | 'complete';
  progress: number;
  error?: string;
  pageCount?: number;
  pages?: PageInfo[];
}

export interface PageInfo {
  id: string;
  pageNumber: number;
  thumbnail: string;
  language?: string;
  selected: boolean;
}

export interface UploadSettings {
  autoDetectLanguage: boolean;
  selectedLanguages: string[];
  extractionQuality: 'fast' | 'balanced' | 'maximum';
  confidenceThreshold: number;
  imagePreprocessing: {
    deskew: boolean;
    denoise: boolean;
    contrastEnhancement: boolean;
  };
  pageOrientation: 'auto' | 'portrait' | 'landscape';
  addToBatch: boolean;
  batchName: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  processImmediately: boolean;
  scheduledTime?: Date;
  selectedTemplate?: string;
}

export interface CostEstimate {
  totalCost: number;
  processingTime: number;
  queuePosition: number;
}

interface UploadState {
  files: UploadedFile[];
  settings: UploadSettings;
  costEstimate: CostEstimate;
  isProcessing: boolean;
  dragActive: boolean;
  
  // Actions
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  updateFileStatus: (fileId: string, status: UploadedFile['status'], progress?: number, error?: string) => void;
  updateSettings: (settings: Partial<UploadSettings>) => void;
  togglePageSelection: (fileId: string, pageId: string) => void;
  selectAllPages: (fileId: string) => void;
  setDragActive: (active: boolean) => void;
  calculateCost: () => void;
  processFiles: () => void;
  resetUpload: () => void;
}

const defaultSettings: UploadSettings = {
  autoDetectLanguage: true,
  selectedLanguages: ['english'],
  extractionQuality: 'balanced',
  confidenceThreshold: 85,
  imagePreprocessing: {
    deskew: true,
    denoise: false,
    contrastEnhancement: true,
  },
  pageOrientation: 'auto',
  addToBatch: false,
  batchName: '',
  priority: 'normal',
  processImmediately: true,
};

export const useUploadStore = create<UploadState>()(
  persist(
    (set, get) => ({
      files: [],
      settings: defaultSettings,
      costEstimate: {
        totalCost: 0,
        processingTime: 0,
        queuePosition: 1,
      },
      isProcessing: false,
      dragActive: false,

      addFiles: (newFiles: File[]) => {
        const files = newFiles.map((file) => ({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          status: 'uploading' as const,
          progress: 0,
          pageCount: file.type === 'application/pdf' ? Math.floor(Math.random() * 20) + 1 : 1,
        }));
        
        set((state) => ({
          files: [...state.files, ...files]
        }));
        
        // Simulate upload progress
        files.forEach((file) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              clearInterval(interval);
              get().updateFileStatus(file.id, 'ready');
            } else {
              get().updateFileStatus(file.id, 'uploading', progress);
            }
          }, 200);
        });
        
        get().calculateCost();
      },

      removeFile: (fileId: string) =>
        set((state) => {
          const file = state.files.find(f => f.id === fileId);
          if (file) {
            URL.revokeObjectURL(file.preview);
          }
          return {
            files: state.files.filter((f) => f.id !== fileId)
          };
        }),

      updateFileStatus: (fileId: string, status: UploadedFile['status'], progress?: number, error?: string) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId
              ? { ...file, status, progress: progress ?? file.progress, error }
              : file
          )
        })),

      updateSettings: (newSettings: Partial<UploadSettings>) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        }));
        get().calculateCost();
      },

      togglePageSelection: (fileId: string, pageId: string) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId && file.pages
              ? {
                  ...file,
                  pages: file.pages.map((page) =>
                    page.id === pageId ? { ...page, selected: !page.selected } : page
                  )
                }
              : file
          )
        })),

      selectAllPages: (fileId: string) =>
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId && file.pages
              ? {
                  ...file,
                  pages: file.pages.map((page) => ({ ...page, selected: true }))
                }
              : file
          )
        })),

      setDragActive: (active: boolean) => set({ dragActive: active }),

      calculateCost: () => {
        const { files, settings } = get();
        const totalPages = files.reduce((acc, file) => acc + (file.pageCount || 1), 0);
        
        let costPerPage = 0.05; // Base cost
        if (settings.extractionQuality === 'maximum') costPerPage *= 2;
        if (settings.extractionQuality === 'fast') costPerPage *= 0.5;
        if (settings.priority === 'urgent') costPerPage *= 3;
        if (settings.priority === 'high') costPerPage *= 1.5;
        
        const totalCost = totalPages * costPerPage;
        const processingTime = totalPages * (settings.extractionQuality === 'maximum' ? 30 : settings.extractionQuality === 'fast' ? 10 : 20);
        
        set({
          costEstimate: {
            totalCost,
            processingTime,
            queuePosition: settings.priority === 'urgent' ? 1 : settings.priority === 'high' ? 3 : 5
          }
        });
      },

      processFiles: () => {
        set({ isProcessing: true });
        // Simulate processing
        setTimeout(() => {
          set({ isProcessing: false });
        }, 2000);
      },

      resetUpload: () => {
        get().files.forEach(file => URL.revokeObjectURL(file.preview));
        set({
          files: [],
          isProcessing: false,
          dragActive: false,
        });
      },
    }),
    {
      name: 'upload-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);