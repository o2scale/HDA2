import { FileText, Save, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useUploadStore } from '@/store/upload-store';
import { useState } from 'react';
// Force cache refresh

const templates = [
  {
    id: 'sanskrit-manuscripts',
    name: 'Sanskrit Manuscripts',
    description: 'Optimized for ancient texts with complex scripts',
    settings: {
      extractionQuality: 'maximum',
      confidenceThreshold: 95,
      autoDetectLanguage: false,
      selectedLanguages: ['hindi', 'marathi'],
      imagePreprocessing: {
        deskew: true,
        denoise: true,
        contrastEnhancement: true,
      }
    }
  },
  {
    id: 'modern-documents',
    name: 'Modern Documents',
    description: 'Fast processing for clean, modern documents',
    settings: {
      extractionQuality: 'balanced',
      confidenceThreshold: 80,
      autoDetectLanguage: true,
      selectedLanguages: ['english'],
      imagePreprocessing: {
        deskew: false,
        denoise: false,
        contrastEnhancement: false,
      }
    }
  },
  {
    id: 'mixed-content',
    name: 'Mixed Content',
    description: 'Balanced settings for varied document types',
    settings: {
      extractionQuality: 'balanced',
      confidenceThreshold: 85,
      autoDetectLanguage: true,
      selectedLanguages: ['english', 'hindi'],
      imagePreprocessing: {
        deskew: true,
        denoise: false,
        contrastEnhancement: true,
      }
    }
  }
];

const TemplateSection = () => {
  const { settings, updateSettings } = useUploadStore();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      updateSettings({
        ...template.settings,
        selectedTemplate: templateId,
      } as any);
    }
  };

  const saveCurrentAsTemplate = () => {
    // In a real app, this would save to backend
    console.log('Saving template:', templateName, settings);
    setShowSaveDialog(false);
    setTemplateName('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Templates</h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm font-medium">Quick Templates</Label>
          <div className="grid gap-2 mt-2">
            {templates.map((template) => (
              <Button
                key={template.id}
                variant={settings.selectedTemplate === template.id ? "default" : "outline"}
                className="justify-start h-auto p-3 text-left"
                onClick={() => applyTemplate(template.id)}
              >
                <div className="space-y-1">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          <Select>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Load saved template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom-1">Custom Template 1</SelectItem>
              <SelectItem value="custom-2">Custom Template 2</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Save className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Settings as Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Current Settings Preview</Label>
                  <div className="p-3 bg-muted/30 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Quality:</span>
                      <Badge variant="outline">{settings.extractionQuality}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-detect:</span>
                      <Badge variant="outline">{settings.autoDetectLanguage ? 'Yes' : 'No'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Languages:</span>
                      <div className="flex gap-1">
                        {settings.selectedLanguages.slice(0, 2).map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                        {settings.selectedLanguages.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{settings.selectedLanguages.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={saveCurrentAsTemplate}
                    disabled={!templateName.trim()}
                    className="flex-1"
                  >
                    Save Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateSection;