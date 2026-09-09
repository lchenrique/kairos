"use client";

import { useQuery } from "@tanstack/react-query";
import { customInstance } from "@/lib/api/axios-instance";

export type BillingPlan = {
  id: "ESSENTIAL" | "COMMUNITY";
  name: string;
  priceCents: number;
  churchLimit: number | null;
  description: string;
  features: string[];
};

export type AccountState = {
  stage: "ACCOUNT_READY" | "CHECKOUT_PENDING" | "CREATE_CHURCH" | "ACTIVE";
  organization: { id: string; name: string } | null;
  subscription: {
    plan: BillingPlan["id"];
    status: "PENDING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
    currentPeriodEnd: string | null;
  } | null;
  latestIntent: {
    id: string;
    plan: BillingPlan["id"];
    status: string;
    workspaceName: string | null;
    createdAt: string;
  } | null;
  plans: BillingPlan[];
};

export const accountStateQueryKey = ["account-state"] as const;

export function useAccountState(enabled = true) {
  return useQuery({
    queryKey: accountStateQueryKey,
    queryFn: () => customInstance<AccountState>({ url: "/billing/account-state", method: "GET" }),
    enabled,
    staleTime: 30_000,
    retry: false,
  });
}
