import { useState } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import DropZone from '@/components/upload/DropZone';
import FilePreview from '@/components/upload/FilePreview';
import LanguageDetectionSection from '@/components/upload/LanguageDetectionSection';
import TextExtractionSettings from '@/components/upload/TextExtractionSettings';
import PageSelectionSection from '@/components/upload/PageSelectionSection';
import BatchConfigurationSection from '@/components/upload/BatchConfigurationSection';
import TemplateSection from '@/components/upload/TemplateSection';

const UploadCenter = () => {
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Left Panel - Upload Area */}
        <motion.div
          layout
          className={`relative bg-card border-r border-border transition-all duration-300 ${
            isConfigPanelOpen ? 'w-3/5' : 'w-full'
          }`}
        >
          <div className="h-full flex flex-col p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Upload Center</h1>
                <p className="text-muted-foreground">
                  Advanced document processing with content preparation
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)}
              >
                {isConfigPanelOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
              </Button>
            </div>

            {/* Drop Zone - 70% height */}
            <div className="flex-1 mb-6" style={{ height: '70%' }}>
              <DropZone />
            </div>

            {/* File Preview - 30% height */}
            <div className="h-48 border border-border rounded-lg bg-muted/10">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm">Uploaded Files</h3>
              </div>
              <div className="h-36">
                <FilePreview />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Configuration */}
        <AnimatePresence>
          {isConfigPanelOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '40%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-card border-l border-border overflow-hidden"
            >
              <div className="h-full flex flex-col">
                {/* Configuration Header */}
                <div className="p-6 border-b border-border bg-muted/20">
                  <div>
                    <h2 className="text-lg font-semibold">Configuration</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Customize processing settings
                    </p>
                  </div>
                </div>

                {/* Configuration Content */}
                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-8">
                    <LanguageDetectionSection />
                    <Separator />
                    
                    <TextExtractionSettings />
                    <Separator />
                    
                    <PageSelectionSection />
                    <Separator />
                    
                    <TemplateSection />
                    <Separator />
                    
                    <BatchConfigurationSection />
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Configuration Toggle */}
        {!isConfigPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 lg:hidden"
          >
            <Button
              onClick={() => setIsConfigPanelOpen(true)}
              size="lg"
              className="shadow-lg"
            >
              <PanelRightOpen className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UploadCenter;