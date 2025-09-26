import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EditorStage = 'source-text' | 'translation' | 'complete';

export interface ConfidenceSpan {
  start: number;
  end: number;
  confidence: number;
  alternatives?: string[];
}

export interface TextLine {
  id: string;
  text: string;
  confidence: number;
  verified: boolean;
  spans: ConfidenceSpan[];
  lineNumber: number;
}

export interface GlossaryTerm {
  id: string;
  source: string;
  target: string;
  definition?: string;
  category?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  pageCount: number;
  currentPage: number;
}

export interface EditorState {
  // Document and navigation
  document: Document | null;
  currentStage: EditorStage;
  completedStages: EditorStage[];
  
  // Text editing
  sourceText: TextLine[];
  translatedText: TextLine[];
  selectedLineId: string | null;
  
  // Editor settings
  panelSizes: number[];
  scrollSync: boolean;
  showConfidence: boolean;
  
  // Quality metrics
  textRecognitionScore: number;
  translationScore: number;
  glossaryMatches: number;
  
  // UI state
  isGlossaryPanelOpen: boolean;
  activeGlossary: GlossaryTerm[];
  unsavedChanges: boolean;
  lastSaveTime: Date | null;
  isReviewSectionDismissed: boolean;
  
  // Actions
  setDocument: (document: Document) => void;
  setStage: (stage: EditorStage) => void;
  completeStage: (stage: EditorStage) => void;
  updateSourceText: (lineId: string, text: string) => void;
  updateTranslatedText: (lineId: string, text: string) => void;
  verifyLine: (lineId: string) => void;
  setSelectedLine: (lineId: string | null) => void;
  addSourceLine: (line: TextLine) => void;
  addTranslatedLine: (line: TextLine) => void;
  deleteSourceLine: (lineId: string) => void;
  deleteTranslatedLine: (lineId: string) => void;
  setPanelSizes: (sizes: number[]) => void;
  toggleScrollSync: () => void;
  toggleConfidenceView: () => void;
  toggleGlossaryPanel: () => void;
  dismissReviewSection: () => void;
  saveChanges: () => void;
  resetEditor: () => void;
}

const mockSourceText: TextLine[] = [
  {
    id: '1',
    text: 'गणेश चतुर्थी हिंदू धर्म का एक प्रमुख त्योहार है।',
    confidence: 98,
    verified: false,
    spans: [
      { start: 0, end: 11, confidence: 98 },
      { start: 12, end: 21, confidence: 95 },
      { start: 22, end: 44, confidence: 99 }
    ],
    lineNumber: 1
  },
  {
    id: '2',
    text: 'यह भगवान गणेश के जन्म का उत्सव है।',
    confidence: 85,
    verified: false,
    spans: [
      { start: 0, end: 8, confidence: 90 },
      { start: 9, end: 21, confidence: 82, alternatives: ['गणपति', 'गणेशजी'] },
      { start: 22, end: 35, confidence: 88 }
    ],
    lineNumber: 2
  },
  {
    id: '3',
    text: 'इस दिन लोग गणेश की मूर्ति स्थापित करते हैं।',
    confidence: 76,
    verified: false,
    spans: [
      { start: 0, end: 7, confidence: 85 },
      { start: 8, end: 18, confidence: 72 },
      { start: 19, end: 44, confidence: 78 }
    ],
    lineNumber: 3
  }
];

const mockTranslatedText: TextLine[] = [
  {
    id: '1',
    text: 'Ganesh Chaturthi is a major festival of Hinduism.',
    confidence: 92,
    verified: false,
    spans: [
      { start: 0, end: 15, confidence: 95 },
      { start: 16, end: 49, confidence: 89 }
    ],
    lineNumber: 1
  },
  {
    id: '2',
    text: 'It is a celebration of Lord Ganesha\'s birth.',
    confidence: 88,
    verified: false,
    spans: [
      { start: 0, end: 43, confidence: 88 }
    ],
    lineNumber: 2
  },
  {
    id: '3',
    text: 'On this day people install Ganesha idols.',
    confidence: 85,
    verified: false,
    spans: [
      { start: 0, end: 40, confidence: 85 }
    ],
    lineNumber: 3
  }
];

