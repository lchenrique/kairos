"use client"

import Link from "next/link"
import { Fragment, type ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface PageHeaderBreadcrumb {
  label: string
  href?: string
}

export type PageHeaderVariant = "compact" | "default"

export interface PageHeaderProps {
  /** Nome curto da área/rota, exibido como contexto acima do título. */
  routeName: string
  title: string
  subtitle?: string
  breadcrumb?: PageHeaderBreadcrumb[]
  variant?: PageHeaderVariant
  children?: ReactNode
  className?: string
}

export function PageHeader({
  routeName,
  title,
  subtitle,
  breadcrumb,
  variant = "compact",
  children,
  className,
}: PageHeaderProps) {
  const isCompact = variant === "compact"

  return (
    <motion.header
      className={cn(
        "flex w-full flex-col items-start sm:flex-row sm:items-center sm:justify-between",
        isCompact ? "gap-3" : "gap-5",
        className,
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="min-w-0">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {routeName}
          </span>
          {breadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList className="text-[11px]">
                {breadcrumb.map((item, index) => {
                  const isLast = index === breadcrumb.length - 1

                  return (
                    <Fragment key={`${item.label}-${index}`}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {isLast || !item.href ? (
                          <BreadcrumbPage className="text-[11px] text-muted-foreground">
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild className="text-[11px]">
                            <Link href={item.href}>{item.label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <h1
          className={cn(
            "font-display font-semibold leading-tight tracking-tight",
            isCompact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl",
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-muted-foreground sm:text-[15px]">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto sm:justify-end">
          {children}
        </div>
      )}
    </motion.header>
  )
}
