# Branding & Style Guide + Accessibility Requirements

## Visual Identity

**Brand Guidelines:** The platform should convey trustworthiness, spiritual respect, and technical sophistication. For HDA's implementation, incorporate subtle spiritual elements while maintaining professional enterprise software aesthetics.

## Color Palette

| Color Type | Hex Code | Usage |
|------------|----------|--------|
| Primary | #4F46E5 | Deep indigo - primary actions, headers, active states |
| Secondary | #7C3AED | Purple - secondary actions, highlights |
| Accent | #F59E0B | Saffron/orange - notifications, alerts, spiritual touch |
| Success | #10B981 | Green - completed, verified, positive states |
| Warning | #F59E0B | Orange - cautions, pending reviews |
| Error | #EF4444 | Red - errors, failures, critical alerts |
| Neutral | #1F2937, #6B7280, #E5E7EB | Text hierarchy, borders, backgrounds |

### Extended Color System for Translation Platform

```css
:root {
  /* Primary Brand Colors */
  --primary: 237 86% 64%;        /* Indigo #4F46E5 */
  --primary-foreground: 0 0% 100%;
  --secondary: 270 66% 63%;      /* Purple #7C3AED */
  --secondary-foreground: 0 0% 100%;
  --accent: 38 92% 50%;          /* Saffron #F59E0B */
  --accent-foreground: 0 0% 0%;

  /* Semantic Colors */
  --success: 142 76% 36%;        /* Green #10B981 */
  --warning: 38 92% 50%;         /* Orange #F59E0B */
  --destructive: 0 84% 60%;      /* Red #EF4444 */

  /* UI Colors */
  --muted: 210 40% 96%;          /* Light gray backgrounds */
  --card: 0 0% 100%;             /* White cards */
  --popover: 0 0% 100%;          /* White popovers */
  --border: 214 32% 91%;         /* Light gray borders */
  --input: 214 32% 91%;          /* Input borders */
  --ring: 237 86% 64%;           /* Focus rings */

  /* Specialized Colors */
  --glossary: 270 66% 63%;       /* Purple for glossary terms */
  --confidence-high: 142 76% 36%;   /* Green for high confidence */
  --confidence-medium: 38 92% 50%;  /* Orange for medium confidence */
  --confidence-low: 0 84% 60%;      /* Red for low confidence */

  /* Processing States */
  --status-queued: 220 13% 46%;     /* Gray */
  --status-processing: 217 91% 60%; /* Blue */
  --status-complete: 142 76% 36%;   /* Green */
  --status-error: 0 84% 60%;        /* Red */

  /* Spacing & Layout */
  --radius: 0.5rem;
  --font-sans: Inter, system-ui, sans-serif;
  --font-mono: JetBrains Mono, monospace;
}

/* Dark Mode Support */
.dark {
  --primary: 237 86% 70%;
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --muted: 217 33% 17%;
  --card: 217 33% 17%;
  --border: 217 33% 17%;
  --input: 217 33% 17%;
}
```

## Typography

### Font Families
- **Primary:** Inter (clean, modern, excellent readability)
- **Secondary:** Noto Sans (supports all Indian languages)
- **Monospace:** JetBrains Mono (for code/text editing views)

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|--------|
| H1 | 36px (2.25rem) | 700 | 1.2 | Page titles, major headings |
| H2 | 30px (1.875rem) | 600 | 1.3 | Section headings |
| H3 | 24px (1.5rem) | 600 | 1.4 | Subsection headings |
| H4 | 20px (1.25rem) | 600 | 1.4 | Card titles, small headings |
| Body Large | 18px (1.125rem) | 400 | 1.6 | Emphasized body text |
| Body | 16px (1rem) | 400 | 1.6 | Default body text |
| Body Small | 14px (0.875rem) | 400 | 1.5 | Secondary information |
| Caption | 12px (0.75rem) | 500 | 1.4 | Labels, captions |

### Typography Implementation

```css
/* CSS Custom Properties for Typography */
:root {
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-snug: 1.3;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.5;
  --line-height-loose: 1.6;
}

/* Typography Classes */
.text-h1 {
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.text-h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
}

.text-body {
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-loose);
}
```

