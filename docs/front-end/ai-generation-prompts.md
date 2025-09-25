# AI UI Generation Prompts (Lovable/Bolt)

*Note: These prompts are designed for Lovable.dev or Bolt.new to generate complete React + Tailwind + shadcn/ui interfaces. Each prompt includes all specifications, interactions, and state management requirements.*

## Prompt 1: Dashboard Home Screen

```
Create a modern dashboard for an enterprise translation and document processing platform with the following specifications:

LAYOUT:
- Full-screen responsive dashboard with a clean, professional design
- Use a 12-column grid system with 24px gutters
- Background: subtle gray (#F9FAFB) with white cards
- Header: Fixed top navigation bar (64px height) with logo, main nav items (Dashboard, Documents, Processing, Review, Analytics, Settings), and user profile dropdown

MAIN DASHBOARD COMPONENTS (arrange in priority order):

1. Active Processing Widget (top-left, spans 8 columns):
   - Card with title "Active Processing"
   - Real-time progress bars for current text extraction and translation jobs
   - Each progress bar shows: document name, progress percentage, time remaining, pause/cancel buttons
   - Use animated gradient progress bars (blue to green as they complete)
   - Maximum 5 items shown, with "View All" link to queue

2. Quick Upload Zone (top-right, spans 4 columns):
   - Dashed border (#D1D5DB) that turns solid blue on hover
   - Large upload icon in center
   - Text: "Drag files here or click to upload"
   - Accepts: PDF, JPG, PNG, DOCX
   - On file drop: show immediate preview and processing options

3. Queue Status Cards (second row, 3 cards, 4 columns each):
   - Card 1: "Pending" - number with orange badge
   - Card 2: "Processing" - number with animated blue pulse
   - Card 3: "Completed Today" - number with green check
   - Each card is clickable to filter the queue view

4. Recent Documents Grid (third row, spans 12 columns):
   - Title: "Recent Documents" with "View All" link
   - Grid of 6-8 document cards (responsive: 4 on desktop, 2 on tablet, 1 on mobile)
   - Each card: thumbnail preview, document title, status badge (Processing/Ready/Verified), last modified time
   - Hover effect: slight elevation and show quick actions (Download, Reprocess, Delete)

5. Quality Metrics Summary (bottom-left, spans 6 columns):
   - Title: "Quality Metrics - Last 7 Days"
   - Circular progress chart showing average accuracy (target: 95%)
   - Below: three metrics in row: Text Extraction Quality, Translation Quality, Documents Verified
   - Use color coding: green (>90%), yellow (70-90%), red (<70%)

6. System Health Panel (bottom-right, spans 6 columns):
   - API Status indicators: Gemini (green/red dot), OpenAI (green/red dot), Supabase (green/red dot)
   - Current quota usage: progress bar showing percentage used
   - Active users online: number with user icon
   - Last sync time with relative timestamp

INTERACTIONS:
- All cards have subtle shadow on hover (shadow-md)
- Smooth transitions (transition-all duration-200)
- Loading states: use skeleton screens with shimmer effect
- Empty states: friendly illustrations with action prompts
- Pull-to-refresh on mobile
- Real-time updates via WebSocket (show connection status in header)

RESPONSIVE BEHAVIOR:
- Desktop (>1280px): Full layout as described
- Tablet (768-1280px): Stack to 2 columns, hide some metrics
- Mobile (<768px): Single column, collapsible sections, bottom navigation

COLOR SCHEME:
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)
- Text: Gray-900 (#111827)
- Borders: Gray-200 (#E5E7EB)

Use React with TypeScript, Tailwind CSS, and shadcn/ui components. Include Framer Motion for smooth animations. Setup React Query for data fetching and Zustand for state management.
```

## Prompt 2: Upload Center with Content Preparation

