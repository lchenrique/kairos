import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description: string
  trend?: "up" | "down" | "neutral"
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border/70 bg-card/90">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg border border-primary/15 bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <div className="font-display text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1.5 flex items-center text-xs text-muted-foreground">
          {trend === "up" && (
            <TrendingUpIcon aria-hidden="true" className="mr-1 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          )}
          {trend === "down" && (
            <TrendingDownIcon aria-hidden="true" className="mr-1 h-4 w-4 text-rose-600 dark:text-rose-400" />
          )}
          {description}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/15 transition-colors group-hover:bg-accent" />
      </CardContent>
    </Card>
  )
}
