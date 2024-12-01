export type GroupStatus = "active" | "inactive"

export type GroupType = "ministry" | "small-group" | "department"

export type GroupMeetingDay = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"

export interface Group {
  id: string
  name: string
  description?: string
  type: GroupType
  status: GroupStatus
  meetingDay?: GroupMeetingDay
  meetingTime?: string
  meetingLocation?: string
  leaderId?: string
  leaderName?: string
  leaderAvatar?: string
  membersCount: number
  createdAt: string
  updatedAt: string
}

export interface GroupFilters {
  search?: string
  type?: GroupType
  status?: GroupStatus
  meetingDay?: GroupMeetingDay
  hasLeader?: boolean
  hasMembers?: boolean
  meetingToday?: boolean
}

export interface GroupsState {
  view: "grid" | "table"
  filters: GroupFilters
  groups: Group[]
  loading: boolean
  error: string | null
}
