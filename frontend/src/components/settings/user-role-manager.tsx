"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MailPlus,
  RotateCcw,
  ShieldCheck,
  UserRoundMinus,
  UserRoundX,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getGetAuthInvitesQueryKey,
  getGetAuthUsersQueryKey,
  useDeleteAuthInvitesId,
  useDeleteAuthUsersId,
  useGetAuthInvites,
  useGetAuthUsers,
  usePatchAuthUsersIdRole,
  usePatchAuthUsersIdStatus,
  usePostAuthInvites,
} from "@/lib/api/generated/auth/auth";
import type {
  GetAuthInvites200ItemStatus,
  GetAuthUsers200ItemRole,
  PostAuthInvitesBody,
} from "@/lib/api/generated/model";
import { useAuthStore } from "@/lib/stores/auth-store";

const roleLabels: Record<GetAuthUsers200ItemRole, string> = {
  ADMIN: "Administrador",
  PASTOR: "Pastor",
  LEADER: "Líder",
  SECRETARY: "Secretário",
  USER: "Usuário",
};

const inviteStatusLabels: Record<GetAuthInvites200ItemStatus, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  EXPIRED: "Expirado",
  REVOKED: "Revogado",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function UserRoleManager() {
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<GetAuthUsers200ItemRole>("USER");
  const isAdmin = currentUser?.role === "ADMIN";

  const {
    data: users,
    isLoading,
    isError,
  } = useGetAuthUsers({
    query: { enabled: isAdmin, refetchOnWindowFocus: false },
  });
  const {
    data: invites,
    isLoading: invitesLoading,
    isError: invitesError,
  } = useGetAuthInvites({
    query: { enabled: isAdmin, refetchOnWindowFocus: false },
  });

  const refreshUsers = () =>
    queryClient.invalidateQueries({ queryKey: getGetAuthUsersQueryKey() });
  const refreshInvites = () =>
    queryClient.invalidateQueries({ queryKey: getGetAuthInvitesQueryKey() });

  const updateRole = usePatchAuthUsersIdRole({
    mutation: {
      onSuccess: () => {
        toast.success("Permissão atualizada");
        refreshUsers();
      },
      onError: () =>
        toast.error(
          "Não foi possível atualizar a permissão. Verifique se existe outro administrador ativo.",
        ),
    },
  });
  const updateStatus = usePatchAuthUsersIdStatus({
    mutation: {
      onSuccess: (_, variables) => {
        toast.success(
          variables.data.status === "ACTIVE"
            ? "Acesso reativado"
            : "Acesso suspenso",
        );
        refreshUsers();
      },
      onError: () =>
        toast.error(
          "Não foi possível alterar o acesso. A equipe precisa manter um administrador ativo.",
        ),
    },
  });
  const createInvite = usePostAuthInvites({
    mutation: {
      onSuccess: () => {
        toast.success("Convite enviado");
        refreshInvites();
        setDialogOpen(false);
        setName("");
        setEmail("");
        setRole("USER");
      },
      onError: () =>
        toast.error(
          "Não foi possível enviar o convite. Verifique o email e a configuração de envio.",
        ),
    },
  });
  const revokeInvite = useDeleteAuthInvitesId({
    mutation: {
      onSuccess: () => {
        toast.success("Convite revogado");
        refreshInvites();
      },
      onError: () => toast.error("Não foi possível revogar este convite."),
    },
  });
  const revokeAccess = useDeleteAuthUsersId({
    mutation: {
      onSuccess: () => {
        toast.success("Acesso revogado");
        refreshUsers();
      },
      onError: () =>
        toast.error(
          "Não foi possível revogar o acesso. A equipe precisa manter um administrador ativo.",
        ),
    },
  });

  if (!isAdmin) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3 || !email.includes("@")) {
      toast.error("Informe um nome e um email válido");
      return;
    }
    const data: PostAuthInvitesBody = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    };
    createInvite.mutate({ data });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
                Equipe e permissões
              </CardTitle>
              <CardDescription>
                Gerencie quem acessa o sistema. Os membros da congregação
                continuam na área Membros.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setDialogOpen(true)}>
              <MailPlus className="mr-2 h-4 w-4" aria-hidden="true" />
              Convidar pessoa
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isError ? (
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar a equipe.
            </p>
          ) : isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))
          ) : !users?.length ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              Nenhuma pessoa na equipe ainda.
            </div>
          ) : (
            users.map((user) => {
              const isCurrentUser = user.id === currentUser.id;
              const isSuspended = user.status === "SUSPENDED";

              return (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>
                      {isCurrentUser && <Badge variant="outline">Você</Badge>}
                      <Badge variant={isSuspended ? "destructive" : "success"}>
                        {isSuspended ? "Suspenso" : "Ativo"}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        updateRole.mutate({
                          id: user.id,
                          data: { role: value as GetAuthUsers200ItemRole },
                        })
                      }
                      disabled={
                        updateRole.isPending || isCurrentUser || isSuspended
                      }
                    >
                      <SelectTrigger
                        className="w-full sm:w-[170px]"
                        aria-label={`Papel de ${user.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roleLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isSuspended ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={updateStatus.isPending}
                        onClick={() =>
                          updateStatus.mutate({
                            id: user.id,
                            data: { status: "ACTIVE" },
                          })
                        }
                      >
                        <RotateCcw
                          className="mr-2 h-4 w-4"
                          aria-hidden="true"
                        />
                        Reativar
                      </Button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={isCurrentUser || updateStatus.isPending}
                          >
                            <UserRoundX
                              className="mr-2 h-4 w-4"
                              aria-hidden="true"
                            />
                            Suspender
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Suspender o acesso de {user.name}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              As sessões dessa pessoa serão invalidadas e ela
                              não poderá entrar até ser reativada.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                updateStatus.mutate({
                                  id: user.id,
                                  data: { status: "SUSPENDED" },
                                })
                              }
                            >
                              Suspender acesso
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={isCurrentUser || revokeAccess.isPending}
                        >
                          <UserRoundMinus
                            className="mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Revogar acesso
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Revogar permanentemente o acesso de {user.name}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            A pessoa perderá o acesso a todas as unidades desta
                            Rede. O cadastro global não será apagado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => revokeAccess.mutate({ id: user.id })}
                          >
                            Revogar acesso
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Histórico de convites</CardTitle>
          <CardDescription>
            Convites pendentes expiram automaticamente em 72 horas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {invitesError ? (
            <p className="text-sm text-muted-foreground">
              Não foi possível carregar os convites.
            </p>
          ) : invitesLoading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))
          ) : !invites?.length ? (
            <div className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
              Nenhum convite enviado.
            </div>
          ) : (
            invites.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {invite.name}
                    </p>
                    <Badge
                      variant={
                        invite.status === "PENDING" ? "secondary" : "outline"
                      }
                    >
                      {inviteStatusLabels[invite.status]}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {invite.email}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {roleLabels[invite.role]} em {invite.church.name} · enviado
                    em {dateFormatter.format(new Date(invite.createdAt))}
                  </p>
                </div>
                {invite.status === "PENDING" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" size="sm" variant="ghost">
                        <X className="mr-2 h-4 w-4" aria-hidden="true" />
                        Revogar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Revogar este convite?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          O link enviado para {invite.email} deixará de
                          funcionar imediatamente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => revokeInvite.mutate({ id: invite.id })}
                        >
                          Revogar convite
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar pessoa para a equipe</DialogTitle>
            <DialogDescription>
              A pessoa receberá um link seguro e escolherá a própria senha. O
              convite vale por 72 horas.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Nome</Label>
              <Input
                id="team-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome completo"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-email">Email</Label>
              <Input
                id="team-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="pessoa@igreja.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-role">Papel</Label>
              <Select
                value={role}
                onValueChange={(value) =>
                  setRole(value as GetAuthUsers200ItemRole)
                }
              >
                <SelectTrigger id="team-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createInvite.isPending}>
                {createInvite.isPending ? "Enviando..." : "Enviar convite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
