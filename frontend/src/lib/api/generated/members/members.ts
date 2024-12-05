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
  DeleteMembersId204,
  DeleteMembersId401,
  DeleteMembersId404,
  DeleteMembersId500,
  GetMembers200,
  GetMembers500,
  GetMembersId200,
  GetMembersId404,
  GetMembersId500,
  GetMembersParams,
  PostMembers201,
  PostMembers400,
  PostMembers500,
  PostMembersBody,
  PutMembersId200,
  PutMembersId404,
  PutMembersId500,
  PutMembersIdBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Lista membros com paginação e filtros
 */
export const getMembers = (params?: GetMembersParams, signal?: AbortSignal) => {
  return customInstance<GetMembers200>({
    url: `/members`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetMembersQueryKey = (params?: GetMembersParams) => {
  return [`/members`, ...(params ? [params] : [])] as const;
};

export const getGetMembersInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getMembers>>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembers>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMembersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMembers>>> = ({
    signal,
  }) => getMembers(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getMembers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetMembersInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMembers>>
>;
export type GetMembersInfiniteQueryError = GetMembers500;

export function useGetMembersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembers>>>,
  TError = GetMembers500,
>(
  params: undefined | GetMembersParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembers>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembers>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetMembersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembers>>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembers>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembers>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetMembersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembers>>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembers>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetMembersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembers>>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembers>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetMembersInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetMembersQueryOptions = <
  TData = Awaited<ReturnType<typeof getMembers>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembers>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMembersQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMembers>>> = ({
    signal,
  }) => getMembers(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getMembers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetMembersQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMembers>>
>;
export type GetMembersQueryError = GetMembers500;

export function useGetMembers<
  TData = Awaited<ReturnType<typeof getMembers>>,
  TError = GetMembers500,
>(
  params: undefined | GetMembersParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembers>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembers>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetMembers<
  TData = Awaited<ReturnType<typeof getMembers>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembers>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembers>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetMembers<
  TData = Awaited<ReturnType<typeof getMembers>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembers>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetMembers<
  TData = Awaited<ReturnType<typeof getMembers>>,
  TError = GetMembers500,
>(
  params?: GetMembersParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembers>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetMembersQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Cria um novo membro
 */
export const postMembers = (
  postMembersBody: PostMembersBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostMembers201>({
    url: `/members`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postMembersBody,
    signal,
  });
};

export const getPostMembersMutationOptions = <
  TError = PostMembers400 | PostMembers500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postMembers>>,
    TError,
    { data: PostMembersBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postMembers>>,
  TError,
  { data: PostMembersBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postMembers>>,
    { data: PostMembersBody }
  > = (props) => {
    const { data } = props ?? {};

    return postMembers(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostMembersMutationResult = NonNullable<
  Awaited<ReturnType<typeof postMembers>>
>;
export type PostMembersMutationBody = PostMembersBody;
export type PostMembersMutationError = PostMembers400 | PostMembers500;

export const usePostMembers = <
  TError = PostMembers400 | PostMembers500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postMembers>>,
    TError,
    { data: PostMembersBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postMembers>>,
  TError,
  { data: PostMembersBody },
  TContext
> => {
  const mutationOptions = getPostMembersMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Busca um membro pelo ID
 */
export const getMembersId = (id: string, signal?: AbortSignal) => {
  return customInstance<GetMembersId200>({
    url: `/members/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetMembersIdQueryKey = (id: string) => {
  return [`/members/${id}`] as const;
};

export const getGetMembersIdInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getMembersId>>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembersId>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMembersIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMembersId>>> = ({
    signal,
  }) => getMembersId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getMembersId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetMembersIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMembersId>>
>;
export type GetMembersIdInfiniteQueryError = GetMembersId404 | GetMembersId500;

export function useGetMembersIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembersId>>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembersId>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembersId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetMembersIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembersId>>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembersId>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembersId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetMembersIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembersId>>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembersId>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetMembersIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getMembersId>>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getMembersId>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetMembersIdInfiniteQueryOptions(id, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetMembersIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getMembersId>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembersId>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMembersIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMembersId>>> = ({
    signal,
  }) => getMembersId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getMembersId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetMembersIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMembersId>>
>;
export type GetMembersIdQueryError = GetMembersId404 | GetMembersId500;

export function useGetMembersId<
  TData = Awaited<ReturnType<typeof getMembersId>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembersId>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembersId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetMembersId<
  TData = Awaited<ReturnType<typeof getMembersId>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembersId>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMembersId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetMembersId<
  TData = Awaited<ReturnType<typeof getMembersId>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembersId>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetMembersId<
  TData = Awaited<ReturnType<typeof getMembersId>>,
  TError = GetMembersId404 | GetMembersId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getMembersId>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetMembersIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza um membro
 */
export const putMembersId = (
  id: string,
  putMembersIdBody: PutMembersIdBody,
) => {
  return customInstance<PutMembersId200>({
    url: `/members/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putMembersIdBody,
  });
};

export const getPutMembersIdMutationOptions = <
  TError = PutMembersId404 | PutMembersId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putMembersId>>,
    TError,
    { id: string; data: PutMembersIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putMembersId>>,
  TError,
  { id: string; data: PutMembersIdBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putMembersId>>,
    { id: string; data: PutMembersIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return putMembersId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutMembersIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putMembersId>>
>;
export type PutMembersIdMutationBody = PutMembersIdBody;
export type PutMembersIdMutationError = PutMembersId404 | PutMembersId500;

export const usePutMembersId = <
  TError = PutMembersId404 | PutMembersId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putMembersId>>,
    TError,
    { id: string; data: PutMembersIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putMembersId>>,
  TError,
  { id: string; data: PutMembersIdBody },
  TContext
> => {
  const mutationOptions = getPutMembersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove um membro
 */
export const deleteMembersId = (id: string) => {
  return customInstance<DeleteMembersId204>({
    url: `/members/${id}`,
    method: "DELETE",
  });
};

export const getDeleteMembersIdMutationOptions = <
  TError = DeleteMembersId401 | DeleteMembersId404 | DeleteMembersId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteMembersId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteMembersId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteMembersId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteMembersId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteMembersIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteMembersId>>
>;

export type DeleteMembersIdMutationError =
  | DeleteMembersId401
  | DeleteMembersId404
  | DeleteMembersId500;

export const useDeleteMembersId = <
  TError = DeleteMembersId401 | DeleteMembersId404 | DeleteMembersId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteMembersId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteMembersId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteMembersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
