/**
 * type AxiosResponse<T> = T
 */
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseInfiniteQueryResult,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import type {
  DeleteFinanceId204,
  DeleteFinanceId401,
  DeleteFinanceId403,
  DeleteFinanceId404,
  GetFinance200,
  GetFinance401,
  GetFinanceParams,
  GetFinanceSummary200,
  GetFinanceSummary401,
  PostFinance201,
  PostFinance400,
  PostFinance401,
  PostFinance403,
  PostFinanceBody,
  PutFinanceId200,
  PutFinanceId401,
  PutFinanceId403,
  PutFinanceId404,
  PutFinanceIdBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Lista lançamentos e resumo financeiro
 */
export const getFinance = (params?: GetFinanceParams, signal?: AbortSignal) => {
  return customInstance<GetFinance200>({
    url: `/finance`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetFinanceQueryKey = (params?: GetFinanceParams) => {
  return [`/finance`, ...(params ? [params] : [])] as const;
};

export const getGetFinanceInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getFinance>>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getFinance>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetFinanceQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getFinance>>> = ({
    signal,
  }) => getFinance(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getFinance>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetFinanceInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getFinance>>
>;
export type GetFinanceInfiniteQueryError = GetFinance401;

export function useGetFinanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinance>>>,
  TError = GetFinance401,
>(
  params: undefined | GetFinanceParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getFinance>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getFinance>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetFinanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinance>>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getFinance>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getFinance>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetFinanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinance>>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getFinance>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetFinanceInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinance>>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getFinance>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetFinanceInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetFinanceQueryOptions = <
  TData = Awaited<ReturnType<typeof getFinance>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getFinance>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetFinanceQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getFinance>>> = ({
    signal,
  }) => getFinance(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getFinance>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetFinanceQueryResult = NonNullable<
  Awaited<ReturnType<typeof getFinance>>
>;
export type GetFinanceQueryError = GetFinance401;

export function useGetFinance<
  TData = Awaited<ReturnType<typeof getFinance>>,
  TError = GetFinance401,
>(
  params: undefined | GetFinanceParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getFinance>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getFinance>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetFinance<
  TData = Awaited<ReturnType<typeof getFinance>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getFinance>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getFinance>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetFinance<
  TData = Awaited<ReturnType<typeof getFinance>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getFinance>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetFinance<
  TData = Awaited<ReturnType<typeof getFinance>>,
  TError = GetFinance401,
>(
  params?: GetFinanceParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getFinance>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetFinanceQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Cria um lançamento financeiro
 */
export const postFinance = (
  postFinanceBody: PostFinanceBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostFinance201>({
    url: `/finance`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postFinanceBody,
    signal,
  });
};

export const getPostFinanceMutationOptions = <
  TError = PostFinance400 | PostFinance401 | PostFinance403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postFinance>>,
    TError,
    { data: PostFinanceBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postFinance>>,
  TError,
  { data: PostFinanceBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postFinance>>,
    { data: PostFinanceBody }
  > = (props) => {
    const { data } = props ?? {};

    return postFinance(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostFinanceMutationResult = NonNullable<
  Awaited<ReturnType<typeof postFinance>>
>;
export type PostFinanceMutationBody = PostFinanceBody;
export type PostFinanceMutationError =
  | PostFinance400
  | PostFinance401
  | PostFinance403;

export const usePostFinance = <
  TError = PostFinance400 | PostFinance401 | PostFinance403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postFinance>>,
    TError,
    { data: PostFinanceBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postFinance>>,
  TError,
  { data: PostFinanceBody },
  TContext
> => {
  const mutationOptions = getPostFinanceMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Atualiza um lançamento financeiro
 */
export const putFinanceId = (
  id: string,
  putFinanceIdBody: PutFinanceIdBody,
) => {
  return customInstance<PutFinanceId200>({
    url: `/finance/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putFinanceIdBody,
  });
};

export const getPutFinanceIdMutationOptions = <
  TError = PutFinanceId401 | PutFinanceId403 | PutFinanceId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putFinanceId>>,
    TError,
    { id: string; data: PutFinanceIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putFinanceId>>,
  TError,
  { id: string; data: PutFinanceIdBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putFinanceId>>,
    { id: string; data: PutFinanceIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return putFinanceId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutFinanceIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putFinanceId>>
>;
export type PutFinanceIdMutationBody = PutFinanceIdBody;
export type PutFinanceIdMutationError =
  | PutFinanceId401
  | PutFinanceId403
  | PutFinanceId404;

export const usePutFinanceId = <
  TError = PutFinanceId401 | PutFinanceId403 | PutFinanceId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putFinanceId>>,
    TError,
    { id: string; data: PutFinanceIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putFinanceId>>,
  TError,
  { id: string; data: PutFinanceIdBody },
  TContext
> => {
  const mutationOptions = getPutFinanceIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove um lançamento financeiro
 */
export const deleteFinanceId = (id: string) => {
  return customInstance<DeleteFinanceId204>({
    url: `/finance/${id}`,
    method: "DELETE",
  });
};

export const getDeleteFinanceIdMutationOptions = <
  TError = DeleteFinanceId401 | DeleteFinanceId403 | DeleteFinanceId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteFinanceId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteFinanceId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteFinanceId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteFinanceId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteFinanceIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteFinanceId>>
>;

export type DeleteFinanceIdMutationError =
  | DeleteFinanceId401
  | DeleteFinanceId403
  | DeleteFinanceId404;

export const useDeleteFinanceId = <
  TError = DeleteFinanceId401 | DeleteFinanceId403 | DeleteFinanceId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteFinanceId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteFinanceId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteFinanceIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Resumo financeiro sem a lista de lançamentos
 */
export const getFinanceSummary = (signal?: AbortSignal) => {
  return customInstance<GetFinanceSummary200>({
    url: `/finance/summary`,
    method: "GET",
    signal,
  });
};

export const getGetFinanceSummaryQueryKey = () => {
  return [`/finance/summary`] as const;
};

export const getGetFinanceSummaryInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getFinanceSummary>>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetFinanceSummaryQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getFinanceSummary>>
  > = ({ signal }) => getFinanceSummary(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getFinanceSummary>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetFinanceSummaryInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getFinanceSummary>>
>;
export type GetFinanceSummaryInfiniteQueryError = GetFinanceSummary401;

export function useGetFinanceSummaryInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinanceSummary>>>,
  TError = GetFinanceSummary401,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getFinanceSummary>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetFinanceSummaryInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinanceSummary>>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getFinanceSummary>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetFinanceSummaryInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinanceSummary>>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetFinanceSummaryInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getFinanceSummary>>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetFinanceSummaryInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetFinanceSummaryQueryOptions = <
  TData = Awaited<ReturnType<typeof getFinanceSummary>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetFinanceSummaryQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getFinanceSummary>>
  > = ({ signal }) => getFinanceSummary(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getFinanceSummary>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetFinanceSummaryQueryResult = NonNullable<
  Awaited<ReturnType<typeof getFinanceSummary>>
>;
export type GetFinanceSummaryQueryError = GetFinanceSummary401;

export function useGetFinanceSummary<
  TData = Awaited<ReturnType<typeof getFinanceSummary>>,
  TError = GetFinanceSummary401,
>(options: {
  query: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getFinanceSummary>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetFinanceSummary<
  TData = Awaited<ReturnType<typeof getFinanceSummary>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getFinanceSummary>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetFinanceSummary<
  TData = Awaited<ReturnType<typeof getFinanceSummary>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetFinanceSummary<
  TData = Awaited<ReturnType<typeof getFinanceSummary>>,
  TError = GetFinanceSummary401,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getFinanceSummary>>,
      TError,
      TData
    >
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetFinanceSummaryQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
