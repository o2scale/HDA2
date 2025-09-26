import { useState } from 'react';
import { ChevronRight, Check, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEditorStore } from '@/store/editor-store';
import type { EditorStage } from '@/store/editor-store';

const stageConfig = {
  'source-text': {
    title: 'Source Text Editor',
    description: 'Review and edit extracted text',
    action: 'Approve Text & Proceed',
    nextStage: 'translation' as EditorStage
  },
  'translation': {
    title: 'Translation Editor', 
    description: 'Review and edit translation',
    action: 'Approve Translation & Complete',
    nextStage: 'complete' as EditorStage
  },
  'complete': {
    title: 'Complete',
    description: 'Document processing finished',
    action: 'Export Document',
    nextStage: 'complete' as EditorStage
  }
};

const EditorToolbar = () => {
  const { 
    document, 
    currentStage, 
    completedStages, 
    setStage, 
    completeStage,
    unsavedChanges,
    saveChanges
  } = useEditorStore();
  
  const [isSaving, setIsSaving] = useState(false);

  const handleStageAction = async () => {
    const config = stageConfig[currentStage];
    
    if (currentStage !== 'complete') {
      completeStage(currentStage);
      
      // Auto-save before stage transition
      if (unsavedChanges) {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
        saveChanges();
        setIsSaving(false);
      }
      
      setStage(config.nextStage);
    }
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
    saveChanges();
    setIsSaving(false);
  };

  const isStageCompleted = (stage: EditorStage) => completedStages.includes(stage);
  const canNavigateToStage = (stage: EditorStage) => isStageCompleted(stage) || stage === currentStage;

  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left section - Document info */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="h-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <div>
          <h1 className="font-semibold text-sm">{document?.name}</h1>
          <p className="text-xs text-muted-foreground">
            Page {document?.currentPage} of {document?.pageCount}
          </p>
        </div>
      </div>

      {/* Center section - Stage progress */}
      <div className="flex items-center space-x-2">
        {/* Source Text Stage */}
        <button
          onClick={() => canNavigateToStage('source-text') && setStage('source-text')}
          disabled={!canNavigateToStage('source-text')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentStage === 'source-text'
              ? 'bg-primary text-primary-foreground'
              : isStageCompleted('source-text')
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {isStageCompleted('source-text') ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4 rounded-full bg-current flex items-center justify-center text-xs font-bold">
              1
            </span>
          )}
          <span>Source Text</span>
        </button>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />

        {/* Translation Stage */}
        <button
          onClick={() => canNavigateToStage('translation') && setStage('translation')}
          disabled={!canNavigateToStage('translation')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            currentStage === 'translation'
              ? 'bg-primary text-primary-foreground'
              : isStageCompleted('translation')
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {isStageCompleted('translation') ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4 rounded-full bg-current flex items-center justify-center text-xs font-bold">
              2
            </span>
          )}
          <span>Translation</span>
        </button>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />

        {/* Complete Stage */}
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
            currentStage === 'complete'
              ? 'bg-success text-white'
              : isStageCompleted('complete')
              ? 'bg-success/10 text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {isStageCompleted('complete') ? (
            <Check className="h-4 w-4" />
          ) : (
            <span className="h-4 w-4 rounded-full bg-current flex items-center justify-center text-xs font-bold">
              3
            </span>
          )}
          <span>Complete</span>
        </div>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center space-x-3">
        {unsavedChanges && (
          <Badge variant="secondary" className="text-xs">
            Unsaved changes
          </Badge>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualSave}
          disabled={!unsavedChanges || isSaving}
          className="h-8"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>

        {currentStage !== 'complete' && (
          <Button
            onClick={handleStageAction}
            disabled={isSaving}
            className="h-8"
          >
            {stageConfig[currentStage].action}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;