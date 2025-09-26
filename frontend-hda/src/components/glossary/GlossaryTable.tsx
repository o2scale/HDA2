import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronUp,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  History,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGlossaryStore } from '@/store/glossary-store';
import type { GlossaryTerm } from '@/store/glossary-store';
import { formatDistanceToNow } from 'date-fns';

const columnHelper = createColumnHelper<GlossaryTerm>();

const GlossaryTable = () => {
  const { 
    selectedTermIds,
    setSelectedTerm,
    toggleTermSelection,
    setSelectedTermIds,
    updateTerm,
    deleteTerm,
    getFilteredTerms
  } = useGlossaryStore();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const terms = getFilteredTerms();

  const toggleRowExpansion = (termId: string) => {
    setExpandedRows(prev => 
      prev.includes(termId) 
        ? prev.filter(id => id !== termId)
        : [...prev, termId]
    );
  };

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

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleInlineEdit = async (termId: string, field: string, value: any) => {
    await updateTerm(termId, { [field]: value });
  };

  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            if (value) {
              setSelectedTermIds(terms.map(term => term.id));
            } else {
              setSelectedTermIds([]);
            }
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedTermIds.includes(row.original.id)}
          onCheckedChange={() => toggleTermSelection(row.original.id)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
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
    columnHelper.accessor('sourceTerm', {
      header: 'Source Term',
      cell: ({ getValue, row }) => (
        <div 
          className="cursor-pointer hover:text-primary"
          onClick={() => setSelectedTerm(row.original.id)}
        >
          <div className="font-medium">{getValue()}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.sourceLanguage}
          </div>
        </div>
      ),
      size: 200,
    }),
    columnHelper.accessor('translations', {
      header: 'Target Translations',
      cell: ({ getValue, row }) => {
        const translations = getValue();
        const primaryTranslation = translations.find(t => t.priority === 1) || translations[0];
        const otherCount = translations.length - 1;
        
        return (
          <div className="space-y-1">
            {primaryTranslation && (
              <div>
                <span className="font-medium">{primaryTranslation.text}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({primaryTranslation.language})
                </span>
                {primaryTranslation.verified && (
                  <CheckCircle className="h-3 w-3 text-green-500 ml-1 inline" />
                )}
              </div>
            )}
            {otherCount > 0 && (
              <div className="text-xs text-muted-foreground">
                +{otherCount} more {otherCount === 1 ? 'translation' : 'translations'}
              </div>
            )}
          </div>
        );
      },
      size: 250,
    }),
    columnHelper.accessor('domain', {
      header: 'Domain',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {getValue().map((domain, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`text-xs ${getDomainColor(domain)}`}
            >
              {domain}
            </Badge>
          ))}
        </div>
      ),
      size: 150,
    }),
    columnHelper.accessor('usageCount', {
      header: 'Usage',
      cell: ({ getValue }) => (
        <div className="text-center">
          <span className="font-medium">{getValue()}</span>
          <div className="text-xs text-muted-foreground">times</div>
        </div>
      ),
      size: 80,
    }),
    columnHelper.accessor('confidenceScore', {
      header: 'Confidence',
      cell: ({ getValue }) => {
        const score = getValue();
        return (
          <div className={`text-center font-medium ${getConfidenceColor(score)}`}>
            {score}%
          </div>
        );
      },
      size: 100,
    }),
    columnHelper.accessor('modifiedAt', {
      header: 'Modified',
      cell: ({ getValue }) => (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(getValue(), { addSuffix: true })}
        </div>
      ),
      size: 120,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue, row }) => (
        <Badge 
          variant="secondary" 
          className={`${getStatusColor(getValue())}`}
        >
          {getValue().toUpperCase()}
        </Badge>
      ),
      size: 100,
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
            <DropdownMenuItem onClick={() => setSelectedTerm(row.original.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Term
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="h-4 w-4 mr-2" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => deleteTerm(row.original.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      size: 80,
    }),
  ];

  const table = useReactTable({
    data: terms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <TooltipProvider>
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
                    data-state={selectedTermIds.includes(row.original.id) ? "selected" : undefined}
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
                        <div className="p-4 space-y-4">
                          {/* Definition and Notes */}
                          {row.original.definition && (
                            <div>
                              <span className="font-medium text-sm">Definition:</span>
                              <p className="text-sm text-muted-foreground mt-1">
                                {row.original.definition}
                              </p>
                            </div>
                          )}
                          
                          {/* All Translations */}
                          <div>
                            <span className="font-medium text-sm">All Translations:</span>
                            <div className="mt-2 space-y-2">
                              {row.original.translations.map((translation, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-background rounded border">
                                  <div className="flex items-center space-x-3">
                                    <Badge variant="outline" className="text-xs">
                                      {translation.language}
                                    </Badge>
                                    <span className="font-medium">{translation.text}</span>
                                    {translation.verified && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                    {translation.context && (
                                      <span className="text-xs text-muted-foreground">
                                        ({translation.context})
                                      </span>
                                    )}
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    Priority {translation.priority}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Tags */}
                          {row.original.tags.length > 0 && (
                            <div>
                              <span className="font-medium text-sm">Tags:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {row.original.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Metadata */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Created By:</span>
                              <p className="text-muted-foreground">{row.original.createdBy}</p>
                            </div>
                            <div>
                              <span className="font-medium">Version:</span>
                              <p className="text-muted-foreground">v{row.original.version}</p>
                            </div>
                            <div>
                              <span className="font-medium">Part of Speech:</span>
                              <p className="text-muted-foreground">{row.original.partOfSpeech || '-'}</p>
                            </div>
                            <div>
                              <span className="font-medium">Phonetic:</span>
                              <p className="text-muted-foreground">{row.original.phonetic || '-'}</p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No terms found</p>
                    <Button variant="outline" size="sm" onClick={() => useGlossaryStore.getState().toggleAddModal()}>
                      Add your first term
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default GlossaryTable;