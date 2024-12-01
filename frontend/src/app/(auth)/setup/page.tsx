"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, Church, EyeIcon, EyeOffIcon, KeyRound, Loader2, Mail, MapPin, Phone, User } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { usePostSystemSetup } from "@/lib/api/generated/system/system"

const setupSchema = z.object({
  church: z.object({
    name: z.string().min(3, 'Nome da igreja deve ter pelo menos 3 caracteres'),
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    phone: z.string().optional(),
  }),
  admin: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  })
})

type SetupForm = z.infer<typeof setupSchema>

export default function SetupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SetupForm>({
    resolver: zodResolver(setupSchema),
  })

  const { mutate: setupSystem, isPending } = usePostSystemSetup({
    mutation: {
      onSuccess: () => {
        toast.success('Sistema configurado com sucesso!')
        router.push('/login')
      },
      onError: () => {
        toast.error('Erro ao configurar o sistema')
      }
    }
  })

  const onSubmit = (data: SetupForm) => {
    setupSystem({ data })
  }

  return (
    <div className="min-h-screen grid place-items-center p-4 bg-gradient-to-br from-background via-background to-background/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Configuração Inicial</CardTitle>
            <CardDescription>Configure sua igreja e crie o usuário administrador</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Church className="h-5 w-5" />
                  Dados da Igreja
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="church.name">Nome da Igreja</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="church.name"
                      className="pl-9"
                      placeholder="Ex: Igreja Batista Central"
                      {...register('church.name')}
                    />
                  </div>
                  {errors.church?.name && (
                    <p className="text-sm text-destructive">{errors.church.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church.address">Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="church.address"
                      className="pl-9"
                      placeholder="Ex: Rua Principal, 123"
                      {...register('church.address')}
                    />
                  </div>
                  {errors.church?.address && (
                    <p className="text-sm text-destructive">{errors.church.address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="church.phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="church.phone"
                      className="pl-9"
                      placeholder="Ex: (11) 99999-9999"
                      {...register('church.phone')}
                    />
                  </div>
                  {errors.church?.phone && (
                    <p className="text-sm text-destructive">{errors.church.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados do Administrador
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="admin.name">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin.name"
                      className="pl-9"
                      placeholder="Ex: João Silva"
                      {...register('admin.name')}
                    />
                  </div>
                  {errors.admin?.name && (
                    <p className="text-sm text-destructive">{errors.admin.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin.email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin.email"
                      className="pl-9"
                      placeholder="Ex: joao@igreja.com"
                      {...register('admin.email')}
                    />
                  </div>
                  {errors.admin?.email && (
                    <p className="text-sm text-destructive">{errors.admin.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin.password">Senha</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin.password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-9"
                      {...register('admin.password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-3 w-3" />
                      ) : (
                        <EyeIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  {errors.admin?.password && (
                    <p className="text-sm text-destructive">{errors.admin.password.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  'Configurar Sistema'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