const mockGlossary: GlossaryTerm[] = [
  {
    id: '1',
    source: 'गणेश',
    target: 'Ganesha',
    definition: 'Hindu deity with elephant head, remover of obstacles',
    category: 'Religious'
  },
  {
    id: '2',
    source: 'चतुर्थी',
    target: 'Chaturthi',
    definition: 'Fourth day of lunar month',
    category: 'Calendar'
  }
];

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Initial state
      document: {
        id: 'doc-1',
        name: 'Ganesh_Chaturthi_Article.pdf',
        type: 'pdf',
        url: '/placeholder.svg',
        pageCount: 3,
        currentPage: 1
      },
      currentStage: 'source-text',
      completedStages: [],
      
      sourceText: mockSourceText,
      translatedText: mockTranslatedText,
      selectedLineId: null,
      
      panelSizes: [50, 50],
      scrollSync: true,
      showConfidence: true,
      
      textRecognitionScore: 86,
      translationScore: 88,
      glossaryMatches: 2,
      
      isGlossaryPanelOpen: false,
      activeGlossary: mockGlossary,
      unsavedChanges: false,
      lastSaveTime: null,
      isReviewSectionDismissed: false,
      
      // Actions
      setDocument: (document) => set({ document }),
      
      setStage: (stage) => set({ currentStage: stage }),
      
      completeStage: (stage) => {
        const { completedStages } = get();
        if (!completedStages.includes(stage)) {
          set({ 
            completedStages: [...completedStages, stage],
            unsavedChanges: true
          });
        }
      },
      
      updateSourceText: (lineId, text) => {
        const { sourceText } = get();
        const updatedText = sourceText.map(line =>
          line.id === lineId ? { ...line, text, verified: false } : line
        );
        set({ 
          sourceText: updatedText, 
          unsavedChanges: true 
        });
      },
      
      updateTranslatedText: (lineId, text) => {
        const { translatedText } = get();
        const updatedText = translatedText.map(line =>
          line.id === lineId ? { ...line, text, verified: false } : line
        );
        set({ 
          translatedText: updatedText, 
          unsavedChanges: true 
        });
      },
      
      verifyLine: (lineId) => {
        const { sourceText, translatedText, currentStage } = get();
        
        if (currentStage === 'source-text') {
          const updatedText = sourceText.map(line =>
            line.id === lineId ? { ...line, verified: true } : line
          );
          set({ sourceText: updatedText, unsavedChanges: true });
        } else {
          const updatedText = translatedText.map(line =>
            line.id === lineId ? { ...line, verified: true } : line
          );
          set({ translatedText: updatedText, unsavedChanges: true });
        }
      },
      
      setSelectedLine: (lineId) => set({ selectedLineId: lineId }),
      
      addSourceLine: (line) => {
        const { sourceText } = get();
        set({ 
          sourceText: [...sourceText, { ...line, lineNumber: sourceText.length + 1 }], 
          unsavedChanges: true 
        });
      },
      
      addTranslatedLine: (line) => {
        const { translatedText } = get();
        set({ 
          translatedText: [...translatedText, { ...line, lineNumber: translatedText.length + 1 }], 
          unsavedChanges: true 
        });
      },
      
      deleteSourceLine: (lineId) => {
        const { sourceText } = get();
        const updatedText = sourceText
          .filter(line => line.id !== lineId)
          .map((line, index) => ({ ...line, lineNumber: index + 1 }));
        set({ 
          sourceText: updatedText, 
          unsavedChanges: true,
          selectedLineId: null
        });
      },
      
      deleteTranslatedLine: (lineId) => {
        const { translatedText } = get();
        const updatedText = translatedText
          .filter(line => line.id !== lineId)
          .map((line, index) => ({ ...line, lineNumber: index + 1 }));
        set({ 
          translatedText: updatedText, 
          unsavedChanges: true,
          selectedLineId: null
        });
      },
      
      setPanelSizes: (sizes) => set({ panelSizes: sizes }),
      
      toggleScrollSync: () => set((state) => ({ scrollSync: !state.scrollSync })),
      
      toggleConfidenceView: () => set((state) => ({ showConfidence: !state.showConfidence })),
      
      toggleGlossaryPanel: () => set((state) => ({ isGlossaryPanelOpen: !state.isGlossaryPanelOpen })),
      
      dismissReviewSection: () => set({ isReviewSectionDismissed: true }),
      
      saveChanges: () => {
        set({ 
          unsavedChanges: false, 
          lastSaveTime: new Date() 
        });
      },
      
      resetEditor: () => {
        set({
          currentStage: 'source-text',
          completedStages: [],
          selectedLineId: null,
          unsavedChanges: false,
          lastSaveTime: null
        });
      }
    }),
    {
      name: 'editor-settings',
      partialize: (state) => ({
        panelSizes: state.panelSizes,
        scrollSync: state.scrollSync,
        showConfidence: state.showConfidence
      })
    }
  )
);