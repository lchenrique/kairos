"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertTriangle, Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { customInstance } from "@/lib/api/axios-instance"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useChurchStore } from "@/lib/stores/church-store"

export function OrganizationDangerZone() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const role = useAuthStore((state) => state.user?.role)
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("")

  const removeOrganization = useMutation({
    mutationFn: () => customInstance({
      url: "/auth/organization",
      method: "DELETE",
      data: { confirmation: confirmation.trim() },
    }),
    onSuccess: async () => {
      queryClient.clear()
      setOpen(false)
      setConfirmation("")
      toast.success("Comunidade removida.")
      useAuthStore.getState().logout()
      useChurchStore.getState().clearActiveChurch()
      router.replace("/onboarding")
    },
    onError: () => toast.error("Não foi possível remover a comunidade agora."),
  })

  if (role !== "ADMIN") return null

  return (
    <Card className="border-destructive/25 bg-destructive/[0.03]">
      <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" aria-hidden="true" />Zona de risco</CardTitle>
          <CardDescription className="mt-2 max-w-2xl">Remova a comunidade e todos os dados de igrejas, membros, eventos, grupos e financeiro. Esta ação não pode ser desfeita.</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="min-h-11 shrink-0"><Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />Remover comunidade</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={(event) => { event.preventDefault(); removeOrganization.mutate() }} className="space-y-5">
              <DialogHeader>
                <DialogTitle>Remover comunidade?</DialogTitle>
                <DialogDescription>Todos os dados serão apagados permanentemente. Para confirmar, digite <strong>EXCLUIR</strong>.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="delete-community-confirmation">Confirmação</Label>
                <Input id="delete-community-confirmation" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="EXCLUIR" autoComplete="off" autoFocus />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="destructive" disabled={confirmation !== "EXCLUIR" || removeOrganization.isPending}>
                  {removeOrganization.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Remover definitivamente
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="pt-0 text-xs text-muted-foreground">A exclusão encerra também o teste ou assinatura vinculada a esta comunidade.</CardContent>
    </Card>
  )
}
