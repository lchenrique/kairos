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
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="bg-primary/10 p-2 rounded-full">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-sm text-muted-foreground">
          {trend === "up" && (
            <TrendingUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
          )}
          {trend === "down" && (
            <TrendingDownIcon className="mr-1 h-4 w-4 text-rose-500" />
          )}
          {description}
        </div>
        <div 
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-transparent"
        />
      </CardContent>
    </Card>
  )
}
