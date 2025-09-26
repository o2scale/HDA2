import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  FileText, 
  Clock, 
  User, 
  MoreVertical,
  Eye,
  Play,
  Pause,
  ArrowUp,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useQueueStore } from '@/store/queue-store';
import type { DocumentTask, ProcessingStatus } from '@/store/queue-store';
import { formatDistanceToNow, format } from 'date-fns';

const KanbanView = () => {
  const { 
    tasks, 
    updateTaskStatus, 
    pauseTask, 
    resumeTask, 
    cancelTask,
    toggleTaskSelection 
  } = useQueueStore();

  const columns = [
    { 
      id: 'queued', 
      title: 'Queued', 
      color: 'bg-gray-500',
      description: 'Waiting to be processed'
    },
    { 
      id: 'text-processing', 
      title: 'Text Processing', 
      color: 'bg-blue-500',
      description: 'Extracting text from documents'
    },
    { 
      id: 'translating', 
      title: 'Translating', 
      color: 'bg-purple-500',
      description: 'Converting to target language'
    },
    { 
      id: 'in-review', 
      title: 'In Review', 
      color: 'bg-orange-500',
      description: 'Awaiting human review'
    },
    { 
      id: 'completed', 
      title: 'Completed', 
      color: 'bg-green-500',
      description: 'Processing finished'
    }
  ];

  const getTasksByStatus = (status: ProcessingStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      updateTaskStatus(draggableId, destination.droppableId as ProcessingStatus);
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const renderTaskCard = (task: DocumentTask, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 cursor-pointer hover:shadow-md transition-all ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
          } ${task.selected ? 'ring-2 ring-primary' : ''}`}
          onClick={() => toggleTaskSelection(task.id)}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium truncate" title={task.filename}>
                {task.filename.length > 30 ? `${task.filename.substring(0, 30)}...` : task.filename}
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => pauseTask(task.id)}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Move to Top
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => cancelTask(task.id)}
                  className="text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Thumbnail */}
          <div className="h-20 bg-muted rounded mb-3 flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Progress Section */}
          <div className="mb-3">
            {task.status === 'queued' ? (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  #{task.queuePosition} in queue
                </span>
              </div>
            ) : task.status === 'completed' ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-success">Completed</span>
              </div>
            ) : task.status === 'failed' ? (
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Failed</span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>{formatFileSize(task.fileSize)}</span>
            <span>{task.pageCount} pages</span>
            <span>{task.language}</span>
          </div>

          {/* Time Info */}
          <div className="text-xs text-muted-foreground mb-3">
            {task.startedAt ? (
              <div>Started {formatDistanceToNow(task.startedAt, { addSuffix: true })}</div>
            ) : task.estimatedCompletion ? (
              <div>ETA: {format(task.estimatedCompletion, 'HH:mm')}</div>
            ) : task.completedAt ? (
              <div>Completed {formatDistanceToNow(task.completedAt, { addSuffix: true })}</div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.owner.avatar} />
                <AvatarFallback className="text-xs">
                  {task.owner.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{task.owner.name}</span>
            </div>
            
            {task.priority !== 'normal' && (
              <Badge 
                variant="secondary" 
                className={`text-xs text-white ${getPriorityColor(task.priority)}`}
              >
                {task.priority.toUpperCase()}
              </Badge>
            )}
          </div>
        </Card>
      )}
    </Draggable>
  );

  const renderEmptyState = (columnId: string) => {
    const messages = {
      queued: "No documents waiting. Drop files to get started!",
      'text-processing': "All clear! Workers are ready.",
      translating: "No translations in progress.",
      'in-review': "No documents awaiting review.",
      completed: "No recently completed documents."
    };

    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <FileText className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {messages[columnId as keyof typeof messages]}
        </p>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 p-6 min-h-screen overflow-x-auto">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id as ProcessingStatus);
            const avgTime = Math.floor(Math.random() * 30) + 5; // Mock average time
            
            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                {/* Column Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${column.color} ${
                        (column.id === 'text-processing' || column.id === 'translating') 
                          ? 'animate-pulse' 
                          : ''
                      }`} />
                      <h3 className="font-semibold">{column.title}</h3>
                      <Badge variant="secondary" className="h-5">
                        {columnTasks.length}
                      </Badge>
                    </div>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Clock className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average time in {column.title}: {avgTime} min</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">{column.description}</p>
                </div>

                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-96 max-h-[70vh] overflow-y-auto rounded-lg p-3 transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-primary/10 border-2 border-dashed border-primary' 
                          : 'bg-muted/20'
                      }`}
                    >
                      {columnTasks.length === 0 ? (
                        renderEmptyState(column.id)
                      ) : (
                        columnTasks.map((task, index) => renderTaskCard(task, index))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </TooltipProvider>
  );
};

export default KanbanView;