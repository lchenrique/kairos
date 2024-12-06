"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Checkbox } from "./checkbox"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ChevronDownIcon, 
  TrashIcon,
  XIcon,
  CheckIcon,
} from "lucide-react"
import { useBulkMemberActions } from '@/lib/hooks/use-bulk-actions'
import { useModalStore } from '@/lib/stores/modal-store'
import { motion } from "framer-motion"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  onSortingChange?: (sorting: SortingState) => void
  initialSorting?: SortingState
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  onSortingChange,
  initialSorting = []
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { bulkUpdateStatus, bulkDeleteMembers } = useBulkMemberActions()
  const modalStore = useModalStore()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(newSorting)
      onSortingChange?.(newSorting)
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination: {
        pageSize,
        pageIndex: 0,
      },
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })

  console.log('DataTable render:', {
    dataLength: data.length,
    columns: columns.length,
    rows: table.getRowModel().rows.length
  })

  return (
    <div>
      {table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center gap-2 py-4">
          <Button variant="outline" size="sm">
            {table.getSelectedRowModel().rows.length} selecionado(s)
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Ações em massa
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => {
                  const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id)
                  bulkUpdateStatus.mutate({
                    memberIds: selectedIds,
                    status: 'ACTIVE'
                  })
                  table.resetRowSelection()
                }}
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                <span>Ativar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id)
                  bulkUpdateStatus.mutate({
                    memberIds: selectedIds,
                    status: 'INACTIVE'
                  })
                  table.resetRowSelection()
                }}
              >
                <XIcon className="mr-2 h-4 w-4" />
                <span>Desativar</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              
              {/* Removidas opções de grupos */}
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => {
                  const selectedIds = table.getSelectedRowModel().rows.map(row => row.original.id)
                  modalStore.confirm({
                    title: `Excluir ${selectedIds.length} membros?`,
                    subtitle: 'Esta ação não pode ser desfeita.',
                    variant: 'destructive',
                    onConfirm: () => {
                      bulkDeleteMembers.mutate(selectedIds)
                      table.resetRowSelection()
                      modalStore.close()
                    },
                    onCancel: () => modalStore.close()
                  })
                }}
              >
                <TrashIcon className="mr-2 h-4 w-4 text-red-500" />
                <span className="text-red-500">Excluir</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <Table className=" overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {header.isPlaceholder ? null : (
                      <>
                        {header.id === "select" ? (
                          <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                            className="translate-y-[2px]"
                          />
                        ) : (
                          <Button
                            variant="ghost"
                            className="-ml-4 h-8 data-[sorting=true]:font-bold"
                            onClick={header.column.getToggleSortingHandler()}
                            data-sorting={header.column.getIsSorted()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() && (
                              <span className="ml-2">
                                {header.column.getIsSorted() === "desc" ? "▼" : "▲"}
                              </span>
                            )}
                          </Button>
                        )}
                      </>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.1,
                  staggerChildren: 0.05
                }
              }
            }}
            className="overflow-hidden"
          >
            {table.getRowModel().rows?.length ? (
              <>
                {table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: 0.1 + (index * 0.05)
                        }
                      }
                    }}
                    as={TableRow}
                    className="hover:bg-muted/30"
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="px-4 py-3"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center px-4 py-3"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </motion.tbody>
        </Table>
      </div>
    </div>
  )
}
