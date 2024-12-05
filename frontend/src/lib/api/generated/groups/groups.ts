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
  DeleteGroupsId204,
  DeleteGroupsIdMembersMemberId204,
  DeleteGroupsIdMembersMemberId401,
  DeleteGroupsIdMembersMemberId404,
  DeleteGroupsIdMembersMemberId500,
  GetGroups200,
  GetGroups401,
  GetGroups500,
  GetGroupsId200,
  GetGroupsParams,
  PostGroups201,
  PostGroups400,
  PostGroups500,
  PostGroupsBody,
  PostGroupsIdMembers201,
  PostGroupsIdMembers400,
  PostGroupsIdMembers401,
  PostGroupsIdMembers404,
  PostGroupsIdMembers500,
  PostGroupsIdMembersBody,
  PutGroupsId200,
  PutGroupsId401,
  PutGroupsId404,
  PutGroupsId500,
  PutGroupsIdBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Lista grupos com paginação e filtros
 */
export const getGroups = (params?: GetGroupsParams, signal?: AbortSignal) => {
  return customInstance<GetGroups200>({
    url: `/groups`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetGroupsQueryKey = (params?: GetGroupsParams) => {
  return [`/groups`, ...(params ? [params] : [])] as const;
};

export const getGetGroupsInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getGroups>>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroups>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetGroupsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getGroups>>> = ({
    signal,
  }) => getGroups(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getGroups>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetGroupsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getGroups>>
>;
export type GetGroupsInfiniteQueryError = GetGroups401 | GetGroups500;

export function useGetGroupsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroups>>>,
  TError = GetGroups401 | GetGroups500,
>(
  params: undefined | GetGroupsParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroups>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroups>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetGroupsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroups>>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroups>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroups>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetGroupsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroups>>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroups>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetGroupsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroups>>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroups>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetGroupsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetGroupsQueryOptions = <
  TData = Awaited<ReturnType<typeof getGroups>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroups>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetGroupsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getGroups>>> = ({
    signal,
  }) => getGroups(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getGroups>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetGroupsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getGroups>>
>;
export type GetGroupsQueryError = GetGroups401 | GetGroups500;

export function useGetGroups<
  TData = Awaited<ReturnType<typeof getGroups>>,
  TError = GetGroups401 | GetGroups500,
>(
  params: undefined | GetGroupsParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroups>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroups>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetGroups<
  TData = Awaited<ReturnType<typeof getGroups>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroups>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroups>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetGroups<
  TData = Awaited<ReturnType<typeof getGroups>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroups>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetGroups<
  TData = Awaited<ReturnType<typeof getGroups>>,
  TError = GetGroups401 | GetGroups500,
>(
  params?: GetGroupsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroups>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetGroupsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Cria um novo grupo
 */
export const postGroups = (
  postGroupsBody: PostGroupsBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostGroups201>({
    url: `/groups`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postGroupsBody,
    signal,
  });
};

export const getPostGroupsMutationOptions = <
  TError = PostGroups400 | PostGroups500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postGroups>>,
    TError,
    { data: PostGroupsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postGroups>>,
  TError,
  { data: PostGroupsBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postGroups>>,
    { data: PostGroupsBody }
  > = (props) => {
    const { data } = props ?? {};

    return postGroups(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostGroupsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postGroups>>
>;
export type PostGroupsMutationBody = PostGroupsBody;
export type PostGroupsMutationError = PostGroups400 | PostGroups500;

export const usePostGroups = <
  TError = PostGroups400 | PostGroups500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postGroups>>,
    TError,
    { data: PostGroupsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postGroups>>,
  TError,
  { data: PostGroupsBody },
  TContext
> => {
  const mutationOptions = getPostGroupsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Obtém um grupo por ID
 */
export const getGroupsId = (id: string, signal?: AbortSignal) => {
  return customInstance<GetGroupsId200>({
    url: `/groups/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetGroupsIdQueryKey = (id: string) => {
  return [`/groups/${id}`] as const;
};

export const getGetGroupsIdInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getGroupsId>>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroupsId>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetGroupsIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getGroupsId>>> = ({
    signal,
  }) => getGroupsId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getGroupsId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetGroupsIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getGroupsId>>
>;
export type GetGroupsIdInfiniteQueryError = unknown;

export function useGetGroupsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroupsId>>>,
  TError = unknown,
>(
  id: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroupsId>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroupsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetGroupsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroupsId>>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroupsId>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroupsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetGroupsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroupsId>>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroupsId>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetGroupsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getGroupsId>>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getGroupsId>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetGroupsIdInfiniteQueryOptions(id, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetGroupsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getGroupsId>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroupsId>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetGroupsIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getGroupsId>>> = ({
    signal,
  }) => getGroupsId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getGroupsId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetGroupsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getGroupsId>>
>;
export type GetGroupsIdQueryError = unknown;

export function useGetGroupsId<
  TData = Awaited<ReturnType<typeof getGroupsId>>,
  TError = unknown,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroupsId>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroupsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetGroupsId<
  TData = Awaited<ReturnType<typeof getGroupsId>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroupsId>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGroupsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetGroupsId<
  TData = Awaited<ReturnType<typeof getGroupsId>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroupsId>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetGroupsId<
  TData = Awaited<ReturnType<typeof getGroupsId>>,
  TError = unknown,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getGroupsId>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetGroupsIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza um grupo
 */
export const putGroupsId = (id: string, putGroupsIdBody: PutGroupsIdBody) => {
  return customInstance<PutGroupsId200>({
    url: `/groups/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putGroupsIdBody,
  });
};

export const getPutGroupsIdMutationOptions = <
  TError = PutGroupsId401 | PutGroupsId404 | PutGroupsId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putGroupsId>>,
    TError,
    { id: string; data: PutGroupsIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putGroupsId>>,
  TError,
  { id: string; data: PutGroupsIdBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putGroupsId>>,
    { id: string; data: PutGroupsIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return putGroupsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutGroupsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putGroupsId>>
>;
export type PutGroupsIdMutationBody = PutGroupsIdBody;
export type PutGroupsIdMutationError =
  | PutGroupsId401
  | PutGroupsId404
  | PutGroupsId500;

export const usePutGroupsId = <
  TError = PutGroupsId401 | PutGroupsId404 | PutGroupsId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putGroupsId>>,
    TError,
    { id: string; data: PutGroupsIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putGroupsId>>,
  TError,
  { id: string; data: PutGroupsIdBody },
  TContext
> => {
  const mutationOptions = getPutGroupsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove um grupo
 */
export const deleteGroupsId = (id: string) => {
  return customInstance<DeleteGroupsId204>({
    url: `/groups/${id}`,
    method: "DELETE",
  });
};

export const getDeleteGroupsIdMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteGroupsId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteGroupsId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteGroupsId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteGroupsId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteGroupsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteGroupsId>>
>;

export type DeleteGroupsIdMutationError = unknown;

export const useDeleteGroupsId = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteGroupsId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteGroupsId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteGroupsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Adiciona um membro ao grupo
 */
export const postGroupsIdMembers = (
  id: string,
  postGroupsIdMembersBody: PostGroupsIdMembersBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostGroupsIdMembers201>({
    url: `/groups/${id}/members`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postGroupsIdMembersBody,
    signal,
  });
};

export const getPostGroupsIdMembersMutationOptions = <
  TError =
    | PostGroupsIdMembers400
    | PostGroupsIdMembers401
    | PostGroupsIdMembers404
    | PostGroupsIdMembers500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postGroupsIdMembers>>,
    TError,
    { id: string; data: PostGroupsIdMembersBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postGroupsIdMembers>>,
  TError,
  { id: string; data: PostGroupsIdMembersBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postGroupsIdMembers>>,
    { id: string; data: PostGroupsIdMembersBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return postGroupsIdMembers(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostGroupsIdMembersMutationResult = NonNullable<
  Awaited<ReturnType<typeof postGroupsIdMembers>>
>;
export type PostGroupsIdMembersMutationBody = PostGroupsIdMembersBody;
export type PostGroupsIdMembersMutationError =
  | PostGroupsIdMembers400
  | PostGroupsIdMembers401
  | PostGroupsIdMembers404
  | PostGroupsIdMembers500;

export const usePostGroupsIdMembers = <
  TError =
    | PostGroupsIdMembers400
    | PostGroupsIdMembers401
    | PostGroupsIdMembers404
    | PostGroupsIdMembers500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postGroupsIdMembers>>,
    TError,
    { id: string; data: PostGroupsIdMembersBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postGroupsIdMembers>>,
  TError,
  { id: string; data: PostGroupsIdMembersBody },
  TContext
> => {
  const mutationOptions = getPostGroupsIdMembersMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove um membro do grupo
 */
export const deleteGroupsIdMembersMemberId = (id: string, memberId: string) => {
  return customInstance<DeleteGroupsIdMembersMemberId204>({
    url: `/groups/${id}/members/${memberId}`,
    method: "DELETE",
  });
};

export const getDeleteGroupsIdMembersMemberIdMutationOptions = <
  TError =
    | DeleteGroupsIdMembersMemberId401
    | DeleteGroupsIdMembersMemberId404
    | DeleteGroupsIdMembersMemberId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteGroupsIdMembersMemberId>>,
    TError,
    { id: string; memberId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteGroupsIdMembersMemberId>>,
  TError,
  { id: string; memberId: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteGroupsIdMembersMemberId>>,
    { id: string; memberId: string }
  > = (props) => {
    const { id, memberId } = props ?? {};

    return deleteGroupsIdMembersMemberId(id, memberId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteGroupsIdMembersMemberIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteGroupsIdMembersMemberId>>
>;

export type DeleteGroupsIdMembersMemberIdMutationError =
  | DeleteGroupsIdMembersMemberId401
  | DeleteGroupsIdMembersMemberId404
  | DeleteGroupsIdMembersMemberId500;

export const useDeleteGroupsIdMembersMemberId = <
  TError =
    | DeleteGroupsIdMembersMemberId401
    | DeleteGroupsIdMembersMemberId404
    | DeleteGroupsIdMembersMemberId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteGroupsIdMembersMemberId>>,
    TError,
    { id: string; memberId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteGroupsIdMembersMemberId>>,
  TError,
  { id: string; memberId: string },
  TContext
> => {
  const mutationOptions =
    getDeleteGroupsIdMembersMemberIdMutationOptions(options);

  return useMutation(mutationOptions);
};