```
Create an advanced upload center for document processing with content preparation settings:

LAYOUT:
- Two-panel layout with 60/40 split (upload area / configuration panel)
- Collapsible right panel on mobile
- Sticky configuration panel that scrolls independently

LEFT PANEL - UPLOAD AREA:

1. Drop Zone (takes 70% of panel height):
   - Large dashed border (3px, #9CA3AF) with rounded corners (8px)
   - Animated dashed border on hover (use CSS animation)
   - Center content: Upload cloud icon (64px), "Drop your files here", "Support for PDF, JPG, PNG, DOCX (max 100MB)"
   - On drag over: blue overlay with "Release to upload" text
   - Show file type validation in real-time (green checkmark or red X)

2. File Preview Section (remaining 30%):
   - Horizontal scrolling list of uploaded files
   - Each file card (160px x 200px): thumbnail, filename (truncated), file size, remove button (X)
   - For PDFs: show page count badge
   - Show upload progress bar during upload
   - Error state: red border with error message tooltip

RIGHT PANEL - CONFIGURATION:

1. Language Detection Section:
   - Toggle: "Auto-detect language" (default on)
   - When off: Multi-select dropdown for languages (English, Hindi, Marathi, Bengali, Gujarati, German)
   - Per-page language override option (shows page thumbnails with language selector)

2. Text Extraction Quality Settings:
   - Radio buttons: "Fast" (draft), "Balanced" (default), "Maximum" (highest accuracy)
   - Show time/cost implications for each option
   - Advanced settings (collapsible):
     - Confidence threshold slider (0-100%)
     - Image preprocessing toggles (deskew, denoise, contrast enhancement)
     - Page orientation: Auto/Portrait/Landscape

3. Page Selection (appears after file upload):
   - Thumbnail grid of all pages (4 columns)
   - Checkbox on each thumbnail for selection
   - Quick actions: "Select All", "Select Odd", "Select Even", "Select Range"
   - Page range input: "1-5, 8, 10-15"

4. Batch Configuration:
   - Toggle: "Add to batch"
   - Batch name input field
   - Priority selector: Low/Normal/High/Urgent
   - Schedule option: "Process immediately" or datetime picker

5. Template Section:
   - Dropdown: "Select saved template" or "Save current as template"
   - Template includes all settings above
   - Quick templates: "Sanskrit Manuscripts", "Modern Documents", "Mixed Content"

6. Cost & Time Estimator (sticky bottom):
   - Live calculation based on pages and settings
   - Shows: Estimated cost ($X.XX), Processing time (X minutes), Queue position
   - "Process Now" button (primary, full width)
   - "Add to Queue" button (secondary)

INTERACTIONS:
- Settings auto-save to localStorage
- Tooltips on hover for all settings explaining impact
- Keyboard shortcuts: Ctrl+V to paste, Delete to remove selected
- Drag to reorder files in preview
- Show processing estimation update in real-time as settings change

STATES:
- Empty: Prominent drop zone with helper text
- Uploading: Progress bars with cancel option
- Processing: Lock configuration, show queue position
- Error: Clear error messages with retry options
- Success: Green checkmark with "View Results" button

Use React, TypeScript, Tailwind CSS, shadcn/ui, react-dropzone for file handling, and react-window for virtualized page grid.
```

## Prompt 3: Two-Panel Progressive Editor (Source Text → Translation)