## Iconography

**Icon Library:** Lucide Icons (open-source, comprehensive, consistent style)

### Usage Guidelines

- Use outline style for navigation and actions
- Filled icons only for selected/active states
- Maintain 24px base size, scale proportionally
- Include tooltips for icon-only buttons
- Custom icons for OCR, translation, and glossary features

### Custom Icons for Platform

```typescript
// Custom icon components for specialized features
export const OCRIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 8h8M8 12h6M8 16h4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const TranslateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M5 8l6 6M4 14l6.5-6.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M14 4v4M18 4v4M14 6h4" stroke="currentColor" strokeWidth="2"/>
    <path d="M14 20l4-8 4 8M16 18h4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const GlossaryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 8h2M6 12h2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
```

## Spacing & Layout

### Grid System
**Grid System:** 12-column grid with 24px gutters on desktop, 16px on tablet, 12px on mobile

### Spacing Scale
- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128
- Use consistently for padding, margins, gaps

```css
/* Spacing Utilities */
:root {
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */
}
```

## White-Label Customization

### Theme Implementation with CSS Variables

The platform supports complete white-label customization through a theming engine:

**Customization Points:**
- Primary/secondary colors via CSS variables
- Logo upload and placement
- Font family selection (from curated list)
- Accent color for brand personality
- Corner radius preference (via --radius variable)
- Light/dark mode themes

### White-Label Theme Generator

```typescript
interface BrandTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    headingWeight: number;
  };
  layout: {
    borderRadius: number;
    spacing: number;
  };
  logo: {
    url: string;
    height: number;
  };
}

export const generateThemeCSS = (theme: BrandTheme): string => {
  return `
    :root {
      --primary: ${theme.colors.primary};
      --secondary: ${theme.colors.secondary};
      --accent: ${theme.colors.accent};
      --font-sans: ${theme.typography.fontFamily}, system-ui, sans-serif;
      --radius: ${theme.layout.borderRadius}px;
      --logo-url: url('${theme.logo.url}');
      --logo-height: ${theme.logo.height}px;
    }
  `;
};
```

# Accessibility Requirements

## Compliance Target

**Standard:** WCAG 2.1 Level AA compliance as the baseline, with AAA for critical features

## Key Requirements

### Visual Accessibility

**Color Contrast:**
- **Text:** Minimum 4.5:1 contrast ratio for normal text (16px and below)
- **Large Text:** Minimum 3:1 contrast ratio for text 18pt+ or 14pt+ bold
- **UI Elements:** Minimum 3:1 contrast ratio for interactive elements
- **Focus Indicators:** Minimum 3:1 contrast ratio against background

**Visual Design:**
- Text sizing: Base font 16px minimum, scalable to 200% without horizontal scrolling
- Focus indicators: Visible 2px minimum outline with high contrast
- Color independence: Never rely solely on color to convey information
- Motion sensitivity: Respect prefers-reduced-motion setting

### Interaction Accessibility

**Keyboard Navigation:**
- All interactive elements accessible via keyboard
- Logical tab order throughout the application
- Visible focus indicators on all focusable elements
- Keyboard shortcuts documented and configurable

**Touch Targets:**
- Minimum 44x44px for mobile touch targets
- Minimum 24x24px for desktop with adequate spacing
- No overlapping interactive elements
- Sufficient spacing between adjacent targets

### Content Accessibility

**Semantic HTML:**
- Proper heading hierarchy (H1-H6) without skipped levels
- Descriptive link text (avoid "click here")
- Form labels associated with inputs
- Lists for grouped content
- Tables with proper headers

**Alternative Content:**
- Alt text for all informative images
- Captions for videos (when applicable)
- Transcripts for audio content
- Descriptive titles for icons and graphics

## Implementation Guidelines

### React Accessibility Patterns

```typescript
// Accessible form component
interface AccessibleFormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
}

export const AccessibleForm: React.FC<AccessibleFormProps> = ({ children, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      role="form"
      aria-labelledby="form-title"
      noValidate // We handle validation
    >
      <fieldset>
        <legend id="form-title" className="sr-only">
          Document Upload Form
        </legend>
        {children}
      </fieldset>
    </form>
  );
};

// Accessible button component
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ...props
}) => {
  return (
    <button
      type="button"
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      {children}
    </button>
  );
};
```

