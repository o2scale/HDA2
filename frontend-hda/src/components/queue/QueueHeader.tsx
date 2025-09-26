import { useState } from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Users,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { useQueueStore } from '@/store/queue-store';
import type { ProcessingStatus, ViewMode } from '@/store/queue-store';

const QueueHeader = () => {
  const { 
    tasks, 
    viewMode, 
    filters, 
    metrics,
    selectedTasks,
    isConnected,
    setViewMode, 
    updateFilters,
    clearFilters,
    pauseAllTasks,
    resumeAllTasks,
    clearCompleted
  } = useQueueStore();

  const [showFilters, setShowFilters] = useState(false);

  // Calculate counts by status
  const statusCounts = {
    all: tasks.length,
    queued: tasks.filter(t => t.status === 'queued').length,
    'text-processing': tasks.filter(t => t.status === 'text-processing').length,
    translating: tasks.filter(t => t.status === 'translating').length,
    'in-review': tasks.filter(t => t.status === 'in-review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
    'my-documents': tasks.filter(t => t.owner.id === 'user1').length // Mock current user
  };

  const resourceUsage = (metrics.activeWorkers / metrics.totalWorkers) * 100;

  const filterChips = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'my-documents', label: 'My Documents', count: statusCounts['my-documents'] },
    { key: 'urgent', label: 'Urgent', count: statusCounts.urgent },
    { key: 'failed', label: 'Failed', count: statusCounts.failed }
  ];

  const handleFilterChip = (key: string) => {
    if (key === 'all') {
      updateFilters({ status: 'all', priorities: [] });
    } else if (key === 'my-documents') {
      updateFilters({ owners: ['user1'] });
    } else if (key === 'urgent') {
      updateFilters({ priorities: ['urgent'] });
    } else if (key === 'failed') {
      updateFilters({ status: 'failed' as ProcessingStatus });
    }
  };

  return (
    <TooltipProvider>
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        {/* Main Header */}
        <div className="flex items-center justify-between p-6">
          {/* Left section - Title and connection status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Processing Queue</h1>
              <Badge variant="secondary" className="h-6">
                {tasks.length}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-destructive'}`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Right section - View controls and bulk actions */}
          <div className="flex items-center space-x-4">
            {/* Resource Usage */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div className="w-24">
                    <Progress value={resourceUsage} className="h-2" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {metrics.activeWorkers}/{metrics.totalWorkers}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>System Capacity: {metrics.activeWorkers} of {metrics.totalWorkers} workers active</p>
              </TooltipContent>
            </Tooltip>

            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-md p-1">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="h-7"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-7"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>

            {/* Bulk Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={pauseAllTasks}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={resumeAllTasks}>
                  <Play className="h-4 w-4 mr-2" />
                  Resume All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearCompleted}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 pb-4 space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-9"
              />
            </div>
            
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {(filters.search || filters.status !== 'all' || filters.priorities.length > 0) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filterChips.map((chip) => (
              <Button
                key={chip.key}
                variant={
                  (chip.key === 'all' && filters.status === 'all') ||
                  (chip.key === 'urgent' && filters.priorities.includes('urgent')) ||
                  (chip.key === 'failed' && filters.status === 'failed') ||
                  (chip.key === 'my-documents' && filters.owners.includes('user1'))
                    ? 'default' 
                    : 'outline'
                }
                size="sm"
                onClick={() => handleFilterChip(chip.key)}
                className="h-8 flex-shrink-0"
              >
                {chip.label}
                <Badge variant="secondary" className="ml-2 h-5 text-xs">
                  {chip.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Items Bar */}
        {selectedTasks.length > 0 && (
          <div className="bg-primary/10 border-t border-border px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedTasks.length} items selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Change Priority
                </Button>
                <Button variant="outline" size="sm">
                  Reassign
                </Button>
                <Button variant="outline" size="sm">
                  Pause
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => useQueueStore.getState().setSelectedTasks([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default QueueHeader;