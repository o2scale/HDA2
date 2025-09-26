import { Globe, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { useUploadStore } from '@/store/upload-store';
import { useState } from 'react';

const languages = [
  { code: 'english', name: 'English', flag: '🇺🇸' },
  { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
  { code: 'bengali', name: 'Bengali', flag: '🇧🇩' },
  { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
];

const LanguageDetectionSection = () => {
  const { settings, updateSettings } = useUploadStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLanguage = (languageCode: string) => {
    const newLanguages = settings.selectedLanguages.includes(languageCode)
      ? settings.selectedLanguages.filter(lang => lang !== languageCode)
      : [...settings.selectedLanguages, languageCode];
    
    updateSettings({ selectedLanguages: newLanguages });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Globe className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Language Detection</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-detect" className="text-sm font-medium">
            Auto-detect language
          </Label>
          <Switch
            id="auto-detect"
            checked={settings.autoDetectLanguage}
            onCheckedChange={(checked) => updateSettings({ autoDetectLanguage: checked })}
          />
        </div>

        {!settings.autoDetectLanguage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Label className="text-sm text-muted-foreground">
              Select languages to detect
            </Label>
            
            <div className="grid grid-cols-2 gap-2">
              {languages.map((language) => (
                <Button
                  key={language.code}
                  variant={settings.selectedLanguages.includes(language.code) ? "default" : "outline"}
                  size="sm"
                  className="justify-start h-auto p-3"
                  onClick={() => toggleLanguage(language.code)}
                >
                  <span className="mr-2">{language.flag}</span>
                  <span className="text-xs">{language.name}</span>
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {settings.selectedLanguages.map((langCode) => {
                const language = languages.find(l => l.code === langCode);
                return language ? (
                  <Badge key={langCode} variant="secondary" className="text-xs">
                    {language.flag} {language.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </motion.div>
        )}

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
              Per-page language override
              <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Override detected language for specific pages
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((page) => (
                  <div key={page} className="space-y-1">
                    <div className="aspect-[3/4] bg-border rounded border-2 border-dashed flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">{page}</span>
                    </div>
                    <Select defaultValue="auto">
                      <SelectTrigger className="h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </motion.div>
  );
};

export default LanguageDetectionSection;