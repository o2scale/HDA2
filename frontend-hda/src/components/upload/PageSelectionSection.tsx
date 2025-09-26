import { CheckSquare, Square, Grid3x3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadStore } from '@/store/upload-store';
import { useState } from 'react';

const PageSelectionSection = () => {
  const { files } = useUploadStore();
  const [pageRange, setPageRange] = useState('');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  // Mock pages for demonstration - in real app this would come from uploaded files
  const totalPages = files.reduce((acc, file) => acc + (file.pageCount || 1), 0);
  const mockPages = Array.from({ length: Math.min(totalPages, 12) }, (_, i) => ({
    id: i + 1,
    pageNumber: i + 1,
    selected: selectedPages.has(i + 1),
    thumbnail: `/api/placeholder/120/150?page=${i + 1}`,
  }));

  const togglePage = (pageNumber: number) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageNumber)) {
      newSelected.delete(pageNumber);
    } else {
      newSelected.add(pageNumber);
    }
    setSelectedPages(newSelected);
  };

  const selectAll = () => {
    setSelectedPages(new Set(mockPages.map(p => p.pageNumber)));
  };

  const selectOdd = () => {
    setSelectedPages(new Set(mockPages.filter(p => p.pageNumber % 2 === 1).map(p => p.pageNumber)));
  };

  const selectEven = () => {
    setSelectedPages(new Set(mockPages.filter(p => p.pageNumber % 2 === 0).map(p => p.pageNumber)));
  };

  const selectNone = () => {
    setSelectedPages(new Set());
  };

  const parsePageRange = (range: string) => {
    const pages = new Set<number>();
    const parts = range.split(',');
    
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num)) {
          pages.add(num);
        }
      }
    });
    
    setSelectedPages(pages);
  };

  if (files.length === 0 || totalPages === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <Grid3x3 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-muted-foreground">Page Selection</h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <Grid3x3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Upload files to select specific pages</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Grid3x3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Page Selection</h3>
        <span className="text-sm text-muted-foreground">({selectedPages.size}/{totalPages} selected)</span>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={selectOdd}>
          Select Odd
        </Button>
        <Button variant="outline" size="sm" onClick={selectEven}>
          Select Even
        </Button>
        <Button variant="outline" size="sm" onClick={selectNone}>
          Clear
        </Button>
      </div>

      {/* Page Range Input */}
      <div className="space-y-2">
        <Label htmlFor="page-range" className="text-sm font-medium">
          Page Range
        </Label>
        <div className="flex space-x-2">
          <Input
            id="page-range"
            placeholder="e.g., 1-5, 8, 10-15"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => parsePageRange(pageRange)}
            disabled={!pageRange.trim()}
          >
            Apply
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Use commas to separate pages and hyphens for ranges
        </p>
      </div>

      {/* Page Grid */}
      <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto">
        {mockPages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`relative aspect-[3/4] bg-muted rounded border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              page.selected 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => togglePage(page.pageNumber)}
          >
            {/* Thumbnail placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/20 rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground font-medium">
                {page.pageNumber}
              </span>
            </div>

            {/* Selection Indicator */}
            <div className="absolute top-1 right-1">
              {page.selected ? (
                <CheckSquare className="h-4 w-4 text-primary bg-background rounded border" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground bg-background rounded border" />
              )}
            </div>

            {/* Page Number */}
            <div className="absolute bottom-1 left-1 right-1">
              <div className="bg-background/80 backdrop-blur-sm rounded px-1 py-0.5 text-center">
                <span className="text-xs font-medium">Page {page.pageNumber}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PageSelectionSection;