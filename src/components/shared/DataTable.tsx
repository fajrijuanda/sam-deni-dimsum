"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Column<T> {
    key: keyof T | string
    label: string
    className?: string
    render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    searchKey?: keyof T
    searchPlaceholder?: string
    emptyMessage?: string
    emptyIcon?: React.ReactNode
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchKey,
    searchPlaceholder = "Cari...",
    emptyMessage = "Tidak ada data",
    emptyIcon,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!searchQuery || !searchKey) return data

        return data.filter(item => {
            const value = item[searchKey]
            if (typeof value === "string") {
                return value.toLowerCase().includes(searchQuery.toLowerCase())
            }
            if (typeof value === "number") {
                return value.toString().includes(searchQuery)
            }
            return false
        })
    }, [data, searchQuery, searchKey])

    // Paginate data
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredData.slice(start, end)
    }, [filteredData, currentPage, pageSize])

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / pageSize)
    const totalItems = filteredData.length

    // Reset to page 1 when search changes
    const handleSearch = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    // Handle page size change
    const handlePageSizeChange = (value: string) => {
        setPageSize(parseInt(value))
        setCurrentPage(1)
    }

    // Pagination helpers
    const canGoPrev = currentPage > 1
    const canGoNext = currentPage < totalPages

    const goToPage = (page: number) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages))
    }

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                {searchKey && (
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        />
                    </div>
                )}

                {/* Items per page */}
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>Tampilkan</span>
                    <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                        <SelectTrigger className="w-[70px] h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map(size => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>data</span>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-slate-50/80">
                                {columns.map((column) => (
                                    <TableHead
                                        key={String(column.key)}
                                        className={cn(
                                            "font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap",
                                            column.className
                                        )}
                                    >
                                        {column.label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                                    >
                                        {columns.map((column) => (
                                            <TableCell
                                                key={`${item.id}-${String(column.key)}`}
                                                className={cn(
                                                    "text-slate-700 dark:text-slate-300",
                                                    column.className
                                                )}
                                            >
                                                {column.render
                                                    ? column.render(item)
                                                    : String(item[column.key as keyof T] ?? "-")
                                                }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center py-12"
                                    >
                                        {emptyIcon && (
                                            <div className="flex justify-center mb-3 text-slate-300">
                                                {emptyIcon}
                                            </div>
                                        )}
                                        <p className="text-slate-500">{emptyMessage}</p>
                                        {searchQuery && (
                                            <p className="text-sm text-slate-400 mt-1">
                                                Coba kata kunci lain
                                            </p>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Info */}
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Menampilkan {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data
                    </p>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(1)}
                            disabled={!canGoPrev}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={!canGoPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1 mx-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="icon"
                                        className={cn(
                                            "h-8 w-8",
                                            currentPage === pageNum && "bg-red-500 hover:bg-red-600 text-white"
                                        )}
                                        onClick={() => goToPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                )
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={!canGoNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => goToPage(totalPages)}
                            disabled={!canGoNext}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
