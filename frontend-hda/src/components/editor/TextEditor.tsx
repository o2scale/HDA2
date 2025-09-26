import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Minus, 
  Split, 
  Merge,
  MoreHorizontal,
  Copy,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator
} from '@/components/ui/context-menu';
import { useEditorStore } from '@/store/editor-store';
import type { TextLine } from '@/store/editor-store';

interface TextEditorProps {
  isTranslationMode?: boolean;
}

const TextEditor = ({ isTranslationMode = false }: TextEditorProps) => {
  const { 
    sourceText, 
    translatedText, 
    selectedLineId, 
    showConfidence,
    updateSourceText,
    updateTranslatedText,
    verifyLine,
    setSelectedLine,
    deleteSourceLine,
    deleteTranslatedLine,
    currentStage
  } = useEditorStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const editorRef = useRef<any>(null);

  const textData = isTranslationMode ? translatedText : sourceText;
  const updateText = isTranslationMode ? updateTranslatedText : updateSourceText;

  // Get confidence background color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'transparent';
    if (confidence >= 80) return 'rgba(254, 243, 199, 0.6)'; // yellow-100
    return 'rgba(254, 226, 226, 0.6)'; // red-100
  };

  // Convert text lines to editor content
  const editorContent = textData.map(line => line.text).join('\n');

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    
    const lines = value.split('\n');
    lines.forEach((text, index) => {
      const line = textData[index];
      if (line && line.text !== text) {
        updateText(line.id, text);
      }
    });
  };

  const handleLineAction = (lineId: string, action: 'verify' | 'split' | 'merge' | 'delete') => {
    switch (action) {
      case 'verify':
        verifyLine(lineId);
        break;
      case 'delete':
        if (isTranslationMode) {
          deleteTranslatedLine(lineId);
        } else {
          deleteSourceLine(lineId);
        }
        break;
      // Add other actions as needed
      default:
        break;
    }
  };

  // Monaco editor configuration
  const editorOptions = {
    lineNumbers: 'on' as const,
    wordWrap: 'on' as const,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineHeight: 24,
    theme: 'light',
    automaticLayout: true,
    contextmenu: false,
    quickSuggestions: false,
    suggestOnTriggerCharacters: false,
  };

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-sm">
            {isTranslationMode ? 'Translation Editor' : 'Source Text Editor'}
          </h3>
          
          <Badge variant="outline" className="text-xs">
            {textData.length} lines
          </Badge>
          
          {!isTranslationMode && (
            <Badge 
              variant={showConfidence ? "default" : "outline"} 
              className="text-xs cursor-pointer"
              onClick={() => useEditorStore.getState().toggleConfidenceView()}
            >
              Confidence View
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-3 border-b border-border bg-muted/20">
          <Input
            placeholder="Search text... (Ctrl+F)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
            autoFocus
          />
        </div>
      )}

      {/* Line-by-Line Editor */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-3">
          {textData.map((line, index) => (
            <ContextMenu key={line.id}>
              <ContextMenuTrigger asChild>
                <Card 
                  className={`p-3 cursor-text transition-all hover:shadow-sm ${
                    selectedLineId === line.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:border-muted-foreground/20'
                  } ${
                    line.verified ? 'border-success/50 bg-success/5' : ''
                  }`}
                  style={{
                    backgroundColor: showConfidence && !isTranslationMode 
                      ? getConfidenceColor(line.confidence) 
                      : undefined
                  }}
                  onClick={() => setSelectedLine(line.id)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Line Number */}
                    <div className="flex-shrink-0 w-8 text-xs text-muted-foreground font-mono pt-1">
                      {line.lineNumber}
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <textarea
                        value={line.text}
                        onChange={(e) => updateText(line.id, e.target.value)}
                        className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
                        rows={Math.max(1, Math.ceil(line.text.length / 80))}
                        style={{ minHeight: '24px' }}
                      />
                      
                      {/* Confidence Info */}
                      {!isTranslationMode && showConfidence && (
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span>Confidence: {line.confidence}%</span>
                          {line.spans.some(span => span.alternatives) && (
                            <Badge variant="outline" className="text-xs">
                              Alternatives available
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Line Actions */}
                    <div className="flex-shrink-0 flex items-center space-x-1">
                      {line.verified ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLineAction(line.id, 'verify');
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {line.confidence < 80 && !isTranslationMode && (
                        <AlertCircle className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  </div>
                </Card>
              </ContextMenuTrigger>
              
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleLineAction(line.id, 'verify')}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as verified
                </ContextMenuItem>
                <ContextMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Add to glossary
                </ContextMenuItem>
                <ContextMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy text
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Split className="h-4 w-4 mr-2" />
                  Split line
                </ContextMenuItem>
                <ContextMenuItem>
                  <Merge className="h-4 w-4 mr-2" />
                  Merge with next
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Plus className="h-4 w-4 mr-2" />
                  Insert line above
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleLineAction(line.id, 'delete')}>
                  <Minus className="h-4 w-4 mr-2" />
                  Delete line
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
          
          {/* Add Line Button */}
          <Button
            variant="outline"
            className="w-full h-12 border-dashed border-2 border-muted-foreground/30 hover:border-primary/50"
            onClick={() => {
              const newLine: TextLine = {
                id: `line-${Date.now()}`,
                lineNumber: textData.length + 1,
                text: '',
                confidence: 100,
                verified: false,
                spans: []
              };
              
              if (isTranslationMode) {
                useEditorStore.getState().addTranslatedLine(newLine);
              } else {
                useEditorStore.getState().addSourceLine(newLine);
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add new line
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;