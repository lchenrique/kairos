'use client'

import { GetMembers200DataItem } from "@/lib/api/generated/model"
import { formatDate, formatPhone } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, HomeIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MemberViewProps {
  member: GetMembers200DataItem
}

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
  delay?: number
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
}

function InfoItem({ icon, label, value, className, delay = 0 }: InfoItemProps) {
  return (
    <motion.div 
      variants={item}
      className={cn("flex items-start space-x-3 rounded-lg border p-4", className)}
    >
      <div className="rounded-full bg-primary/10 p-2 mt-1">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </motion.div>
  )
}

export function MemberView({ member }: MemberViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 pb-6 pt-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Avatar className="h-32 w-32 border-4 border-primary/20">
            <AvatarImage 
              src={member.image || undefined} 
              alt={member.name} 
              className="object-cover"
            />
            <AvatarFallback className="text-4xl bg-primary/5">
              <UserIcon className="h-16 w-16 text-primary/60" />
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold tracking-tight">{member.name}</h2>
          </motion.div>

          <motion.div 
            className="flex items-center justify-center gap-2 mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant={member.status === 'ACTIVE' ? 'success' : 'destructive'} className="px-4 py-1">
              {member.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
            </Badge>
          </motion.div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="church">Igreja</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-6">
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <InfoItem
              icon={<MailIcon className="h-4 w-4 text-primary" />}
              label="Email"
              value={member.email || 'Não informado'}
            />
            <InfoItem
              icon={<PhoneIcon className="h-4 w-4 text-primary" />}
              label="Telefone"
              value={formatPhone(member.phone)}
            />
            <InfoItem
              icon={<CalendarIcon className="h-4 w-4 text-primary" />}
              label="Data de Nascimento"
              value={formatDate(member.birthDate)}
            />
            <InfoItem
              icon={<HomeIcon className="h-4 w-4 text-primary" />}
              label="Endereço"
              value={member.address || 'Não informado'}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="church" className="mt-6">
          <motion.div 
            className="space-y-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <InfoItem
              icon={<CalendarIcon className="h-4 w-4 text-primary" />}
              label="Data de Batismo"
              value={member.baptismDate ? formatDate(member.baptismDate) : 'Não informada'}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
