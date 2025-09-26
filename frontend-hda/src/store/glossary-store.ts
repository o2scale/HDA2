import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { z } from 'zod';

export type TermStatus = 'active' | 'review' | 'deprecated';
export type TermDomain = 'religious' | 'technical' | 'general' | 'medical' | 'legal' | 'business';

export interface Translation {
  id: string;
  language: string;
  text: string;
  priority: number; // 1 = highest priority
  context?: string;
  verified: boolean;
}

export interface UsageExample {
  id: string;
  documentId: string;
  documentName: string;
  sourceText: string;
  translatedText: string;
  context: string;
  pageNumber?: number;
}

export interface GlossaryTerm {
  id: string;
  sourceTerm: string;
  sourceLanguage: string;
  translations: Translation[];
  domain: TermDomain[];
  usageCount: number;
  confidenceScore: number;
  status: TermStatus;
  definition?: string;
  notes?: string;
  partOfSpeech?: string;
  phonetic?: string;
  usageExamples: UsageExample[];
  tags: string[];
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  version: number;
  
  // Relations
  synonyms: string[]; // term IDs
  antonyms: string[]; // term IDs
  seeAlso: string[]; // term IDs
}

export interface GlossaryFilter {
  search: string;
  domain: TermDomain | 'all';
  status: TermStatus | 'all';
  sourceLanguage: string | 'all';
  targetLanguage: string | 'all';
  tags: string[];
  confidence: [number, number]; // min, max
}

export interface ConflictResolution {
  conflictId: string;
  termA: GlossaryTerm;
  termB: GlossaryTerm;
  conflictType: 'duplicate' | 'similar' | 'contradiction';
  resolution?: 'merge' | 'priority' | 'context-rule' | 'review';
  resolvedBy?: string;
  resolvedAt?: Date;
}

interface GlossaryState {
  // Data
  terms: GlossaryTerm[];
  selectedTermId: string | null;
  filters: GlossaryFilter;
  conflicts: ConflictResolution[];
  
  // UI State
  isAddModalOpen: boolean;
  isImportModalOpen: boolean;
  isHistoryModalOpen: boolean;
  selectedTermIds: string[];
  sortField: keyof GlossaryTerm;
  sortDirection: 'asc' | 'desc';
  
  // Actions
  setSelectedTerm: (termId: string | null) => void;
  updateFilters: (filters: Partial<GlossaryFilter>) => void;
  clearFilters: () => void;
  
  // Term management
  addTerm: (term: Omit<GlossaryTerm, 'id' | 'createdAt' | 'modifiedAt' | 'version'>) => Promise<string>;
  updateTerm: (termId: string, updates: Partial<GlossaryTerm>) => Promise<void>;
  deleteTerm: (termId: string) => Promise<void>;
  deleteTerms: (termIds: string[]) => Promise<void>;
  
  // Translation management
  addTranslation: (termId: string, translation: Omit<Translation, 'id'>) => Promise<void>;
  updateTranslation: (termId: string, translationId: string, updates: Partial<Translation>) => Promise<void>;
  deleteTranslation: (termId: string, translationId: string) => Promise<void>;
  
  // Bulk operations
  bulkUpdateStatus: (termIds: string[], status: TermStatus) => Promise<void>;
  bulkUpdateDomain: (termIds: string[], domain: TermDomain[]) => Promise<void>;
  bulkDelete: (termIds: string[]) => Promise<void>;
  
  // Import/Export
  importTerms: (file: File) => Promise<{ success: number; errors: string[] }>;
  exportTerms: (format: 'csv' | 'json' | 'tmx') => Promise<Blob>;
  
  // Conflict resolution
  detectConflicts: () => Promise<ConflictResolution[]>;
  resolveConflict: (conflictId: string, resolution: ConflictResolution['resolution']) => Promise<void>;
  
  // Search and filtering
  searchTerms: (query: string) => GlossaryTerm[];
  getFilteredTerms: () => GlossaryTerm[];
  
