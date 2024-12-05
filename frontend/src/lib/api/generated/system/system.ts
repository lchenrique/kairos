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
  GetSystemChurch200,
  GetSystemInfo200,
  PutSystemChurch200,
  PutSystemChurchBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Obtém informações do sistema
 */
export const getSystemInfo = (signal?: AbortSignal) => {
  return customInstance<GetSystemInfo200>({
    url: `/system/info`,
    method: "GET",
    signal,
  });
};

export const getGetSystemInfoQueryKey = () => {
  return [`/system/info`] as const;
};

export const getGetSystemInfoInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemInfo>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemInfo>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSystemInfoQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSystemInfo>>> = ({
    signal,
  }) => getSystemInfo(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getSystemInfo>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetSystemInfoInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSystemInfo>>
>;
export type GetSystemInfoInfiniteQueryError = unknown;

export function useGetSystemInfoInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemInfo>>>,
  TError = unknown,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemInfo>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemInfo>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemInfoInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemInfo>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemInfo>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemInfo>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemInfoInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemInfo>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemInfo>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetSystemInfoInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemInfo>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemInfo>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetSystemInfoInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetSystemInfoQueryOptions = <
  TData = Awaited<ReturnType<typeof getSystemInfo>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemInfo>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSystemInfoQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSystemInfo>>> = ({
    signal,
  }) => getSystemInfo(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getSystemInfo>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetSystemInfoQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSystemInfo>>
>;
export type GetSystemInfoQueryError = unknown;

export function useGetSystemInfo<
  TData = Awaited<ReturnType<typeof getSystemInfo>>,
  TError = unknown,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemInfo>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemInfo>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemInfo<
  TData = Awaited<ReturnType<typeof getSystemInfo>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemInfo>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemInfo>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetSystemInfo<
  TData = Awaited<ReturnType<typeof getSystemInfo>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemInfo>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetSystemInfo<
  TData = Awaited<ReturnType<typeof getSystemInfo>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemInfo>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetSystemInfoQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Obtém as configurações da igreja
 */
export const getSystemChurch = (signal?: AbortSignal) => {
  return customInstance<GetSystemChurch200>({
    url: `/system/church`,
    method: "GET",
    signal,
  });
};

export const getGetSystemChurchQueryKey = () => {
  return [`/system/church`] as const;
};

export const getGetSystemChurchInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemChurch>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemChurch>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSystemChurchQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSystemChurch>>> = ({
    signal,
  }) => getSystemChurch(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getSystemChurch>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetSystemChurchInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSystemChurch>>
>;
export type GetSystemChurchInfiniteQueryError = unknown;

export function useGetSystemChurchInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemChurch>>>,
  TError = unknown,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemChurch>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemChurch>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemChurchInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemChurch>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemChurch>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemChurch>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemChurchInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemChurch>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemChurch>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetSystemChurchInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemChurch>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemChurch>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetSystemChurchInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetSystemChurchQueryOptions = <
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemChurch>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSystemChurchQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSystemChurch>>> = ({
    signal,
  }) => getSystemChurch(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getSystemChurch>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetSystemChurchQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSystemChurch>>
>;
export type GetSystemChurchQueryError = unknown;

export function useGetSystemChurch<
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = unknown,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemChurch>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemChurch>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemChurch<
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemChurch>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemChurch>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetSystemChurch<
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemChurch>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetSystemChurch<
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemChurch>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetSystemChurchQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza as configurações da igreja
 */
export const putSystemChurch = (putSystemChurchBody: PutSystemChurchBody) => {
  return customInstance<PutSystemChurch200>({
    url: `/system/church`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putSystemChurchBody,
  });
};

export const getPutSystemChurchMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putSystemChurch>>,
    TError,
    { data: PutSystemChurchBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putSystemChurch>>,
  TError,
  { data: PutSystemChurchBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putSystemChurch>>,
    { data: PutSystemChurchBody }
  > = (props) => {
    const { data } = props ?? {};

    return putSystemChurch(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutSystemChurchMutationResult = NonNullable<
  Awaited<ReturnType<typeof putSystemChurch>>
>;
export type PutSystemChurchMutationBody = PutSystemChurchBody;
export type PutSystemChurchMutationError = unknown;

export const usePutSystemChurch = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putSystemChurch>>,
    TError,
    { data: PutSystemChurchBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putSystemChurch>>,
  TError,
  { data: PutSystemChurchBody },
  TContext
> => {
  const mutationOptions = getPutSystemChurchMutationOptions(options);

  return useMutation(mutationOptions);
};
