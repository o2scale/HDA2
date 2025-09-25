# Design System & Component Library

## Design System Approach

**Design System Approach:** AI-generated component library using shadcn/ui as the base, extended with custom components specific to OCR/translation workflows. All components will be generated through Lovable with consistent design tokens.

## Core Components

### 1. DocumentCard
**Purpose:** Display document information consistently across all views
**Variants:** Default (grid view), Compact (list view), Processing (with progress bar), Error (with retry action)
**States:** Idle, Hover, Selected, Processing, Complete, Error
**Usage Guidelines:** Use DocumentCard for any document representation. Always show thumbnail, title, and status. Include progress indicators for active processing.

```typescript
interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    status: DocumentStatus;
    progress?: number;
    thumbnail?: string;
    fileSize: string;
    pageCount?: number;
    lastModified: Date;
  };
  variant?: 'default' | 'compact' | 'processing' | 'error';
  onSelect?: (id: string) => void;
  onAction?: (action: string, id: string) => void;
  showActions?: boolean;
}

// Usage
<DocumentCard
  document={document}
  variant="processing"
  showActions
  onSelect={handleSelect}
  onAction={handleAction}
/>
```

### 2. ProgressIndicator
**Purpose:** Show processing status for OCR and translation operations
**Variants:** Linear (bar with percentage), Circular (for confined spaces), Stepped (for multi-stage processes), Pulse (for indeterminate progress)
**States:** Idle, Active, Paused, Complete, Error
**Usage Guidelines:** Always pair with time estimates when available. Use stepped variant for OCR → Translation → Review pipeline. Animate smoothly to avoid jarring updates.

```typescript
interface ProgressIndicatorProps {
  value: number; // 0-100
  variant?: 'linear' | 'circular' | 'stepped' | 'pulse';
  status?: 'idle' | 'active' | 'paused' | 'complete' | 'error';
  steps?: Array<{
    label: string;
    status: 'pending' | 'active' | 'complete' | 'error';
  }>;
  showLabel?: boolean;
  timeRemaining?: string;
  className?: string;
}

// Usage
<ProgressIndicator
  value={65}
  variant="stepped"
  steps={[
    { label: "OCR Processing", status: "complete" },
    { label: "Translation", status: "active" },
    { label: "Review", status: "pending" }
  ]}
  timeRemaining="2m 30s"
/>
```

