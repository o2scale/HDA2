import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronUp,
  Eye,
  Play,
  Pause,
  X,
  ArrowUp,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQueueStore } from '@/store/queue-store';
import type { DocumentTask } from '@/store/queue-store';
import { formatDistanceToNow, format } from 'date-fns';

const columnHelper = createColumnHelper<DocumentTask>();

const ListView = () => {
  const { 
    tasks, 
    selectedTasks,
    setSelectedTasks,
    toggleTaskSelection,
    updateTaskPriority,
    pauseTask,
    resumeTask,
    cancelTask
  } = useQueueStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRowExpansion = (taskId: string) => {
    setExpandedRows(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-gray-500';
      case 'text-processing': return 'bg-blue-500';
      case 'translating': return 'bg-purple-500';
      case 'in-review': return 'bg-orange-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'normal': return 'text-blue-700 bg-blue-100';
      case 'low': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (value) {
              setSelectedTasks(tasks.map(task => task.id));
            } else {
              setSelectedTasks([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedTasks.includes(row.original.id)}
          onCheckedChange={() => toggleTaskSelection(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    }),
    columnHelper.display({
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleRowExpansion(row.original.id)}
          className="h-6 w-6 p-0"
        >
          {expandedRows.includes(row.original.id) ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ),
      enableSorting: false,
      size: 50,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue();
        return (
          <Badge 
            variant="secondary" 
            className={`text-white ${getStatusColor(status)}`}
          >
            {status.replace('-', ' ').toUpperCase()}
          </Badge>
        );
      },
      size: 120,
    }),
    columnHelper.accessor('filename', {
      header: 'Document',
      cell: ({ getValue, row }) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
            📄
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate" title={getValue()}>
              {getValue()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(row.original.fileSize)} • {row.original.pageCount} pages
            </p>
          </div>
        </div>
      ),
      size: 250,
    }),
    columnHelper.accessor('progress', {
      header: 'Progress',
      cell: ({ getValue, row }) => {
        const progress = getValue();
        const status = row.original.status;
        
        if (status === 'queued') {
          return (
            <div className="text-sm text-muted-foreground">
              #{row.original.queuePosition} in queue
            </div>
          );
        }
        
        if (status === 'completed') {
          return (
            <div className="text-sm text-success font-medium">✓ Complete</div>
          );
        }
        
        return (
          <div className="w-24">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">
              {progress}%
            </div>
          </div>
        );
      },
      size: 120,
    }),
    columnHelper.accessor('owner.name', {
      header: 'Owner',
      cell: ({ getValue, row }) => (
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={row.original.owner.avatar} />
            <AvatarFallback className="text-xs">
              {getValue().split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{getValue()}</span>
        </div>
      ),
      size: 150,
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: ({ getValue, row }) => (
        <Select
          value={getValue()}
          onValueChange={(value) => updateTaskPriority(row.original.id, value as any)}
        >
          <SelectTrigger className="w-20 h-7">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      ),
      size: 100,
    }),
    columnHelper.accessor('startedAt', {
      header: 'Started',
      cell: ({ getValue }) => {
        const date = getValue();
        if (!date) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="text-sm">
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        );
      },
      size: 120,
    }),
    columnHelper.accessor('estimatedCompletion', {
      header: 'ETA',
      cell: ({ getValue, row }) => {
        const eta = getValue();
        if (row.original.status === 'completed') {
          return <span className="text-success">✓ Done</span>;
        }
        if (!eta) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="text-sm">
            {format(eta, 'HH:mm')}
          </div>
        );
      },
      size: 80,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => pauseTask(row.original.id)}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArrowUp className="h-4 w-4 mr-2" />
              Move to Top
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => cancelTask(row.original.id)}
              className="text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      size: 80,
    }),
  ];

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="p-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center space-x-1'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="ml-1">
                            {{
                              asc: <ChevronUp className="h-4 w-4" />,
                              desc: <ChevronDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <div className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <>
                  <TableRow
                    key={row.id}
                    data-state={selectedTasks.includes(row.original.id) ? "selected" : undefined}
                    className={`${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-blue-50 transition-colors`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                  
                  {/* Expanded Row Details */}
                  {expandedRows.includes(row.original.id) && (
                    <TableRow className="bg-muted/10">
                      <TableCell colSpan={columns.length}>
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Language:</span>
                              <p className="text-muted-foreground">{row.original.language}</p>
                            </div>
                            <div>
                              <span className="font-medium">Target Language:</span>
                              <p className="text-muted-foreground">{row.original.targetLanguage || '-'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Started:</span>
                              <p className="text-muted-foreground">
                                {row.original.startedAt 
                                  ? format(row.original.startedAt, 'PPp')
                                  : 'Not started'
                                }
                              </p>
                            </div>
                            <div>
                              <span className="font-medium">File Size:</span>
                              <p className="text-muted-foreground">{formatFileSize(row.original.fileSize)}</p>
                            </div>
                          </div>
                          
                          {row.original.error && (
                            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded">
                              <span className="font-medium text-destructive">Error:</span>
                              <p className="text-destructive text-sm mt-1">{row.original.error}</p>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ListView;