import { useQuery } from "@tanstack/react-query"

export interface Member {
  id: string
  name: string
  avatar: string
  role?: string
}

export interface Leader {
  id: string
  name: string
  avatar: string
  role?: string
}

export interface Activity {
  id: string
  description: string
  date: string
}

export interface Group {
  id: string
  name: string
  type?: string
  avatar?: string
  status: string
  description?: string
  isMainGroup?: boolean
  location?: string
  meetingDay?: string
  meetingTime?: string
  members: Member[]
  leaders: Leader[]
  activities: Activity[]
}

// Dados mockados para desenvolvimento
const mockGroups: Group[] = [
  {
    id: "1",
    name: "Grupo de Jovens",
    type: "Grupo",
    status: "Ativo",
    description: "Grupo dedicado aos jovens da igreja, com encontros semanais para estudo bíblico e comunhão.",
    isMainGroup: true,
    location: "Sala 3",
    meetingDay: "Sábado",
    meetingTime: "19:30",
    members: [
      { id: "1", name: "João Silva", avatar: "", role: "Membro" },
      { id: "2", name: "Maria Santos", avatar: "", role: "Membro" },
      { id: "3", name: "Pedro Oliveira", avatar: "", role: "Membro" }
    ],
    leaders: [
      { id: "1", name: "Carlos Souza", avatar: "", role: "Líder Principal" },
      { id: "2", name: "Ana Lima", avatar: "", role: "Vice-líder" }
    ],
    activities: [
      { id: "1", description: "Estudo Bíblico - Livro de João", date: "2024-01-20" },
      { id: "2", description: "Encontro de Louvor", date: "2024-01-27" }
    ]
  },
  {
    id: "2",
    name: "Grupo de Casais",
    type: "Grupo",
    status: "Ativo",
    description: "Grupo para casais compartilharem experiências e crescerem juntos na fé.",
    location: "Sala Principal",
    meetingDay: "Sexta",
    meetingTime: "20:00",
    members: [
      { id: "4", name: "Roberto e Julia", avatar: "", role: "Membro" },
      { id: "5", name: "Paulo e Clara", avatar: "", role: "Membro" }
    ],
    leaders: [
      { id: "3", name: "Marcos e Patricia", avatar: "", role: "Líderes" }
    ],
    activities: [
      { id: "3", description: "Jantar de Comunhão", date: "2024-01-19" }
    ]
  },
  {
    id: "3",
    name: "Grupo de Oração",
    type: "Ministério",
    status: "Ativo",
    description: "Grupo dedicado à oração e intercessão.",
    isMainGroup: true,
    location: "Capela",
    meetingDay: "Quarta",
    meetingTime: "19:00",
    members: [
      { id: "6", name: "Lucia Ferreira", avatar: "", role: "Membro" },
      { id: "7", name: "Antonio Gomes", avatar: "", role: "Membro" }
    ],
    leaders: [
      { id: "4", name: "Isabel Santos", avatar: "", role: "Líder" }
    ],
    activities: [
      { id: "4", description: "Vigília de Oração", date: "2024-01-26" }
    ]
  }
]

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      // TODO: Implement API call
      return mockGroups
    }
  })
}