```
Create a sophisticated two-panel progressive editor with staged workflow for source text editing then translation:

LAYOUT:
- Two equal panels with resizable divider (using react-resizable-panels)
- Stage 1: Source Document | Source Text Editor
- Stage 2: Source Document | Translation Editor (after text approval)
- Toolbar at top (56px height) with stage indicator and actions
- Status bar at bottom (32px) with quality scores and save status

WORKFLOW STAGES:

Stage Indicator (in toolbar):
- Visual pipeline: [1. Source Text Editor] → [2. Translation Editor] → [3. Complete]
- Current stage highlighted with primary color
- Completed stages show green checkmark
- Click to navigate between completed stages

TOOLBAR:
- Left section: Document name, page indicator (Page X of Y)
- Center section: Stage progress indicator with current stage highlighted
- Right section: Stage action button ("Approve Text & Proceed" or "Approve Translation & Complete")

STAGE 1 - SOURCE TEXT EDITING MODE:

Left Panel - SOURCE DOCUMENT:
- PDF.js viewer for PDFs, image viewer for images
- Zoom controls (25%-400%) with smooth zoom
- Pan tool for navigation
- Highlight tool to mark problem areas
- Page thumbnails sidebar (collapsible)

Right Panel - SOURCE TEXT EDITOR:
- Monaco Editor or CodeMirror with custom theme
- Line numbers on left
- Confidence highlighting:
  - High confidence (>95%): no highlight
  - Medium (80-95%): yellow background (#FEF3C7)
  - Low (<80%): red background (#FEE2E2)
- Right-click context menu:
  - "Add to glossary"
  - "Mark as verified"
  - "Report issue"
  - "Show alternatives" (shows other text recognition possibilities)
- Inline buttons on hover:
  - Merge with previous line
  - Split into two lines
  - Delete line
  - Insert line above/below
- Real-time spell check with red underlines
- Find & Replace with regex support (Ctrl+F)

Action Button (Stage 1):
- Primary button: "Approve Text & Proceed to Translation"
- Secondary: "Save Draft"
- Warning if low confidence areas not reviewed

STAGE 2 - TRANSLATION REVIEW MODE:

Left Panel - SOURCE DOCUMENT (Same as Stage 1):
- Original document remains visible
- Optional: Toggle to show source text instead
- Quick reference panel showing approved source text

Right Panel - TRANSLATION EDITOR:
- Similar editor setup as Panel 2
- Glossary terms highlighted in purple (#8B5CF6)
- Hover on glossary term: show tooltip with source term and definition
- Side panel (collapsible) with:
  - Active glossary info
  - Translation memory matches
  - AI confidence scores
  - Alternative translations
- Language selector for target language (if multiple)
- Translation confidence scores
- Alternative translation suggestions

Action Button (Stage 2):
- Primary: "Approve Translation & Mark Verified"
- Secondary: "Request Human Review"
- Option: "Back to Source Text" (if issues found)

STAGE NAVIGATION:
- Progress bar showing: Source Text Editor → Translation Editor → Complete
- Click on completed stages to navigate back
- Keyboard shortcuts: Alt+1 (Source Text), Alt+2 (Translation)
- Warning when leaving stage with unsaved changes

SYNCHRONIZATION FEATURES:
- Scroll sync between panels (toggleable)
- Line mapping for reference
- Split position remembered per user

BOTTOM STATUS BAR:
- Text Recognition Confidence: XX% (with breakdown link)
- Translation Quality: BLEU score
- Glossary matches: X terms
- Changes: X unsaved (auto-save in 30s)
- Character/word count
- Keyboard shortcuts helper (?)

FLOATING ACTION PANEL (bottom-right):
- Quick actions based on selection:
  - "Approve & Next" (marks verified, goes to next document)
  - "Flag for Review" (adds to review queue)
  - "Request Human Review"
  - "Regenerate Section" (re-process text/translation)

INTERACTIONS:
- Keyboard navigation: Tab between panels, arrows for navigation
- Shortcuts:
  - Ctrl+S: Manual save
  - Ctrl+Enter: Approve and next
  - Ctrl+/: Toggle glossary panel
  - Alt+1/2/3: Focus panel
- Diff mode: Show changes with green/red highlighting
- Version history: Slider to navigate through save points
- Comments: Add inline comments for reviewers

RESPONSIVE:
- Desktop: Two panels side-by-side (50/50 split)
- Tablet: Tabs for Source/Output with stage indicator
- Mobile: Stack vertically with sticky stage selector

BENEFITS OF TWO-PANEL PROGRESSIVE APPROACH:
- Clearer workflow with explicit approval gates
- More screen space for each document (50% vs 33%)
- Reduced cognitive load - focus on one task at a time
- Better tablet/mobile experience
- Aligns with two-stage pipeline from requirements

Use React, TypeScript, Tailwind CSS, shadcn/ui, @monaco-editor/react or @uiw/react-codemirror, react-pdf for PDF viewing, and Zustand for editor state management.
```

## Prompt 4: Processing Queue Management System