  // UI actions
  toggleAddModal: () => void;
  toggleImportModal: () => void;
  toggleHistoryModal: () => void;
  setSelectedTermIds: (termIds: string[]) => void;
  toggleTermSelection: (termId: string) => void;
  setSorting: (field: keyof GlossaryTerm, direction: 'asc' | 'desc') => void;
}

// Validation schemas
export const translationSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  text: z.string().min(1, 'Translation is required'),
  priority: z.number().min(1).max(10),
  context: z.string().optional(),
  verified: z.boolean().default(false)
});

export const glossaryTermSchema = z.object({
  sourceTerm: z.string().min(1, 'Source term is required'),
  sourceLanguage: z.string().min(1, 'Source language is required'),
  translations: z.array(translationSchema).min(1, 'At least one translation is required'),
  domain: z.array(z.enum(['religious', 'technical', 'general', 'medical', 'legal', 'business'])),
  definition: z.string().optional(),
  notes: z.string().optional(),
  partOfSpeech: z.string().optional(),
  phonetic: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['active', 'review', 'deprecated']).default('active')
});

// Mock data
const mockTerms: GlossaryTerm[] = [
  {
    id: '1',
    sourceTerm: 'गणेश',
    sourceLanguage: 'Hindi',
    translations: [
      {
        id: 't1',
        language: 'English',
        text: 'Ganesha',
        priority: 1,
        context: 'Religious context',
        verified: true
      },
      {
        id: 't2',
        language: 'English',
        text: 'Ganesh',
        priority: 2,
        context: 'Common usage',
        verified: true
      }
    ],
    domain: ['religious'],
    usageCount: 45,
    confidenceScore: 98,
    status: 'active',
    definition: 'Hindu deity with elephant head, remover of obstacles',
    partOfSpeech: 'Proper Noun',
    phonetic: 'gə-ˈnēsh',
    usageExamples: [],
    tags: ['deity', 'hinduism', 'elephant'],
    createdBy: 'sarah.wilson',
    createdAt: new Date('2024-01-15'),
    modifiedBy: 'john.chen',
    modifiedAt: new Date('2024-02-20'),
    version: 3,
    synonyms: [],
    antonyms: [],
    seeAlso: ['2']
  },
  {
    id: '2',
    sourceTerm: 'चतुर्थी',
    sourceLanguage: 'Hindi',
    translations: [
      {
        id: 't3',
        language: 'English',
        text: 'Chaturthi',
        priority: 1,
        context: 'Calendar/religious',
        verified: true
      },
      {
        id: 't4',
        language: 'English',
        text: 'Fourth day',
        priority: 2,
        context: 'Literal translation',
        verified: false
      }
    ],
    domain: ['religious', 'technical'],
    usageCount: 23,
    confidenceScore: 89,
    status: 'active',
    definition: 'Fourth day of lunar month in Hindu calendar',
    partOfSpeech: 'Noun',
    phonetic: 'chə-ˈtʊr-thiː',
    usageExamples: [],
    tags: ['calendar', 'time', 'lunar'],
    createdBy: 'priya.sharma',
    createdAt: new Date('2024-01-20'),
    modifiedBy: 'priya.sharma',
    modifiedAt: new Date('2024-01-20'),
    version: 1,
    synonyms: [],
    antonyms: [],
    seeAlso: ['1']
  },
  {
    id: '3',
    sourceTerm: 'API',
    sourceLanguage: 'English',
    translations: [
      {
        id: 't5',
        language: 'Hindi',
        text: 'एप्लिकेशन प्रोग्रामिंग इंटरफेस',
        priority: 1,
        context: 'Technical documentation',
        verified: true
      },
      {
        id: 't6',
        language: 'Spanish',
        text: 'Interfaz de Programación de Aplicaciones',
        priority: 1,
        context: 'Technical documentation',
        verified: true
      }
    ],
    domain: ['technical'],
    usageCount: 156,
    confidenceScore: 95,
    status: 'active',
    definition: 'Application Programming Interface - set of protocols for building software',
    partOfSpeech: 'Acronym',
    usageExamples: [],
    tags: ['programming', 'software', 'interface'],
    createdBy: 'mike.johnson',
    createdAt: new Date('2024-02-01'),
    modifiedBy: 'mike.johnson',
    modifiedAt: new Date('2024-02-15'),
    version: 2,
    synonyms: [],
    antonyms: [],
    seeAlso: []
  }
];

