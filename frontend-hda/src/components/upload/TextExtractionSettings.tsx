import { Zap, Clock, Target, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useUploadStore } from '@/store/upload-store';
import { useState } from 'react';

const qualityOptions = [
  {
    value: 'fast',
    label: 'Fast',
    description: 'Draft quality',
    time: '~5 min',
    cost: '$0.02/page',
    icon: Zap,
    color: 'text-warning'
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Standard quality',
    time: '~10 min',
    cost: '$0.05/page',
    icon: Target,
    color: 'text-primary'
  },
  {
    value: 'maximum',
    label: 'Maximum',
    description: 'Highest accuracy',
    time: '~20 min',
    cost: '$0.10/page',
    icon: Clock,
    color: 'text-success'
  }
];

const TextExtractionSettings = () => {
  const { settings, updateSettings } = useUploadStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Text Extraction Quality</h3>
      </div>

      <RadioGroup
        value={settings.extractionQuality}
        onValueChange={(value: 'fast' | 'balanced' | 'maximum') => 
          updateSettings({ extractionQuality: value })
        }
        className="space-y-3"
      >
        {qualityOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Label
                htmlFor={option.value}
                className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                  settings.extractionQuality === option.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className={`h-5 w-5 ${option.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      <div className="text-right text-xs text-muted-foreground">
                        <div>{option.time}</div>
                        <div>{option.cost}</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            Advanced Settings
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          {/* Confidence Threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Confidence Threshold</Label>
              <span className="text-sm text-muted-foreground">{settings.confidenceThreshold}%</span>
            </div>
            <Slider
              value={[settings.confidenceThreshold]}
              onValueChange={([value]) => updateSettings({ confidenceThreshold: value })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Higher values mean more accurate but potentially fewer results
            </p>
          </div>

          {/* Image Preprocessing */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Image Preprocessing</Label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="deskew" className="text-sm">Deskew pages</Label>
                <Switch
                  id="deskew"
                  checked={settings.imagePreprocessing.deskew}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      imagePreprocessing: { ...settings.imagePreprocessing, deskew: checked }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="denoise" className="text-sm">Reduce noise</Label>
                <Switch
                  id="denoise"
                  checked={settings.imagePreprocessing.denoise}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      imagePreprocessing: { ...settings.imagePreprocessing, denoise: checked }
                    })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="contrast" className="text-sm">Enhance contrast</Label>
                <Switch
                  id="contrast"
                  checked={settings.imagePreprocessing.contrastEnhancement}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      imagePreprocessing: { ...settings.imagePreprocessing, contrastEnhancement: checked }
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Page Orientation */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Page Orientation</Label>
            <Select
              value={settings.pageOrientation}
              onValueChange={(value: 'auto' | 'portrait' | 'landscape') =>
                updateSettings({ pageOrientation: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="portrait">Portrait</SelectItem>
                <SelectItem value="landscape">Landscape</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default TextExtractionSettings;