### ARIA Implementation

```typescript
// Progress indicator with proper ARIA
export const AccessibleProgress: React.FC<{
  value: number;
  max: number;
  label: string;
}> = ({ value, max, label }) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      aria-describedby="progress-description"
    >
      <div className="progress-bar" style={{ width: `${(value / max) * 100}%` }} />
      <span id="progress-description" className="sr-only">
        {`${label}: ${value} of ${max} complete`}
      </span>
    </div>
  );
};

// Live region for status updates
export const LiveRegion: React.FC<{
  message: string;
  priority?: 'polite' | 'assertive';
}> = ({ message, priority = 'polite' }) => {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};
```

## OCR/Translation-Specific Accessibility

### Two-Panel Progressive Workflow Accessibility

**Stage Announcements:**
```typescript
// Announce stage changes to screen readers
const announceStageChange = (stage: string) => {
  const announcement = `Now in ${stage} stage. Use Alt+1 for OCR review, Alt+2 for translation review.`;

  // Update live region
  setLiveRegionMessage(announcement);

  // Set focus to main content
  const mainContent = document.getElementById('main-content');
  mainContent?.focus();
};
```

**Keyboard Navigation:**
- Alt+1: Navigate to OCR stage
- Alt+2: Navigate to Translation stage
- Tab/Shift+Tab: Move between panels
- Ctrl+F: Open search within document
- Escape: Cancel current operation

### Multi-Language Support

**Language Attributes:**
```html
<!-- Properly marked language sections -->
<div lang="hi" dir="ltr">
  Sanskrit text content here
</div>

<div lang="en" dir="ltr">
  English translation here
</div>

<!-- Mixed direction support -->
<div dir="auto">
  Content with mixed text direction
</div>
```

**Screen Reader Pronunciation:**
```typescript
// Pronunciation guides for Sanskrit terms
export const PronunciationGuide: React.FC<{
  term: string;
  pronunciation: string;
}> = ({ term, pronunciation }) => {
  return (
    <span>
      {term}
      <span className="sr-only">
        , pronounced {pronunciation}
      </span>
    </span>
  );
};
```

### Long Document Navigation

**Skip Links:**
```typescript
export const SkipNavigation: React.FC = () => {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#document-navigation" className="skip-link">
        Skip to document navigation
      </a>
      <a href="#translation-tools" className="skip-link">
        Skip to translation tools
      </a>
    </div>
  );
};
```

**Table of Contents:**
```typescript
export const DocumentTOC: React.FC<{
  sections: Array<{ id: string; title: string; level: number }>;
}> = ({ sections }) => {
  return (
    <nav role="navigation" aria-labelledby="toc-heading">
      <h2 id="toc-heading">Table of Contents</h2>
      <ul>
        {sections.map((section) => (
          <li key={section.id} className={`toc-level-${section.level}`}>
            <a href={`#${section.id}`}>
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

## Testing Strategy

### Automated Testing
```typescript
// Accessibility testing with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('DocumentUpload should not have accessibility violations', async () => {
  const { container } = render(<DocumentUpload />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Custom accessibility matchers
expect(screen.getByRole('button')).toBeAccessible();
expect(screen.getByRole('form')).toHaveProperLabels();
```

### Manual Testing Checklist
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces content changes appropriately
- [ ] Focus management works correctly during stage transitions
- [ ] Color contrast meets WCAG AA standards
- [ ] Text scales to 200% without horizontal scrolling
- [ ] All images have appropriate alt text
- [ ] Form validation errors are accessible
- [ ] Live regions announce processing updates

### Testing Tools
- **axe DevTools** - Automated accessibility scanning
- **WAVE** - Web accessibility evaluation
- **Lighthouse** - Performance and accessibility auditing
- **NVDA/JAWS** - Screen reader testing
- **Keyboard only** - Navigation testing without mouse

This comprehensive approach to branding and accessibility ensures the platform maintains professional visual standards while being usable by everyone, regardless of ability or assistive technology needs.