const defaultFilters: GlossaryFilter = {
  search: '',
  domain: 'all',
  status: 'all',
  sourceLanguage: 'all',
  targetLanguage: 'all',
  tags: [],
  confidence: [0, 100]
};

export const useGlossaryStore = create<GlossaryState>()(
  persist(
    (set, get) => ({
      // Initial state
      terms: mockTerms,
      selectedTermId: null,
      filters: defaultFilters,
      conflicts: [],
      
      isAddModalOpen: false,
      isImportModalOpen: false,
      isHistoryModalOpen: false,
      selectedTermIds: [],
      sortField: 'modifiedAt',
      sortDirection: 'desc',
      
      // Basic actions
      setSelectedTerm: (termId) => set({ selectedTermId: termId }),
      
      updateFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        })),
      
      clearFilters: () => set({ filters: defaultFilters }),
      
      // Term management
      addTerm: async (termData) => {
        const newTerm: GlossaryTerm = {
          ...termData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          modifiedAt: new Date(),
          version: 1,
          usageCount: 0,
          confidenceScore: 85,
          usageExamples: []
        };
        
        set((state) => ({
          terms: [...state.terms, newTerm]
        }));
        
        return newTerm.id;
      },
      
      updateTerm: async (termId, updates) => {
        set((state) => ({
          terms: state.terms.map(term =>
            term.id === termId
              ? {
                  ...term,
                  ...updates,
                  modifiedAt: new Date(),
                  version: term.version + 1
                }
              : term
          )
        }));
      },
      
      deleteTerm: async (termId) => {
        set((state) => ({
          terms: state.terms.filter(term => term.id !== termId),
          selectedTermId: state.selectedTermId === termId ? null : state.selectedTermId
        }));
      },
      
      deleteTerms: async (termIds) => {
        set((state) => ({
          terms: state.terms.filter(term => !termIds.includes(term.id)),
          selectedTermIds: [],
          selectedTermId: termIds.includes(state.selectedTermId || '') ? null : state.selectedTermId
        }));
      },
      
      // Translation management
      addTranslation: async (termId, translationData) => {
        const newTranslation: Translation = {
          ...translationData,
          id: Math.random().toString(36).substr(2, 9)
        };
        
        set((state) => ({
          terms: state.terms.map(term =>
            term.id === termId
              ? {
                  ...term,
                  translations: [...term.translations, newTranslation],
                  modifiedAt: new Date(),
                  version: term.version + 1
                }
              : term
          )
        }));
      },
      
      updateTranslation: async (termId, translationId, updates) => {
        set((state) => ({
          terms: state.terms.map(term =>
            term.id === termId
              ? {
                  ...term,
                  translations: term.translations.map(translation =>
                    translation.id === translationId
                      ? { ...translation, ...updates }
                      : translation
                  ),
                  modifiedAt: new Date(),
                  version: term.version + 1
                }
              : term
          )
        }));
      },
      
      deleteTranslation: async (termId, translationId) => {
        set((state) => ({
          terms: state.terms.map(term =>
            term.id === termId
              ? {
                  ...term,
                  translations: term.translations.filter(t => t.id !== translationId),
                  modifiedAt: new Date(),
                  version: term.version + 1
                }
              : term
          )
        }));
      },
      
      // Bulk operations
      bulkUpdateStatus: async (termIds, status) => {
        set((state) => ({
          terms: state.terms.map(term =>
            termIds.includes(term.id)
              ? { ...term, status, modifiedAt: new Date(), version: term.version + 1 }
              : term
          )
        }));
      },
      
      bulkUpdateDomain: async (termIds, domain) => {
        set((state) => ({
          terms: state.terms.map(term =>
            termIds.includes(term.id)
              ? { ...term, domain, modifiedAt: new Date(), version: term.version + 1 }
              : term
          )
        }));
      },
      
      bulkDelete: async (termIds) => {
        get().deleteTerms(termIds);
      },
      
      // Import/Export (mock implementations)
      importTerms: async (file) => {
        console.log('Importing file:', file.name);
        return { success: 0, errors: ['Import functionality not implemented'] };
      },
      
      exportTerms: async (format) => {
        const { terms } = get();
        const data = JSON.stringify(terms, null, 2);
        return new Blob([data], { type: 'application/json' });
      },
      
      // Conflict resolution
      detectConflicts: async () => {
        // Mock implementation
        return [];
      },
      
      resolveConflict: async (conflictId, resolution) => {
        console.log('Resolving conflict:', conflictId, resolution);
      },
      
      // Search and filtering
      searchTerms: (query) => {
        const { terms } = get();
        const lowercaseQuery = query.toLowerCase();
        return terms.filter(term =>
          term.sourceTerm.toLowerCase().includes(lowercaseQuery) ||
          term.translations.some(t => t.text.toLowerCase().includes(lowercaseQuery)) ||
          term.definition?.toLowerCase().includes(lowercaseQuery) ||
          term.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
      },
      
      getFilteredTerms: () => {
        const { terms, filters } = get();
        
        return terms.filter(term => {
          // Search filter
          if (filters.search) {
            const query = filters.search.toLowerCase();
            const matchesSearch = 
              term.sourceTerm.toLowerCase().includes(query) ||
              term.translations.some(t => t.text.toLowerCase().includes(query)) ||
              term.definition?.toLowerCase().includes(query) ||
              term.tags.some(tag => tag.toLowerCase().includes(query));
            
            if (!matchesSearch) return false;
          }
          
          // Domain filter
          if (filters.domain !== 'all' && !term.domain.includes(filters.domain)) {
            return false;
          }
          
          // Status filter
          if (filters.status !== 'all' && term.status !== filters.status) {
            return false;
          }
          
          // Language filters
          if (filters.sourceLanguage !== 'all' && term.sourceLanguage !== filters.sourceLanguage) {
            return false;
          }
          
          if (filters.targetLanguage !== 'all') {
            const hasTargetLanguage = term.translations.some(t => t.language === filters.targetLanguage);
            if (!hasTargetLanguage) return false;
          }
          
          // Tags filter
          if (filters.tags.length > 0) {
            const hasAllTags = filters.tags.every(tag => term.tags.includes(tag));
            if (!hasAllTags) return false;
          }
          
          // Confidence filter
          const [minConf, maxConf] = filters.confidence;
          if (term.confidenceScore < minConf || term.confidenceScore > maxConf) {
            return false;
          }
          
          return true;
        });
      },
      
      // UI actions
      toggleAddModal: () => set((state) => ({ isAddModalOpen: !state.isAddModalOpen })),
      toggleImportModal: () => set((state) => ({ isImportModalOpen: !state.isImportModalOpen })),
      toggleHistoryModal: () => set((state) => ({ isHistoryModalOpen: !state.isHistoryModalOpen })),
      
      setSelectedTermIds: (termIds) => set({ selectedTermIds: termIds }),
      
      toggleTermSelection: (termId) =>
        set((state) => ({
          selectedTermIds: state.selectedTermIds.includes(termId)
            ? state.selectedTermIds.filter(id => id !== termId)
            : [...state.selectedTermIds, termId]
        })),
      
      setSorting: (field, direction) =>
        set({ sortField: field, sortDirection: direction })
    }),
    {
      name: 'glossary-settings',
      partialize: (state) => ({
        filters: state.filters,
        sortField: state.sortField,
        sortDirection: state.sortDirection
      })
    }
  )
);