'use client'

import { FormEvent, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Loader2, MapPin, Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  type ChurchSummary,
  tenantContextQueryKey,
  useChurchContext,
} from '@/hooks/use-church-context'
import { customInstance } from '@/lib/api/axios-instance'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useChurchStore } from '@/lib/stores/church-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ChurchUnitManager() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useChurchContext()
  const role = useAuthStore((state) => state.user?.role)
  const setActiveChurchId = useChurchStore((state) => state.setActiveChurchId)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')

  const createChurch = useMutation({
    mutationFn: () =>
      customInstance<ChurchSummary>({
        url: '/system/churches',
        method: 'POST',
        data: {
          name: name.trim(),
          address: address.trim() || undefined,
          email: email.trim() || undefined,
        },
      }),
    onSuccess: async (church) => {
      setActiveChurchId(church.id)
      setOpen(false)
      setName('')
      setAddress('')
      setEmail('')
      await queryClient.invalidateQueries({ queryKey: tenantContextQueryKey })
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== tenantContextQueryKey[0],
      })
      toast.success(`${church.name} foi adicionada à Rede.`)
    },
    onError: () => toast.error('Não foi possível adicionar a unidade.'),
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (name.trim().length < 3) {
      toast.error('Informe um nome com pelo menos 3 caracteres.')
      return
    }
    createChurch.mutate()
  }

  if (role !== 'ADMIN') return null

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Igrejas e unidades</CardTitle>
          <CardDescription>
            Gerencie a sede e as congregações da {data?.organization.name || 'sua Rede'}.
          </CardDescription>
        </div>
        {role === 'ADMIN' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="min-h-11 shrink-0">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Adicionar unidade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <DialogHeader>
                  <DialogTitle>Nova igreja ou unidade</DialogTitle>
                  <DialogDescription>
                    Os dados desta unidade ficarão isolados dentro da Rede.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="church-name">Nome da unidade</Label>
                  <Input
                    id="church-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ex: Congregação Centro"
                    autoComplete="organization"
                    required
                    minLength={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church-address">Endereço</Label>
                  <Input
                    id="church-address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Rua, número, bairro e cidade"
                    autoComplete="street-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church-email">E-mail</Label>
                  <Input
                    id="church-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="contato@igreja.com"
                    autoComplete="email"
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createChurch.isPending}>
                    {createChurch.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    )}
                    Adicionar unidade
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex min-h-24 items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Carregando unidades...
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data?.churches.map((church) => (
              <div
                key={church.id}
                className="rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Building2 className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{church.name}</p>
                      {church.isHeadquarters && <Badge variant="secondary">Sede</Badge>}
                    </div>
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{church.address || 'Endereço ainda não informado'}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
