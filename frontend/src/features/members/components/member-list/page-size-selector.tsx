'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

const pageSizes = [10, 20, 30, 50]

export function PageSizeSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSize = Number(searchParams.get('limit') ?? '10')

  const handlePageSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', size)
    params.set('page', '1') // Volta para primeira página ao mudar o tamanho
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center space-x-2">
      <p className="text-sm font-medium">Exibir</p>
      <Select
        value={currentSize.toString()}
        onValueChange={handlePageSizeChange}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder="10" />
        </SelectTrigger>
        <SelectContent side="top">
          {pageSizes.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
