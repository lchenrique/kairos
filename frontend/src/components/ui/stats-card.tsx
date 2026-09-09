"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  chartType?: "bars" | "sparkline" | "ring" | "none"
  chartColor?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  chartType = "none",
  chartColor = "primary",
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-3">
        <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-display text-3xl font-bold tracking-tight text-foreground">
            {value}
          </div>

          {trendValue && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                trend === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                trend === "down" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                trend === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              {trend === "up" && <TrendingUpIcon className="h-3 w-3" aria-hidden="true" />}
              {trend === "down" && <TrendingDownIcon className="h-3 w-3" aria-hidden="true" />}
              {trendValue}
            </span>
          )}
        </div>

        {/* Visual Mini Chart Accent (Finnova style) */}
        {chartType === "bars" && (
          <div className="mt-4 flex h-8 items-end gap-1.5 pt-1">
            {[40, 65, 30, 85, 55, 100, 75].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={cn(
                  "flex-1 rounded-t-sm transition-all duration-300 group-hover:opacity-100",
                  i === 5
                    ? "bg-primary opacity-90 shadow-sm"
                    : "bg-primary/20 opacity-60"
                )}
              />
            ))}
          </div>
        )}

        {chartType === "sparkline" && (
          <div className="mt-4 h-8 overflow-hidden pt-1">
            <svg
              viewBox="0 0 100 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full overflow-visible text-primary"
            >
              <defs>
                <linearGradient id="stats-spark-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,20 Q 15,18 25,12 T 50,14 T 75,6 T 100,4 L 100,24 L 0,24 Z"
                fill="url(#stats-spark-grad)"
              />
              <path
                d="M 0,20 Q 15,18 25,12 T 50,14 T 75,6 T 100,4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="100" cy="4" r="2.5" className="fill-primary stroke-background stroke-2" />
            </svg>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate">{description}</span>
          {!trendValue && trend && (
            <span className="flex items-center">
              {trend === "up" && (
                <TrendingUpIcon aria-hidden="true" className="mr-1 h-3.5 w-3.5 text-emerald-500" />
              )}
              {trend === "down" && (
                <TrendingDownIcon aria-hidden="true" className="mr-1 h-3.5 w-3.5 text-rose-500" />
              )}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
