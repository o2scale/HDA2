import { 
  FileText, 
  Globe, 
  Tag, 
  User, 
  Calendar,
  Volume2,
  BookOpen,
  Link,
  CheckCircle,
  Clock,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGlossaryStore } from '@/store/glossary-store';
import { formatDistanceToNow, format } from 'date-fns';

const GlossaryDetailPanel = () => {
  const { terms, selectedTermId, setSelectedTerm } = useGlossaryStore();
  
  const selectedTerm = terms.find(term => term.id === selectedTermId);

  if (!selectedTerm) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-3">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-lg">No term selected</h3>
            <p className="text-muted-foreground">
              Select a term from the table to view details
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'review': return 'bg-orange-500 text-white';
      case 'deprecated': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'religious': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'legal': return 'bg-yellow-100 text-yellow-800';
      case 'business': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const targetLanguages = Array.from(new Set(selectedTerm.translations.map(t => t.language)));

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate" title={selectedTerm.sourceTerm}>
              {selectedTerm.sourceTerm}
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {selectedTerm.sourceLanguage}
              </Badge>
              {selectedTerm.phonetic && (
                <span className="text-sm text-muted-foreground">
                  /{selectedTerm.phonetic}/
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`${getStatusColor(selectedTerm.status)}`}
            >
              {selectedTerm.status.toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>Used {selectedTerm.usageCount} times</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <span>{selectedTerm.confidenceScore}% confidence</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Term Information */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Term Information
            </h3>
            
            <div className="space-y-3">
              {selectedTerm.definition && (
                <div>
                  <span className="text-sm font-medium">Definition:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTerm.definition}
                  </p>
                </div>
              )}
              
              {selectedTerm.partOfSpeech && (
                <div>
                  <span className="text-sm font-medium">Part of Speech:</span>
                  <p className="text-sm text-muted-foreground">
                    {selectedTerm.partOfSpeech}
                  </p>
                </div>
              )}
              
              <div>
                <span className="text-sm font-medium">Domain:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTerm.domain.map((domain, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className={`text-xs ${getDomainColor(domain)}`}
                    >
                      {domain}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {selectedTerm.notes && (
                <div>
                  <span className="text-sm font-medium">Notes:</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTerm.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Translations */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Translations
            </h3>
            
            <Tabs defaultValue={targetLanguages[0]} className="space-y-4">
              <TabsList>
                {targetLanguages.map(lang => (
                  <TabsTrigger key={lang} value={lang} className="text-xs">
                    {lang}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {targetLanguages.map(lang => (
                <TabsContent key={lang} value={lang} className="space-y-3">
                  {selectedTerm.translations
                    .filter(t => t.language === lang)
                    .sort((a, b) => a.priority - b.priority)
                    .map((translation, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{translation.text}</span>
                        <div className="flex items-center space-x-2">
                          {translation.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            Priority {translation.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      {translation.context && (
                        <p className="text-xs text-muted-foreground">
                          Context: {translation.context}
                        </p>
                      )}
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </Card>

          {/* Usage Examples */}
          {selectedTerm.usageExamples.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Usage Examples
              </h3>
              
              <div className="space-y-3">
                {selectedTerm.usageExamples.map((example, index) => (
                  <div key={index} className="p-3 bg-muted/20 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{example.documentName}</span>
                      {example.pageNumber && (
                        <Badge variant="outline" className="text-xs">
                          Page {example.pageNumber}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Source:</span>
                        <p className="text-muted-foreground italic">
                          "{example.sourceText}"
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Translation:</span>
                        <p className="text-muted-foreground italic">
                          "{example.translatedText}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Metadata */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Metadata
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created by:</span>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">
                      {selectedTerm.createdBy.split('.').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {selectedTerm.createdBy}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm text-muted-foreground">
                  {format(selectedTerm.createdAt, 'PPp')}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last modified:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(selectedTerm.modifiedAt, { addSuffix: true })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Version:</span>
                <Badge variant="outline" className="text-xs">
                  v{selectedTerm.version}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {selectedTerm.tags.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {selectedTerm.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Related Terms */}
          {(selectedTerm.synonyms.length > 0 || selectedTerm.seeAlso.length > 0) && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Link className="h-4 w-4 mr-2" />
                Related Terms
              </h3>
              
              <div className="space-y-3">
                {selectedTerm.seeAlso.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">See also:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTerm.seeAlso.map((termId, index) => {
                        const relatedTerm = terms.find(t => t.id === termId);
                        return relatedTerm ? (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTerm(termId)}
                            className="h-7 text-xs"
                          >
                            {relatedTerm.sourceTerm}
                          </Button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GlossaryDetailPanel;