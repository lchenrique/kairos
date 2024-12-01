"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Upload, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

const groupSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.string().min(1, "Tipo é obrigatório"),
  leader: z.string().min(3, "Líder é obrigatório"),
  meetingDay: z.string().min(1, "Dia de reunião é obrigatório"),
  meetingTime: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  description: z.string().optional(),
})

type GroupForm = z.infer<typeof groupSchema>

interface GroupDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Partial<GroupForm>
  mode?: "create" | "edit"
}

export function GroupDrawer({ open, onOpenChange, initialData, mode = "create" }: GroupDrawerProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
    defaultValues: initialData,
  })

  const onSubmit = async (data: GroupForm) => {
    try {
      // TODO: Implement group creation/update
      console.log(data)
      onOpenChange(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <div>
              <SheetTitle>{mode === "create" ? "Novo Grupo" : "Editar Grupo"}</SheetTitle>
              <SheetDescription>
                {mode === "create" ? "Crie um novo grupo ou ministério" : "Edite as informações do grupo"}
              </SheetDescription>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="text-2xl">+</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setAvatarPreview(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Grupo</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Ministério de Louvor"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select onValueChange={(value) => register("type").onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ministry">Ministério</SelectItem>
                      <SelectItem value="small-group">Pequeno Grupo</SelectItem>
                      <SelectItem value="department">Departamento</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leader">Líder</Label>
                  <Input
                    id="leader"
                    placeholder="Nome do líder"
                    {...register("leader")}
                  />
                  {errors.leader && (
                    <p className="text-sm text-destructive">{errors.leader.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingDay">Dia de Reunião</Label>
                  <Select onValueChange={(value) => register("meetingDay").onChange({ target: { value } })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunday">Domingo</SelectItem>
                      <SelectItem value="monday">Segunda-feira</SelectItem>
                      <SelectItem value="tuesday">Terça-feira</SelectItem>
                      <SelectItem value="wednesday">Quarta-feira</SelectItem>
                      <SelectItem value="thursday">Quinta-feira</SelectItem>
                      <SelectItem value="friday">Sexta-feira</SelectItem>
                      <SelectItem value="saturday">Sábado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.meetingDay && (
                    <p className="text-sm text-destructive">{errors.meetingDay.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingTime">Horário</Label>
                  <Input
                    id="meetingTime"
                    type="time"
                    {...register("meetingTime")}
                  />
                  {errors.meetingTime && (
                    <p className="text-sm text-destructive">{errors.meetingTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Sala 204"
                    {...register("location")}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <textarea
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Descrição do grupo..."
                  {...register("description")}
                />
              </div>
            </form>
          </ScrollArea>

          <div className="px-6 py-4 border-t">
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  mode === "create" ? "Criar Grupo" : "Salvar Alterações"
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}