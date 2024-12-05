'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PageSizeSelector } from './page-size-selector'

interface MemberPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

export function MemberPagination({ currentPage, totalPages, totalItems }: MemberPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageSize = Number(searchParams.get('limit') ?? '10')

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  // Gera array de páginas a serem exibidas
  const getPageNumbers = () => {
    const delta = 2 // Número de páginas antes e depois da página atual
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'dots')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('dots', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const start = Math.min(pageSize * (currentPage - 1) + 1, totalItems)
  const end = Math.min(pageSize * currentPage, totalItems)

  return (
    <div className="flex items-center border-t px-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{start}</span> a{' '}
        <span className="font-medium">{end}</span> de{' '}
        <span className="font-medium">{totalItems}</span> membros
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <PageSizeSelector />

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) handlePageChange(currentPage - 1)
                }}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNumber, i) =>
              pageNumber === 'dots' ? (
                <PaginationItem key={`dots-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(pageNumber as number)
                    }}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) handlePageChange(currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
