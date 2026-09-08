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
  GetHealth200,
  GetHealth503,
  GetSystemChurch200,
  GetSystemChurch400,
  GetSystemChurch404,
  GetSystemContext200,
  GetSystemContext401,
  GetSystemContext403,
  GetSystemInfo200,
  PostSystemChurches201,
  PostSystemChurches400,
  PostSystemChurches401,
  PostSystemChurches403,
  PostSystemChurchesBody,
  PutSystemChurch200,
  PutSystemChurch400,
  PutSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
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
export type GetSystemChurchInfiniteQueryError =
  | GetSystemChurch400
  | GetSystemChurch404;

export function useGetSystemChurchInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemChurch>>>,
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
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
export type GetSystemChurchQueryError = GetSystemChurch400 | GetSystemChurch404;

export function useGetSystemChurch<
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = GetSystemChurch400 | GetSystemChurch404,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemChurch>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetSystemChurch<
  TData = Awaited<ReturnType<typeof getSystemChurch>>,
  TError = GetSystemChurch400 | GetSystemChurch404,
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
  TError = PutSystemChurch400 | PutSystemChurch404,
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
export type PutSystemChurchMutationError =
  | PutSystemChurch400
  | PutSystemChurch404;

export const usePutSystemChurch = <
  TError = PutSystemChurch400 | PutSystemChurch404,
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
/**
 * Retorna a Rede, as unidades acessíveis e a seleção ativa
 */
export const getSystemContext = (signal?: AbortSignal) => {
  return customInstance<GetSystemContext200>({
    url: `/system/context`,
    method: "GET",
    signal,
  });
};

export const getGetSystemContextQueryKey = () => {
  return [`/system/context`] as const;
};

export const getGetSystemContextInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemContext>>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemContext>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSystemContextQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getSystemContext>>
  > = ({ signal }) => getSystemContext(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getSystemContext>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetSystemContextInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSystemContext>>
>;
export type GetSystemContextInfiniteQueryError =
  | GetSystemContext401
  | GetSystemContext403;

export function useGetSystemContextInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemContext>>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemContext>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemContext>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemContextInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemContext>>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemContext>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemContext>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemContextInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemContext>>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemContext>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetSystemContextInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getSystemContext>>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getSystemContext>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetSystemContextInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetSystemContextQueryOptions = <
  TData = Awaited<ReturnType<typeof getSystemContext>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemContext>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSystemContextQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getSystemContext>>
  > = ({ signal }) => getSystemContext(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getSystemContext>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetSystemContextQueryResult = NonNullable<
  Awaited<ReturnType<typeof getSystemContext>>
>;
export type GetSystemContextQueryError =
  | GetSystemContext401
  | GetSystemContext403;

export function useGetSystemContext<
  TData = Awaited<ReturnType<typeof getSystemContext>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemContext>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemContext>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetSystemContext<
  TData = Awaited<ReturnType<typeof getSystemContext>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemContext>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getSystemContext>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetSystemContext<
  TData = Awaited<ReturnType<typeof getSystemContext>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemContext>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetSystemContext<
  TData = Awaited<ReturnType<typeof getSystemContext>>,
  TError = GetSystemContext401 | GetSystemContext403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getSystemContext>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetSystemContextQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Adiciona uma igreja ou unidade à Rede atual
 */
export const postSystemChurches = (
  postSystemChurchesBody: PostSystemChurchesBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostSystemChurches201>({
    url: `/system/churches`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postSystemChurchesBody,
    signal,
  });
};

export const getPostSystemChurchesMutationOptions = <
  TError =
    | PostSystemChurches400
    | PostSystemChurches401
    | PostSystemChurches403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postSystemChurches>>,
    TError,
    { data: PostSystemChurchesBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postSystemChurches>>,
  TError,
  { data: PostSystemChurchesBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postSystemChurches>>,
    { data: PostSystemChurchesBody }
  > = (props) => {
    const { data } = props ?? {};

    return postSystemChurches(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostSystemChurchesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postSystemChurches>>
>;
export type PostSystemChurchesMutationBody = PostSystemChurchesBody;
export type PostSystemChurchesMutationError =
  | PostSystemChurches400
  | PostSystemChurches401
  | PostSystemChurches403;

export const usePostSystemChurches = <
  TError =
    | PostSystemChurches400
    | PostSystemChurches401
    | PostSystemChurches403,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postSystemChurches>>,
    TError,
    { data: PostSystemChurchesBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postSystemChurches>>,
  TError,
  { data: PostSystemChurchesBody },
  TContext
> => {
  const mutationOptions = getPostSystemChurchesMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Verifica a disponibilidade da API e do banco
 */
export const getHealth = (signal?: AbortSignal) => {
  return customInstance<GetHealth200>({
    url: `/health`,
    method: "GET",
    signal,
  });
};

export const getGetHealthQueryKey = () => {
  return [`/health`] as const;
};

export const getGetHealthInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getHealth>>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHealth>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetHealthQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getHealth>>> = ({
    signal,
  }) => getHealth(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getHealth>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetHealthInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getHealth>>
>;
export type GetHealthInfiniteQueryError = GetHealth503;

export function useGetHealthInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getHealth>>>,
  TError = GetHealth503,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHealth>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getHealth>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetHealthInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getHealth>>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHealth>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getHealth>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetHealthInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getHealth>>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHealth>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetHealthInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getHealth>>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getHealth>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetHealthInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetHealthQueryOptions = <
  TData = Awaited<ReturnType<typeof getHealth>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getHealth>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetHealthQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getHealth>>> = ({
    signal,
  }) => getHealth(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getHealth>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetHealthQueryResult = NonNullable<
  Awaited<ReturnType<typeof getHealth>>
>;
export type GetHealthQueryError = GetHealth503;

export function useGetHealth<
  TData = Awaited<ReturnType<typeof getHealth>>,
  TError = GetHealth503,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getHealth>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getHealth>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetHealth<
  TData = Awaited<ReturnType<typeof getHealth>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getHealth>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getHealth>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetHealth<
  TData = Awaited<ReturnType<typeof getHealth>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getHealth>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetHealth<
  TData = Awaited<ReturnType<typeof getHealth>>,
  TError = GetHealth503,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getHealth>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetHealthQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}
