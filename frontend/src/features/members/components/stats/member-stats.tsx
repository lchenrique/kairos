'use client'

import { StatsCard } from "@/components/ui/stats-card"
import { Member } from "@/lib/api/generated/members/members"
import { UsersIcon, UserIcon, ShieldIcon, UserMinusIcon, TrendingUpIcon, TrendingDownIcon, UserPlusIcon, CalendarClockIcon } from "lucide-react"

interface MemberStatsProps {
  members: Member[]
  totalMembers: number
}

export function MemberStats({ members, totalMembers }: MemberStatsProps) {
  const activeMembers = members.filter(member => member.status === 'ACTIVE').length
  const inactiveMembers = members.filter(member => member.status === 'INACTIVE').length
  const leaders = members.filter(member => member.groups.some(group => group.role === 'LEADER')).length

  // Calcula as porcentagens
  const activeMembersPercentage = totalMembers > 0 ? ((activeMembers / totalMembers) * 100).toFixed(1) : "0.0"
  const inactiveMembersPercentage = totalMembers > 0 ? ((inactiveMembers / totalMembers) * 100).toFixed(1) : "0.0"
  const leadersPercentage = totalMembers > 0 ? ((leaders / totalMembers) * 100).toFixed(1) : "0.0"

  const stats = [
    {
      title: "Total de Membros",
      value: totalMembers,
      description: "Total de membros cadastrados",
      icon: UsersIcon,
      trend: "up" as const
    },
    {
      title: "Membros Ativos",
      value: activeMembers,
      description: `${activeMembersPercentage}% do total`,
      icon: UserIcon,
      trend: "up" as const
    },
    {
      title: "Membros Inativos",
      value: inactiveMembers,
      description: `${inactiveMembersPercentage}% do total`,
      icon: UserMinusIcon,
      trend: "down" as const
    },
    {
      title: "Líderes",
      value: leaders,
      description: `${leadersPercentage}% do total`,
      icon: ShieldIcon,
      trend: "up" as const
    }
  ] as const

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
