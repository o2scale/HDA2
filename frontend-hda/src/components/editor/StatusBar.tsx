import { Clock, FileText, BookOpen, Save, Wifi, WifiOff, Keyboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEditorStore } from '@/store/editor-store';
import { formatDistanceToNow } from 'date-fns';

const StatusBar = () => {
  const { 
    textRecognitionScore,
    translationScore,
    glossaryMatches,
    unsavedChanges,
    lastSaveTime,
    sourceText,
    translatedText,
    currentStage
  } = useEditorStore();

  const totalCharacters = currentStage === 'source-text' 
    ? sourceText.reduce((acc, line) => acc + line.text.length, 0)
    : translatedText.reduce((acc, line) => acc + line.text.length, 0);

  const totalWords = currentStage === 'source-text'
    ? sourceText.reduce((acc, line) => acc + line.text.split(/\s+/).filter(Boolean).length, 0)
    : translatedText.reduce((acc, line) => acc + line.text.split(/\s+/).filter(Boolean).length, 0);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const shortcuts = [
    'Ctrl+S: Save',
    'Ctrl+F: Find',
    'Ctrl+Enter: Approve & Next',
    'Alt+1/2: Switch Panel',
    'Ctrl+/: Toggle Glossary'
  ];

  return (
    <TooltipProvider>
      <div className="h-8 bg-card border-t border-border flex items-center justify-between px-4 text-xs">
        {/* Left section - Quality metrics */}
        <div className="flex items-center space-x-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span className={`font-medium ${getScoreColor(textRecognitionScore)}`}>
                  Recognition: {textRecognitionScore}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p>Text Recognition Confidence</p>
                <p className="text-muted-foreground">Based on OCR accuracy</p>
              </div>
            </TooltipContent>
          </Tooltip>

          {currentStage === 'translation' && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1">
                    <span className={`font-medium ${getScoreColor(translationScore)}`}>
                      Translation: {translationScore}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>Translation Quality Score</p>
                    <p className="text-muted-foreground">BLEU score based on reference</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          <Separator orientation="vertical" className="h-4" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3" />
                <span>Glossary: {glossaryMatches} terms</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Active glossary matches found</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center section - Save status and word count */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {unsavedChanges ? (
              <Badge variant="secondary" className="h-5 text-xs">
                <Save className="h-3 w-3 mr-1" />
                Unsaved changes
              </Badge>
            ) : (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Save className="h-3 w-3" />
                <span>
                  {lastSaveTime 
                    ? `Saved ${formatDistanceToNow(lastSaveTime, { addSuffix: true })}` 
                    : 'Not saved'}
                </span>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center space-x-4 text-muted-foreground">
            <span>{totalCharacters.toLocaleString()} characters</span>
            <span>{totalWords.toLocaleString()} words</span>
            <span>{currentStage === 'source-text' ? sourceText.length : translatedText.length} lines</span>
          </div>
        </div>

        {/* Right section - Connection status and shortcuts */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Wifi className="h-3 w-3 text-success" />
            <span>Connected</span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-5 px-2 text-xs">
                <Keyboard className="h-3 w-3 mr-1" />
                Shortcuts
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="text-xs space-y-1">
                <p className="font-medium mb-2">Keyboard Shortcuts</p>
                {shortcuts.map((shortcut, index) => (
                  <p key={index} className="text-muted-foreground">{shortcut}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StatusBar;