import { useState, useEffect } from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Languages, 
  Lightbulb, 
  Target,
  PanelRightOpen,
  PanelRightClose,
  X
} from 'lucide-react';
import EditorToolbar from './EditorToolbar';
import DocumentPanel from './DocumentPanel';
import TextEditor from './TextEditor';
import StatusBar from './StatusBar';
import { useEditorStore } from '@/store/editor-store';

const ProgressiveEditor = () => {
  const { 
    currentStage, 
    panelSizes, 
    setPanelSizes,
    isGlossaryPanelOpen,
    toggleGlossaryPanel,
    activeGlossary,
    sourceText,
    translatedText,
    isReviewSectionDismissed,
    dismissReviewSection
  } = useEditorStore();

  const [scrollSync, setScrollSync] = useState(true);

  const isTranslationStage = currentStage === 'translation';

  // Calculate verified lines percentage
  const getProgress = () => {
    const textData = isTranslationStage ? translatedText : sourceText;
    const verified = textData.filter(line => line.verified).length;
    return Math.round((verified / textData.length) * 100);
  };

  const renderGlossaryPanel = () => (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      {/* Glossary Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Active Glossary</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleGlossaryPanel}
            className="h-6 w-6 p-0"
          >
            <PanelRightClose className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {activeGlossary.length} terms available
        </p>
      </div>

      {/* Glossary Content */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {activeGlossary.map((term) => (
          <Card key={term.id} className="p-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-medium text-sm">{term.source}</div>
                <Badge variant="outline" className="text-xs">
                  {term.category}
                </Badge>
              </div>
              <div className="text-sm text-primary">{term.target}</div>
              {term.definition && (
                <p className="text-xs text-muted-foreground">
                  {term.definition}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Glossary Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Button variant="outline" size="sm" className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          Manage Glossary
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Target className="h-4 w-4 mr-2" />
          Import Terms
        </Button>
      </div>
    </div>
  );

  const renderStageSpecificInfo = () => {
    if (isReviewSectionDismissed) return null;
    
    if (currentStage === 'source-text') {
      return (
        <Card className="p-4 bg-blue-50 border-blue-200 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissReviewSection}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-start space-x-3 pr-8">
            <div className="p-2 bg-blue-100 rounded-full">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-900 mb-1">
                Source Text Review
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Review the extracted text for accuracy. Focus on low-confidence areas highlighted in red.
              </p>
              <div className="flex items-center space-x-4 text-xs text-blue-600">
                <span>Progress: {getProgress()}% verified</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Low confidence: {sourceText.filter(l => l.confidence < 80).length} lines</span>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (currentStage === 'translation') {
      return (
        <Card className="p-4 bg-green-50 border-green-200 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={dismissReviewSection}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-start space-x-3 pr-8">
            <div className="p-2 bg-green-100 rounded-full">
              <Languages className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-green-900 mb-1">
                Translation Review
              </h4>
              <p className="text-sm text-green-700 mb-3">
                Review and edit the generated translation. Use the glossary panel for consistent terminology.
              </p>
              <div className="flex items-center space-x-4 text-xs text-green-600">
                <span>Progress: {getProgress()}% verified</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Glossary matches: {useEditorStore.getState().glossaryMatches}</span>
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Toolbar */}
      <EditorToolbar />

      {/* Stage-specific guidance spanning both panels */}
      {renderStageSpecificInfo() && (
        <div className="p-4 border-b border-border">
          {renderStageSpecificInfo()}
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={setPanelSizes}
          className="flex-1"
        >
          {/* Left Panel - Document Viewer */}
          <ResizablePanel defaultSize={panelSizes[0]} minSize={30}>
            <div className="h-full">
              <DocumentPanel />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Text Editor */}
          <ResizablePanel defaultSize={panelSizes[1]} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Editor Controls */}
              <div className="p-4 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant={scrollSync ? "default" : "outline"} className="text-xs">
                      Scroll Sync: {scrollSync ? 'On' : 'Off'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setScrollSync(!scrollSync)}
                      className="h-6 text-xs"
                    >
                      Toggle
                    </Button>
                  </div>
                  
                  {!isGlossaryPanelOpen && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleGlossaryPanel}
                      className="h-7"
                    >
                      <PanelRightOpen className="h-4 w-4 mr-2" />
                      Glossary
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Text Editor */}
              <div className="flex-1">
                <TextEditor isTranslationMode={isTranslationStage} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Glossary Panel */}
        {isGlossaryPanelOpen && renderGlossaryPanel()}
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default ProgressiveEditor;