### 3. GlossaryTerm
**Purpose:** Highlight and interact with glossary-managed terms
**Variants:** Inline (within text), Tooltip (hover display), Editable (in glossary manager), Conflict (multiple translations available)
**States:** Default, Hover, Active, Locked, Conflicted
**Usage Guidelines:** Purple highlight (#8B5CF6) for all glossary terms. Show definition on hover. Right-click to edit. Use lock icon for protected religious terms.

```typescript
interface GlossaryTermProps {
  term: string;
  translations?: Record<string, string>;
  definition?: string;
  variant?: 'inline' | 'tooltip' | 'editable' | 'conflict';
  isLocked?: boolean;
  confidence?: number;
  onEdit?: (term: string) => void;
  onApply?: (translation: string) => void;
}

// Usage
<GlossaryTerm
  term="dharma"
  translations={{ en: "dharma", hi: "धर्म" }}
  definition="Religious and moral law governing conduct"
  variant="inline"
  confidence={95}
  onEdit={handleEdit}
/>
```

### 4. SplitPanel
**Purpose:** Resizable panel layouts for document comparison
**Variants:** Two-panel (source/target), Three-panel (source/OCR/translation), Tabbed (mobile view), Synchronized (scroll-locked)
**States:** Default, Resizing, Collapsed, Synced
**Usage Guidelines:** Minimum panel width 300px. Save user's preferred split ratio. Provide grab handles at least 8px wide for easy dragging.

```typescript
interface SplitPanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  thirdPanel?: React.ReactNode;
  variant?: 'two-panel' | 'three-panel' | 'tabbed' | 'synchronized';
  defaultSplit?: number; // Percentage
  minPanelSize?: number;
  syncScroll?: boolean;
  onSplitChange?: (split: number) => void;
  className?: string;
}

// Usage
<SplitPanel
  leftPanel={<PDFViewer />}
  rightPanel={<OCREditor />}
  variant="two-panel"
  defaultSplit={50}
  syncScroll
  onSplitChange={handleSplitChange}
/>
```

### 5. QueueItem
**Purpose:** Represent items in processing queue
**Variants:** Card (Kanban view), Row (list view), Minimal (sidebar widget), Detailed (expanded view)
**States:** Queued, Processing, Paused, Complete, Failed
**Usage Guidelines:** Always show position in queue, estimated time, and owner. Make draggable for reordering. Include quick actions on hover.

```typescript
interface QueueItemProps {
  item: {
    id: string;
    documentName: string;
    status: QueueStatus;
    progress?: number;
    position?: number;
    estimatedTime?: string;
    owner: User;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  };
  variant?: 'card' | 'row' | 'minimal' | 'detailed';
  isDraggable?: boolean;
  showActions?: boolean;
  onAction?: (action: string, id: string) => void;
}

// Usage
<QueueItem
  item={queueItem}
  variant="card"
  isDraggable
  showActions
  onAction={handleQueueAction}
/>
```

## Specialized Translation Components

### 6. TranslationEditor
**Purpose:** Side-by-side editor for reviewing and correcting translations
**Features:** Confidence highlighting, glossary integration, version control, sync scrolling

```typescript
interface TranslationEditorProps {
  sourceText: string;
  translatedText: string;
  glossaryTerms?: GlossaryTerm[];
  confidenceScores?: number[];
  onTextChange: (text: string) => void;
  onGlossaryMatch: (term: string, translation: string) => void;
  syncScroll?: boolean;
  readOnly?: boolean;
  language: string;
}
```

### 7. TwoStageWorkflow
**Purpose:** Progressive workflow component for OCR → Translation stages
**Features:** Stage indicators, approval gates, navigation controls

```typescript
interface TwoStageWorkflowProps {
  stages: Array<{
    id: string;
    label: string;
    status: 'pending' | 'active' | 'complete';
    component: React.ComponentType;
  }>;
  currentStage: string;
  onStageChange: (stageId: string) => void;
  onApprove: (stageId: string) => void;
  showNavigation?: boolean;
}
```

### 8. LanguageSelector
**Purpose:** Multi-language selection with flag icons and native names
**Features:** Search, recent languages, language detection

```typescript
interface LanguageSelectorProps {
  selectedLanguage?: string;
  availableLanguages: Language[];
  onLanguageChange: (language: string) => void;
  showFlags?: boolean;
  showNativeNames?: boolean;
  searchable?: boolean;
  maxRecent?: number;
}
```

## Layout Components

### 9. AppLayout
**Purpose:** Main application layout with navigation and content areas
**Features:** Responsive sidebar, breadcrumbs, user menu, notifications

```typescript
interface AppLayoutProps {
  children: React.ReactNode;
  currentSection: string;
  user: User;
  notifications?: Notification[];
  sidebarCollapsed?: boolean;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}
```

### 10. ProcessingWorkspace
**Purpose:** Dedicated workspace for document processing with tools panel
**Features:** Tool panels, zoom controls, page navigation

```typescript
interface ProcessingWorkspaceProps {
  document: Document;
  tools: Array<{
    id: string;
    label: string;
    icon: React.ComponentType;
    component: React.ComponentType;
  }>;
  activeTool?: string;
  onToolChange: (toolId: string) => void;
  zoom?: number;
  onZoomChange: (zoom: number) => void;
}
```

## Form Components

### 11. DocumentUpload
**Purpose:** Drag-and-drop file upload with validation and preview
**Features:** Multi-file support, progress tracking, file type validation

```typescript
interface DocumentUploadProps {
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  onUpload: (files: File[]) => Promise<void>;
  onProgress?: (progress: number) => void;
  showPreview?: boolean;
  templateOptions?: UploadTemplate[];
}
```

### 12. GlossaryTermEditor
**Purpose:** Form for creating and editing glossary terms
**Features:** Multi-language input, validation, conflict detection

```typescript
interface GlossaryTermEditorProps {
  term?: GlossaryTerm;
  availableLanguages: Language[];
  onSave: (term: GlossaryTermData) => Promise<void>;
  onCancel: () => void;
  validateTerm?: (term: string) => Promise<boolean>;
}
```

## Data Display Components

### 13. DocumentLibrary
**Purpose:** Grid/list view for browsing documents with filters
**Features:** Multiple view modes, sorting, filtering, search

```typescript
interface DocumentLibraryProps {
  documents: Document[];
  viewMode?: 'grid' | 'list' | 'table';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: DocumentFilter[];
  searchQuery?: string;
  onDocumentSelect: (document: Document) => void;
  onViewModeChange: (mode: string) => void;
  onSort: (field: string, order: string) => void;
  onFilter: (filters: DocumentFilter[]) => void;
  onSearch: (query: string) => void;
}
```

### 14. QualityMetrics
**Purpose:** Display OCR and translation quality scores with trends
**Features:** Score visualization, trend charts, breakdowns

```typescript
interface QualityMetricsProps {
  metrics: {
    ocrAccuracy: number;
    translationQuality: number;
    glossaryMatches: number;
    confidenceScore: number;
  };
  trends?: Array<{
    date: Date;
    scores: Record<string, number>;
  }>;
  showTrends?: boolean;
  timeRange?: string;
}
```

### 15. ProcessingQueue
**Purpose:** Kanban board or list view for processing jobs
**Features:** Drag-and-drop reordering, real-time updates, batch actions

```typescript
interface ProcessingQueueProps {
  jobs: ProcessingJob[];
  viewMode?: 'kanban' | 'list';
  groupBy?: 'status' | 'user' | 'priority';
  allowReorder?: boolean;
  showBatchActions?: boolean;
  onJobAction: (action: string, jobIds: string[]) => void;
  onReorder: (jobId: string, newPosition: number) => void;
  realTimeUpdates?: boolean;
}
```

## shadcn/ui Integration

### Base Components (shadcn/ui)
All custom components build upon these base components:

- **Button** - Primary actions, secondary actions, icon buttons
- **Card** - Content containers with consistent spacing
- **Dialog** - Modal dialogs for forms and confirmations
- **Dropdown Menu** - Context menus and action menus
- **Form** - Form layouts with validation
- **Input** - Text inputs with validation states
- **Label** - Accessible labels for form fields
- **Progress** - Progress bars for operations
- **Sheet** - Side panels for detailed views
- **Table** - Data tables with sorting and filtering
- **Tabs** - Tab navigation for related content
- **Toast** - Notification messages
- **Tooltip** - Contextual help and information

### Custom Theme Configuration
```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Custom colors for translation platform
        glossary: "hsl(270 66% 63%)", // Purple for glossary terms
        confidence: {
          high: "hsl(142 76% 36%)", // Green
          medium: "hsl(38 92% 50%)", // Orange
          low: "hsl(0 84% 60%)", // Red
        },
        processing: {
          queued: "hsl(220 13% 46%)", // Gray
          active: "hsl(217 91% 60%)", // Blue
          complete: "hsl(142 76% 36%)", // Green
          error: "hsl(0 84% 60%)", // Red
        }
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    }
  }
}
```

## Component Usage Guidelines

### 1. Consistency Rules
- Use consistent spacing (4px base unit)
- Apply consistent hover/focus states
- Maintain consistent animation durations (150-300ms)
- Follow accessibility guidelines (WCAG AA)

### 2. State Management
- Use Zustand stores for component state
- Implement optimistic updates for user actions
- Handle loading/error states consistently
- Cache expensive operations

### 3. Performance Guidelines
- Implement virtual scrolling for large lists
- Use React.memo for expensive components
- Lazy load components not immediately visible
- Optimize re-renders with proper dependency arrays

### 4. Accessibility Standards
- Provide keyboard navigation for all interactive elements
- Include proper ARIA labels and roles
- Support screen readers with descriptive text
- Maintain proper focus management
- Test with accessibility tools (axe-core)

### 5. Testing Approach
```typescript
// Component test example
describe('DocumentCard', () => {
  it('displays document information correctly', () => {
    render(
      <DocumentCard
        document={mockDocument}
        variant="default"
        showActions
      />
    );

    expect(screen.getByText(mockDocument.title)).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();

    render(
      <DocumentCard
        document={mockDocument}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(mockDocument.id);
  });
});
```

This design system ensures consistent, accessible, and maintainable components across the Enterprise Translation Platform while providing the flexibility needed for complex document processing workflows.