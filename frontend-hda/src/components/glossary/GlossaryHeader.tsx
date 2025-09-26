import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  History, 
  Filter,
  X,
  MoreVertical,
  Trash2,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGlossaryStore } from '@/store/glossary-store';
import type { TermDomain, TermStatus } from '@/store/glossary-store';

const GlossaryHeader = () => {
  const { 
    terms,
    filters,
    selectedTermIds,
    updateFilters,
    clearFilters,
    toggleAddModal,
    toggleImportModal,
    toggleHistoryModal,
    bulkUpdateStatus,
    bulkUpdateDomain,
    bulkDelete,
    exportTerms,
    getFilteredTerms
  } = useGlossaryStore();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredTerms = getFilteredTerms();
  const hasFilters = filters.search || filters.domain !== 'all' || filters.status !== 'all' || 
                    filters.sourceLanguage !== 'all' || filters.targetLanguage !== 'all' || 
                    filters.tags.length > 0;

  const domainCounts = {
    all: terms.length,
    religious: terms.filter(t => t.domain.includes('religious')).length,
    technical: terms.filter(t => t.domain.includes('technical')).length,
    general: terms.filter(t => t.domain.includes('general')).length,
    medical: terms.filter(t => t.domain.includes('medical')).length,
    legal: terms.filter(t => t.domain.includes('legal')).length,
    business: terms.filter(t => t.domain.includes('business')).length
  };

  const handleExport = async (format: 'csv' | 'json' | 'tmx') => {
    try {
      const blob = await exportTerms(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `glossary.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTermIds.length === 0) return;

    switch (action) {
      case 'delete':
        await bulkDelete(selectedTermIds);
        break;
      case 'activate':
        await bulkUpdateStatus(selectedTermIds, 'active');
        break;
      case 'review':
        await bulkUpdateStatus(selectedTermIds, 'review');
        break;
      case 'deprecate':
        await bulkUpdateStatus(selectedTermIds, 'deprecated');
        break;
    }
  };

  const languages = Array.from(new Set([
    ...terms.map(t => t.sourceLanguage),
    ...terms.flatMap(t => t.translations.map(tr => tr.language))
  ])).sort();

  return (
    <div className="sticky top-0 z-40 bg-card border-b border-border">
      {/* Main Header */}
      <div className="flex items-center justify-between p-6 pb-4">
        {/* Left - Title and count */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">Translation Glossary</h1>
          <Badge variant="secondary" className="h-6">
            {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'}
          </Badge>
          {hasFilters && (
            <Badge variant="outline" className="h-6">
              Filtered from {terms.length}
            </Badge>
          )}
        </div>

        {/* Right - Action buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleHistoryModal}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('tmx')}>
                Export as TMX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleImportModal}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

          <Button
            onClick={toggleAddModal}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Term
          </Button>
        </div>
      </div>

      {/* Domain Tabs */}
      <div className="px-6 pb-4">
        <Tabs 
          value={filters.domain} 
          onValueChange={(value) => updateFilters({ domain: value as TermDomain | 'all' })}
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all" className="text-xs">
              All ({domainCounts.all})
            </TabsTrigger>
            <TabsTrigger value="religious" className="text-xs">
              Religious ({domainCounts.religious})
            </TabsTrigger>
            <TabsTrigger value="technical" className="text-xs">
              Technical ({domainCounts.technical})
            </TabsTrigger>
            <TabsTrigger value="general" className="text-xs">
              General ({domainCounts.general})
            </TabsTrigger>
            <TabsTrigger value="medical" className="text-xs">
              Medical ({domainCounts.medical})
            </TabsTrigger>
            <TabsTrigger value="legal" className="text-xs">
              Legal ({domainCounts.legal})
            </TabsTrigger>
            <TabsTrigger value="business" className="text-xs">
              Business ({domainCounts.business})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and Filters */}
      <div className="px-6 pb-4 space-y-4">
        {/* Main search bar */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search terms in any language..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-9"
            />
          </div>
          
          <Button
            variant={showAdvancedFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => updateFilters({ status: value as TermStatus | 'all' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Source Language</label>
              <Select
                value={filters.sourceLanguage}
                onValueChange={(value) => updateFilters({ sourceLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Target Language</label>
              <Select
                value={filters.targetLanguage}
                onValueChange={(value) => updateFilters({ targetLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Confidence</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.confidence[0]}
                  onChange={(e) => updateFilters({ 
                    confidence: [parseInt(e.target.value) || 0, filters.confidence[1]] 
                  })}
                  className="w-16 h-8"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.confidence[1]}
                  onChange={(e) => updateFilters({ 
                    confidence: [filters.confidence[0], parseInt(e.target.value) || 100] 
                  })}
                  className="w-16 h-8"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedTermIds.length > 0 && (
        <div className="bg-primary/10 border-t border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedTermIds.length} terms selected
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Change Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                    Set as Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('review')}>
                    Set as Review
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('deprecate')}>
                    Set as Deprecated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('delete')}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => useGlossaryStore.getState().setSelectedTermIds([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryHeader;