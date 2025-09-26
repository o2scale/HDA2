import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useEditorStore } from '@/store/editor-store';

const DocumentPanel = () => {
  const { document } = useEditorStore();
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(400, prev + 25));
  const handleZoomOut = () => setZoom(prev => Math.max(25, prev - 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No document loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/5">
      {/* Document Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {document.type.toUpperCase()}
          </Badge>
          <span className="text-sm font-medium">{document.name}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 25}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium min-w-[60px] text-center">
            {zoom}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 400}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={showThumbnails ? 'bg-muted' : ''}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Page Thumbnails Sidebar */}
        {showThumbnails && (
          <div className="w-20 border-r border-border bg-card p-2 space-y-2">
            {Array.from({ length: document.pageCount }, (_, i) => (
              <Card
                key={i}
                className={`p-2 cursor-pointer transition-colors aspect-[3/4] flex items-center justify-center ${
                  document.currentPage === i + 1 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="text-center">
                  <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-xs font-medium">{i + 1}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Main Document Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Page Navigation */}
          <div className="flex items-center justify-between p-3 bg-card border-b border-border">
            <Button
              variant="outline"
              size="sm"
              disabled={document.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {document.currentPage} of {document.pageCount}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={document.currentPage >= document.pageCount}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Document Viewer Area */}
          <div className="flex-1 overflow-auto bg-muted/20 p-4">
            <div className="max-w-full h-full flex items-center justify-center">
              {document.type === 'pdf' ? (
                <div 
                  className="bg-white shadow-lg border border-border rounded"
                  style={{ 
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* PDF placeholder */}
                  <div className="w-[600px] h-[800px] flex items-center justify-center bg-white">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">PDF Document</p>
                      <p className="text-sm text-muted-foreground">
                        Page {document.currentPage} content would appear here
                      </p>
                      <div className="mt-6 p-4 bg-muted/20 rounded text-left text-sm">
                        <p className="font-medium mb-2 text-center">Sample Content:</p>
                        <p>गणेश चतुर्थी हिंदू धर्म का एक प्रमुख त्योहार है।</p>
                        <p>यह भगवान गणेश के जन्म का उत्सव है।</p>
                        <p>इस दिन लोग गणेश की मूर्ति स्थापित करते हैं।</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="bg-white shadow-lg border border-border rounded p-4"
                  style={{ 
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Image placeholder */}
                  <div className="w-[500px] h-[600px] flex items-center justify-center bg-muted/10 rounded">
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">Image Document</p>
                      <p className="text-sm text-muted-foreground">
                        Image content would appear here
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPanel;