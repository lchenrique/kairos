"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  Pencil,
  Plus,
  Trash2,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getGetFinanceQueryKey,
  useDeleteFinanceId,
  useGetFinance,
  usePostFinance,
  usePutFinanceId,
} from "@/lib/api/generated/finance/finance";
import type {
  GetFinance200DataItem,
  GetFinanceType,
  PostFinanceBodyType,
} from "@/lib/api/generated/model";
import { downloadCsv } from "@/lib/utils/csv";
import { hasPermission } from "@/lib/permissions";
import { useAuthStore } from "@/lib/stores/auth-store";

const money = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dayStartIso = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
};

const dayEndIso = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999).toISOString();
};

const categorySuggestions: Record<PostFinanceBodyType, string[]> = {
  INCOME: ["Dízimos", "Ofertas", "Doações", "Eventos", "Outras entradas"],
  EXPENSE: [
    "Aluguel",
    "Água e energia",
    "Manutenção",
    "Missões",
    "Ação social",
    "Equipe",
    "Outras saídas",
  ],
};

type FinanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: GetFinance200DataItem | null;
};

function FinanceEntryDialog({ open, onOpenChange, entry }: FinanceDialogProps) {
  const queryClient = useQueryClient();
  const [type, setType] = useState<PostFinanceBodyType>("INCOME");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) return;
    setType(entry?.type ?? "INCOME");
    setCategory(entry?.category ?? "");
    setDescription(entry?.description ?? "");
    setAmount(entry ? String(entry.amountCents / 100).replace(".", ",") : "");
    setOccurredAt(
      entry
        ? new Date(entry.occurredAt).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    );
    setPaymentMethod(entry?.paymentMethod ?? "PIX");
    setValidationError("");
  }, [entry, open]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetFinanceQueryKey() });
  const create = usePostFinance({
    mutation: {
      onSuccess: () => {
        toast.success("Lançamento registrado");
        invalidate();
        onOpenChange(false);
      },
      onError: () => toast.error("Não foi possível registrar o lançamento"),
    },
  });
  const update = usePutFinanceId({
    mutation: {
      onSuccess: () => {
        toast.success("Lançamento atualizado");
        invalidate();
        onOpenChange(false);
      },
      onError: () => toast.error("Não foi possível atualizar o lançamento"),
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cents = Math.round(Number(amount.replace(",", ".")) * 100);
    if (
      !category.trim() ||
      !description.trim() ||
      !cents ||
      cents < 0 ||
      !occurredAt
    ) {
      setValidationError(
        "Preencha categoria, descrição, data e um valor maior que zero.",
      );
      return;
    }
    setValidationError("");
    const data = {
      type,
      category: category.trim(),
      description: description.trim(),
      amountCents: cents,
      occurredAt: new Date(`${occurredAt}T12:00:00`).toISOString(),
      paymentMethod: paymentMethod || null,
    };
    if (entry) update.mutate({ id: entry.id, data });
    else create.mutate({ data });
  };

  const pending = create.isPending || update.isPending;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {entry ? "Editar lançamento" : "Novo lançamento"}
          </DialogTitle>
          <DialogDescription>
            Registre entradas e saídas para manter o saldo da igreja atualizado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {validationError && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
            >
              {validationError}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="finance-type">Tipo</Label>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value as PostFinanceBodyType);
                setCategory("");
              }}
            >
              <SelectTrigger id="finance-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="finance-amount">Valor (R$)</Label>
            <Input
              id="finance-amount"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="finance-category">Categoria</Label>
            <div className="grid gap-2 sm:grid-cols-[1fr_180px]">
              <Input
                id="finance-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Digite ou escolha uma categoria"
              />
              <Select onValueChange={setCategory}>
                <SelectTrigger
                  className="min-w-0"
                  aria-label="Sugestões de categoria"
                >
                  <SelectValue placeholder="Sugestões" />
                </SelectTrigger>
                <SelectContent>
                  {categorySuggestions[type].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="finance-date">Data</Label>
            <DatePicker
              id="finance-date"
              value={occurredAt}
              onChange={setOccurredAt}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="finance-payment">Forma de pagamento</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="finance-payment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="CASH">Dinheiro</SelectItem>
                <SelectItem value="TED">Transferência</SelectItem>
                <SelectItem value="CARD">Cartão</SelectItem>
                <SelectItem value="OTHER">Outra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="finance-description">Descrição</Label>
            <Input
              id="finance-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ex.: Dízimos do culto de domingo"
            />
          </div>
          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {entry ? "Salvar alterações" : "Salvar lançamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FinancePage() {
  const role = useAuthStore((state) => state.user?.role);
  const canManage = hasPermission(role, "FINANCE_MANAGE");
  const queryClient = useQueryClient();
  const [type, setType] = useState<"all" | GetFinanceType>("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] =
    useState<GetFinance200DataItem | null>(null);
  const [entryToDelete, setEntryToDelete] =
    useState<GetFinance200DataItem | null>(null);
  const params = {
    limit: 100,
    ...(type !== "all" ? { type } : {}),
    ...(category !== "all" ? { category } : {}),
    ...(from ? { from: dayStartIso(from) } : {}),
    ...(to ? { to: dayEndIso(to) } : {}),
  };
  const { data, isLoading, isError } = useGetFinance(params, {
    query: { refetchOnWindowFocus: false },
  });
  const remove = useDeleteFinanceId({
    mutation: {
      onSuccess: () => {
        toast.success("Lançamento removido");
        queryClient.invalidateQueries({ queryKey: getGetFinanceQueryKey() });
        setEntryToDelete(null);
      },
      onError: () => toast.error("Não foi possível remover o lançamento"),
    },
  });
  const openCreate = () => {
    setSelectedEntry(null);
    setDialogOpen(true);
  };
  const openEdit = (entry: GetFinance200DataItem) => {
    setSelectedEntry(entry);
    setDialogOpen(true);
  };
  const clearFilters = () => {
    setType("all");
    setCategory("all");
    setFrom("");
    setTo("");
  };
  const exportRows = useMemo(
    () =>
      (data?.data ?? []).map((entry) => ({
        Data: new Date(entry.occurredAt).toLocaleDateString("pt-BR"),
        Descrição: entry.description,
        Categoria: entry.category,
        Tipo: entry.type === "INCOME" ? "Entrada" : "Saída",
        "Valor (R$)": (entry.amountCents / 100).toFixed(2).replace(".", ","),
        "Última alteração":
          entry.updatedByName || entry.createdByName || "Não registrada",
      })),
    [data?.data],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        routeName="Organização"
        title="Financeiro"
        subtitle="Acompanhe entradas, saídas e saldo em um só lugar."
        breadcrumb={[{ label: "Financeiro" }]}
        variant="compact"
      >
        <Button
          variant="outline"
          onClick={() => downloadCsv("kairos-financeiro.csv", exportRows)}
          disabled={!exportRows.length}
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          Exportar CSV
        </Button>
        {canManage && (
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Novo lançamento
          </Button>
        )}
      </PageHeader>

      {isError && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          Não foi possível carregar o financeiro.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Entradas</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-emerald-600">
              <ArrowUpCircle className="h-5 w-5" aria-hidden="true" />
              {money(data?.summary?.incomeCents ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saídas</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-rose-600">
              <ArrowDownCircle className="h-5 w-5" aria-hidden="true" />
              {money(data?.summary?.expenseCents ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo</CardDescription>
            <CardTitle
              className={`flex items-center gap-2 text-2xl ${(data?.summary?.balanceCents ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600"}`}
            >
              <WalletCards className="h-5 w-5" aria-hidden="true" />
              {money(data?.summary?.balanceCents ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <CardTitle>Lançamentos</CardTitle>
              <CardDescription>
                {data?.summary?.entriesCount ?? 0} lançamento(s) no filtro atual.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={type}
                onValueChange={(value) =>
                  setType(value as "all" | GetFinanceType)
                }
              >
                <SelectTrigger
                  className="w-[140px]"
                  aria-label="Filtrar por tipo"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="INCOME">Entradas</SelectItem>
                  <SelectItem value="EXPENSE">Saídas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  className="w-[180px] min-w-[170px] max-w-[220px]"
                  aria-label="Filtrar por categoria"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {data?.categories?.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DatePicker
                value={from}
                onChange={setFrom}
                aria-label="Data inicial"
                placeholder="Data inicial"
                displayFormat="short"
                className="w-[130px]"
              />
              <DatePicker
                value={to}
                onChange={setTo}
                aria-label="Data final"
                placeholder="Data final"
                displayFormat="short"
                className="w-[130px]"
              />
              {(type !== "all" || category !== "all" || from || to) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : !data?.data?.length ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum lançamento encontrado neste período.
              </p>
              {canManage && (
                <Button variant="link" onClick={openCreate} className="mt-1">
                  Adicionar lançamento
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    {canManage && <TableHead className="w-20"><span className="sr-only">Ações</span></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {new Date(entry.occurredAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="font-medium">
                        <p>{entry.description}</p>
                        <p className="mt-1 text-xs font-normal text-muted-foreground">
                          {entry.updatedByName
                            ? `Alterado por ${entry.updatedByName}`
                            : entry.createdByName
                              ? `Criado por ${entry.createdByName}`
                              : "Autor não registrado"}
                        </p>
                      </TableCell>
                      <TableCell>{entry.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            entry.type === "INCOME" ? "default" : "destructive"
                          }
                        >
                          {entry.type === "INCOME" ? "Entrada" : "Saída"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {money(entry.amountCents)}
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(entry)}
                              aria-label={`Editar ${entry.description}`}
                            >
                              <Pencil className="h-4 w-4" aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={remove.isPending}
                              onClick={() => setEntryToDelete(entry)}
                              aria-label={`Remover ${entry.description}`}
                            >
                              <Trash2
                                className="h-4 w-4 text-destructive"
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {canManage && <FinanceEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={selectedEntry}
      />}
      {canManage && <AlertDialog
        open={Boolean(entryToDelete)}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover lançamento?</AlertDialogTitle>
            <AlertDialogDescription>
              “{entryToDelete?.description}” sairá dos totais, mas a exclusão
              ficará registrada para auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                entryToDelete && remove.mutate({ id: entryToDelete.id })
              }
              disabled={remove.isPending}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>}
    </div>
  );
}
