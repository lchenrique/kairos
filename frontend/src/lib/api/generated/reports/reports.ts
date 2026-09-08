/**
 * type AxiosResponse<T> = T
 */
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  GetReportsOverview200,
  GetReportsOverview401,
  GetReportsOverviewParams,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Resumo de indicadores para o painel de relatórios
 */
export const getReportsOverview = (
  params?: GetReportsOverviewParams,
  signal?: AbortSignal,
) => {
  return customInstance<GetReportsOverview200>({
    url: `/reports/overview`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetReportsOverviewQueryKey = (
  params?: GetReportsOverviewParams,
) => {
  return [`/reports/overview`, ...(params ? [params] : [])] as const;
};

export const getGetReportsOverviewInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getReportsOverview>>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetReportsOverviewQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getReportsOverview>>
  > = ({ signal }) => getReportsOverview(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getReportsOverview>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetReportsOverviewInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getReportsOverview>>
>;
export type GetReportsOverviewInfiniteQueryError = GetReportsOverview401;

export function useGetReportsOverviewInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getReportsOverview>>>,
  TError = GetReportsOverview401,
>(
  params: undefined | GetReportsOverviewParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getReportsOverview>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetReportsOverviewInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getReportsOverview>>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getReportsOverview>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetReportsOverviewInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getReportsOverview>>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetReportsOverviewInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getReportsOverview>>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetReportsOverviewInfiniteQueryOptions(
    params,
    options,
  );

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetReportsOverviewQueryOptions = <
  TData = Awaited<ReturnType<typeof getReportsOverview>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ?? getGetReportsOverviewQueryKey(params);

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getReportsOverview>>
  > = ({ signal }) => getReportsOverview(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getReportsOverview>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetReportsOverviewQueryResult = NonNullable<
  Awaited<ReturnType<typeof getReportsOverview>>
>;
export type GetReportsOverviewQueryError = GetReportsOverview401;

export function useGetReportsOverview<
  TData = Awaited<ReturnType<typeof getReportsOverview>>,
  TError = GetReportsOverview401,
>(
  params: undefined | GetReportsOverviewParams,
  options: {
    query: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getReportsOverview>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetReportsOverview<
  TData = Awaited<ReturnType<typeof getReportsOverview>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getReportsOverview>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetReportsOverview<
  TData = Awaited<ReturnType<typeof getReportsOverview>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetReportsOverview<
  TData = Awaited<ReturnType<typeof getReportsOverview>>,
  TError = GetReportsOverview401,
>(
  params?: GetReportsOverviewParams,
  options?: {
    query?: Partial<
      UseQueryOptions<
        Awaited<ReturnType<typeof getReportsOverview>>,
        TError,
        TData
      >
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetReportsOverviewQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