```
Create a dynamic processing queue with Kanban board and list view toggle:

HEADER BAR (sticky):
- Title: "Processing Queue" with live count badge
- View toggle: Kanban (default) | List view
- Filter chips: All, My Documents, Urgent, Failed (show counts)
- Search bar with filters (document name, status, date range)
- Bulk actions dropdown: Pause All, Resume All, Clear Completed
- Resource meter: Shows system capacity (e.g., "Using 7/10 workers")

KANBAN VIEW LAYOUT:

Columns (equal width, horizontal scroll if needed):
1. "Queued" - gray header (#6B7280)
2. "Text Processing" - blue header (#3B82F6) with animated pulse
3. "Translating" - purple header (#8B5CF6) with animated pulse
4. "In Review" - orange header (#F59E0B)
5. "Completed" - green header (#10B981)

Each column:
- Column header with count badge and info icon (tooltip shows average time in stage)
- Scrollable content area (max-height 70vh)
- Drop zone indicator when dragging

DOCUMENT CARDS (in each column):

Card structure (white background, 8px rounded, shadow-sm):
- Header: Document icon + truncated filename (max 30 chars)
- Thumbnail: 120px height image/PDF preview
- Progress section:
  - For processing: animated progress bar with percentage
  - For queued: position in queue (#3 of 12)
  - For completed: checkmark with completion time
- Metadata row: File size | Page count | Language
- Time info: Started/ETA/Completed (contextual)
- Owner avatar and name
- Priority badge (if high/urgent)
- Action buttons (on hover):
  - View details (eye icon)
  - Pause/Resume (play/pause icon)
  - Move to top (arrow up)
  - Cancel (X icon)

Drag and drop:
- Cards draggable between columns (with permission check)
- Visual feedback: card tilts slightly when grabbed
- Drop preview: ghost card shows where it will land
- Invalid drop: red border flash

LIST VIEW LAYOUT:

Table structure with sticky header:
- Columns: Status, Document, Progress, Owner, Priority, Started, ETA, Actions
- Row height: 56px for comfortable clicking
- Alternating row colors for readability
- Hover: highlight row with light blue (#EFF6FF)

List features:
- Sortable columns (click header to sort)
- Inline editing for priority
- Batch selection with checkboxes
- Expandable row for details (chevron icon)
- Status column uses same colors as Kanban headers

FLOATING BATCH PANEL (appears when items selected):
- Shows "X items selected"
- Actions: Change Priority, Reassign, Pause, Resume, Cancel
- Clear selection button

REAL-TIME UPDATES:
- WebSocket connection for live updates
- Progress bars animate smoothly
- New items slide in from top
- Completed items fade out after 5 seconds
- Connection status indicator (green dot when live)

EMPTY STATES:
- Queued: "No documents waiting. Drop files to get started!"
- Processing: "All clear! Workers are ready."
- Completed: "No recently completed documents."
- Include illustration and action button

FILTERS PANEL (collapsible sidebar):
- Date range picker
- Language multi-select
- File type checkboxes
- Owner/User selector
- Priority levels
- Processing status
- Save filter as preset

Use React, TypeScript, Tailwind CSS, react-beautiful-dnd for drag-drop, tanstack/react-table for list view, and Socket.io-client for real-time updates.
```

## Prompt 5: Glossary Manager Interface

