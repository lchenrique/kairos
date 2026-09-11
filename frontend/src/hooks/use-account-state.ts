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
  stage: "ACCOUNT_READY" | "CHECKOUT_PENDING" | "CREATE_CHURCH" | "SUBSCRIPTION_REQUIRED" | "ACTIVE";
  organization: { id: string; name: string } | null;
  subscription: {
    plan: BillingPlan["id"];
    status: "PENDING" | "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
  } | null;
  latestIntent: {
    id: string;
    plan: BillingPlan["id"];
    status: string;
    workspaceName: string | null;
    checkoutUrl: string | null;
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
