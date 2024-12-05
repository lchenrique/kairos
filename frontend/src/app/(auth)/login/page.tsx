'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePostAuthLogin } from "@/lib/api/generated/auth/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon, Loader2Icon, ChurchIcon, UsersIcon, CalendarIcon, HomeIcon, HeartHandshakeIcon, BookOpenIcon } from "lucide-react"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
})

type LoginForm = z.infer<typeof loginSchema>

const features = [
  {
    icon: UsersIcon,
    title: "Gestão de Membros",
    description: "Cadastre e gerencie todos os membros da sua igreja."
  },
  {
    icon: CalendarIcon,
    title: "Agenda de Eventos",
    description: "Organize cultos e eventos especiais em um só lugar."
  },
  {
    icon: HomeIcon,
    title: "Gestão de Células",
    description: "Acompanhe o crescimento das células da sua igreja."
  },
  {
    icon: HeartHandshakeIcon,
    title: "Ação Social",
    description: "Gerencie projetos sociais e voluntariado."
  },
  {
    icon: BookOpenIcon,
    title: "Escola Bíblica",
    description: "Organize turmas e acompanhe a frequência."
  }
]

function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  
  const { mutate: loginMutation, isPending } = usePostAuthLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.user, data.token)
        toast.success("Login realizado com sucesso!")
        router.push("/dashboard")
      },
      onError: (error) => {
        if (error?.statusCode === 401) {
          toast.error("E-mail ou senha inválidos")
        } else {
          toast.error("Erro ao fazer login. Tente novamente.")
        }
      }
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: LoginForm) => {
    loginMutation({ data })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(onSubmit)(e)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary/5 via-background to-primary/5 animate-gradient-y relative overflow-hidden">
      {/* Círculos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full animate-pulse-slow" />
      </div>

      <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-8 p-8">
        {/* Lado Esquerdo - Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card className="backdrop-blur-sm bg-background/80 shadow-2xl border-primary/20">
            <CardHeader className="space-y-3">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
                  <ChurchIcon className="h-16 w-16 text-primary relative animate-float" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                Bem-vindo ao Kairos
              </CardTitle>
              <CardDescription className="text-center text-base">
                Faça login para acessar o sistema de gestão da sua igreja
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleFormSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label 
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    E-mail
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full transition-all duration-300 bg-background/50 border-primary/20 focus:bg-background/80"
                      {...register("email")}
                      autoComplete="email"
                      autoFocus
                    />
                    <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Senha
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      className="w-full pr-10 transition-all duration-300 bg-background/50 border-primary/20 focus:bg-background/80"
                      {...register("password")}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-muted-foreground transition-transform duration-200 hover:scale-110" />
                      )}
                    </Button>
                    <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full bg-gradient-to-r from-primary to-primary/10 hover:opacity-80 transition-all duration-300 text-primary-foreground"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => router.push("/forgot-password")}
                >
                  Esqueceu sua senha?
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Lado Direito - Features */}
        <div className="hidden lg:block w-1/2 max-w-xl">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent mb-4">
                Gestão Eficiente para sua Igreja
              </h2>
              <p className="text-muted-foreground text-lg">
                Simplifique a administração da sua igreja com o Kairos
              </p>
            </div>

            <div className="grid gap-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/40 backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:bg-background/60 hover:border-primary/20 group animate-in fade-in slide-in-from-right-5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-primary animate-float" style={{ animationDelay: `${index * 1000}ms` }} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-primary-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