```
Create a comprehensive glossary management system for translation consistency:

LAYOUT:
- Split view: 70% main content (glossary table), 30% detail panel
- Sticky header with title and actions
- Responsive: Stack panels on tablet/mobile

HEADER:
- Title: "Translation Glossary" with term count
- Domain selector: All, Religious, Technical, General (tabs)
- Search bar: "Search terms in any language..."
- Action buttons:
  - "Add Term" (primary button, opens modal)
  - "Import" (CSV, TMX, JSON upload)
  - "Export" (download current view)
  - "History" (version control)

MAIN TABLE:

Columns:
1. Source Term (sortable, searchable)
2. Target Translations (by language, expandable)
3. Domain/Category (badge style)
4. Usage Count (how many times applied)
5. Confidence Score (0-100% with color coding)
6. Last Modified (relative time)
7. Status (Active, Review, Deprecated)
8. Actions (Edit, Delete, History)

Row features:
- Expandable: Click to show usage examples from documents
- Inline editing: Double-click cells to edit
- Multi-select: Checkbox for batch operations
- Hover: Show full translations if truncated
- Context menu: Right-click for quick actions

DETAIL PANEL (when term selected):

Sections:
1. Term Information:
   - Source term with language
   - Phonetic/transliteration
   - Part of speech
   - Definition/notes field

2. Translations:
   - Tab for each target language
   - Multiple translation variants with priority
   - Context-specific translations
   - Usage guidelines

3. Usage Examples:
   - Live examples from processed documents
   - Before/after comparison
   - Link to source document

4. Metadata:
   - Created by/date
   - Modified history
   - Approval status
   - Tags

5. Related Terms:
   - Synonyms
   - Antonyms
   - See also references

ADD/EDIT TERM MODAL:

Fields:
- Source term (required)
- Source language (dropdown)
- Translations (dynamic add for each language)
- Domain (multi-select tags)
- Context notes (rich text editor)
- Example usage (optional)
- Priority level (for conflicts)

Validation:
- Check for duplicates
- Verify language compatibility
- Suggest similar existing terms

CONFLICT RESOLUTION UI:

When terms conflict:
- Show side-by-side comparison
- Usage statistics for each variant
- Context where each is used
- Resolution options:
  - Merge terms
  - Set priority order
  - Create context rule
  - Mark for review

VERSION HISTORY VIEW:

- Timeline of changes
- Diff view for modifications
- Restore previous version
- Change attribution
- Bulk revert option

IMPORT/EXPORT:

Import wizard:
- File format detection
- Column mapping interface
- Preview first 10 rows
- Conflict resolution options
- Progress bar for large files

Export options:
- Format: CSV, TMX, JSON, Excel
- Filters: Apply current filters
- Languages: Select which to include
- Include metadata checkbox

QUICK ACTIONS:

Floating action button (bottom-right):
- Quick add term
- Recent additions
- Pending reviews
- Import from clipboard

KEYBOARD SHORTCUTS:
- Ctrl+N: New term
- Ctrl+F: Focus search
- Ctrl+S: Save changes
- Delete: Remove selected
- Ctrl+Z: Undo last action

Use React, TypeScript, Tailwind CSS, tanstack/react-table for the data grid, lexical or draft-js for rich text editing, and react-hook-form for forms.
```

## Prompt Template for Additional Screens

```
For creating new screens, use this structure:

Create a [screen purpose] for [specific functionality]:

LAYOUT:
- [Overall layout structure]
- [Responsive behavior]
- [Key measurements]

[MAIN SECTIONS - repeat for each]:
- [Section name and purpose]
- [Visual hierarchy]
- [Interactive elements]
- [Data displayed]

INTERACTIONS:
- [User actions]
- [Feedback mechanisms]
- [Keyboard shortcuts]
- [Hover/focus states]

STATES:
- [Empty state]
- [Loading state]
- [Error state]
- [Success state]

REAL-TIME FEATURES:
- [Live updates]
- [WebSocket events]
- [Optimistic UI]

Use React, TypeScript, Tailwind CSS, shadcn/ui, and [specific libraries needed].
```

## Key Design Tokens for All Prompts

### Color System
```css
:root {
  --primary: 237 86% 64%;        /* Indigo */
  --primary-foreground: 0 0% 100%;
  --secondary: 270 66% 63%;      /* Purple */
  --secondary-foreground: 0 0% 100%;
  --accent: 38 92% 50%;          /* Saffron */
  --accent-foreground: 0 0% 0%;
  --success: 142 76% 36%;        /* Green */
  --warning: 38 92% 50%;         /* Orange */
  --destructive: 0 84% 60%;      /* Red */
  --muted: 210 40% 96%;
  --card: 0 0% 100%;
  --border: 214 32% 91%;
  --radius: 0.5rem;
}
```

### Typography Scale
- **H1:** 36px/700/1.2
- **H2:** 30px/600/1.3
- **H3:** 24px/600/1.4
- **Body:** 16px/400/1.6
- **Small:** 14px/400/1.5

### Spacing Scale
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

### Animation Guidelines
- **Duration:** 150-300ms for micro-interactions
- **Easing:** ease-out for entrances, ease-in for exits
- **Transform-only:** Use transform and opacity for smooth animations
- **Reduced motion:** Respect prefers-reduced-motion setting

These prompts ensure consistent, high-quality UI generation that aligns with the overall design system and user experience goals of the Enterprise Translation Platform.