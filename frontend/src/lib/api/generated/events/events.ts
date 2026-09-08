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
  DeleteEventsEventIdParticipantsMemberId204,
  DeleteEventsEventIdParticipantsMemberId400,
  DeleteEventsEventIdParticipantsMemberId404,
  DeleteEventsId204,
  DeleteEventsId404,
  DeleteEventsId500,
  GetEvents200,
  GetEvents500,
  GetEventsId200,
  GetEventsId404,
  GetEventsId500,
  GetEventsParams,
  PatchEventsEventIdParticipantsMemberIdStatus200,
  PatchEventsEventIdParticipantsMemberIdStatus400,
  PatchEventsEventIdParticipantsMemberIdStatus404,
  PatchEventsEventIdParticipantsMemberIdStatusBody,
  PostEvents201,
  PostEvents400,
  PostEvents500,
  PostEventsBody,
  PostEventsEventIdParticipants201,
  PostEventsEventIdParticipants400,
  PostEventsEventIdParticipants404,
  PostEventsEventIdParticipantsBody,
  PutEventsId200,
  PutEventsId400,
  PutEventsId404,
  PutEventsId500,
  PutEventsIdBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Lista eventos com paginação e filtros
 */
export const getEvents = (params?: GetEventsParams, signal?: AbortSignal) => {
  return customInstance<GetEvents200>({
    url: `/events`,
    method: "GET",
    params,
    signal,
  });
};

export const getGetEventsQueryKey = (params?: GetEventsParams) => {
  return [`/events`, ...(params ? [params] : [])] as const;
};

export const getGetEventsInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getEvents>>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEvents>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEventsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEvents>>> = ({
    signal,
  }) => getEvents(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getEvents>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetEventsInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEvents>>
>;
export type GetEventsInfiniteQueryError = GetEvents500;

export function useGetEventsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEvents>>>,
  TError = GetEvents500,
>(
  params: undefined | GetEventsParams,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEvents>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEvents>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetEventsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEvents>>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEvents>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEvents>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetEventsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEvents>>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEvents>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetEventsInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEvents>>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEvents>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetEventsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetEventsQueryOptions = <
  TData = Awaited<ReturnType<typeof getEvents>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEvents>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEventsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEvents>>> = ({
    signal,
  }) => getEvents(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getEvents>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetEventsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEvents>>
>;
export type GetEventsQueryError = GetEvents500;

export function useGetEvents<
  TData = Awaited<ReturnType<typeof getEvents>>,
  TError = GetEvents500,
>(
  params: undefined | GetEventsParams,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEvents>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEvents>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetEvents<
  TData = Awaited<ReturnType<typeof getEvents>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEvents>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEvents>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetEvents<
  TData = Awaited<ReturnType<typeof getEvents>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEvents>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetEvents<
  TData = Awaited<ReturnType<typeof getEvents>>,
  TError = GetEvents500,
>(
  params?: GetEventsParams,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEvents>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetEventsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Cria um novo evento
 */
export const postEvents = (
  postEventsBody: PostEventsBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostEvents201>({
    url: `/events`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postEventsBody,
    signal,
  });
};

export const getPostEventsMutationOptions = <
  TError = PostEvents400 | PostEvents500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEvents>>,
    TError,
    { data: PostEventsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postEvents>>,
  TError,
  { data: PostEventsBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postEvents>>,
    { data: PostEventsBody }
  > = (props) => {
    const { data } = props ?? {};

    return postEvents(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostEventsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postEvents>>
>;
export type PostEventsMutationBody = PostEventsBody;
export type PostEventsMutationError = PostEvents400 | PostEvents500;

export const usePostEvents = <
  TError = PostEvents400 | PostEvents500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEvents>>,
    TError,
    { data: PostEventsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postEvents>>,
  TError,
  { data: PostEventsBody },
  TContext
> => {
  const mutationOptions = getPostEventsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Obtém um evento por ID
 */
export const getEventsId = (id: string, signal?: AbortSignal) => {
  return customInstance<GetEventsId200>({
    url: `/events/${id}`,
    method: "GET",
    signal,
  });
};

export const getGetEventsIdQueryKey = (id: string) => {
  return [`/events/${id}`] as const;
};

export const getGetEventsIdInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getEventsId>>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEventsId>>,
        TError,
        TData
      >
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEventsIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEventsId>>> = ({
    signal,
  }) => getEventsId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getEventsId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetEventsIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEventsId>>
>;
export type GetEventsIdInfiniteQueryError = GetEventsId404 | GetEventsId500;

export function useGetEventsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEventsId>>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options: {
    query: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEventsId>>,
        TError,
        TData
      >
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetEventsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEventsId>>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEventsId>>,
        TError,
        TData
      >
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetEventsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEventsId>>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEventsId>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetEventsIdInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getEventsId>>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseInfiniteQueryOptions<
        Awaited<ReturnType<typeof getEventsId>>,
        TError,
        TData
      >
    >;
  },
): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetEventsIdInfiniteQueryOptions(id, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetEventsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getEventsId>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEventsId>>, TError, TData>
    >;
  },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetEventsIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getEventsId>>> = ({
    signal,
  }) => getEventsId(id, signal);

  return {
    queryKey,
    queryFn,
    enabled: !!id,
    ...queryOptions,
  } as UseQueryOptions<
    Awaited<ReturnType<typeof getEventsId>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetEventsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getEventsId>>
>;
export type GetEventsIdQueryError = GetEventsId404 | GetEventsId500;

export function useGetEventsId<
  TData = Awaited<ReturnType<typeof getEventsId>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options: {
    query: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEventsId>>, TError, TData>
    > &
      Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetEventsId<
  TData = Awaited<ReturnType<typeof getEventsId>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEventsId>>, TError, TData>
    > &
      Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getEventsId>>,
          TError,
          TData
        >,
        "initialData"
      >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetEventsId<
  TData = Awaited<ReturnType<typeof getEventsId>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEventsId>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetEventsId<
  TData = Awaited<ReturnType<typeof getEventsId>>,
  TError = GetEventsId404 | GetEventsId500,
>(
  id: string,
  options?: {
    query?: Partial<
      UseQueryOptions<Awaited<ReturnType<typeof getEventsId>>, TError, TData>
    >;
  },
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetEventsIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza um evento
 */
export const putEventsId = (id: string, putEventsIdBody: PutEventsIdBody) => {
  return customInstance<PutEventsId200>({
    url: `/events/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putEventsIdBody,
  });
};

export const getPutEventsIdMutationOptions = <
  TError = PutEventsId400 | PutEventsId404 | PutEventsId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putEventsId>>,
    TError,
    { id: string; data: PutEventsIdBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putEventsId>>,
  TError,
  { id: string; data: PutEventsIdBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putEventsId>>,
    { id: string; data: PutEventsIdBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return putEventsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutEventsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putEventsId>>
>;
export type PutEventsIdMutationBody = PutEventsIdBody;
export type PutEventsIdMutationError =
  | PutEventsId400
  | PutEventsId404
  | PutEventsId500;

export const usePutEventsId = <
  TError = PutEventsId400 | PutEventsId404 | PutEventsId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putEventsId>>,
    TError,
    { id: string; data: PutEventsIdBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putEventsId>>,
  TError,
  { id: string; data: PutEventsIdBody },
  TContext
> => {
  const mutationOptions = getPutEventsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove um evento
 */
export const deleteEventsId = (id: string) => {
  return customInstance<DeleteEventsId204>({
    url: `/events/${id}`,
    method: "DELETE",
  });
};

export const getDeleteEventsIdMutationOptions = <
  TError = DeleteEventsId404 | DeleteEventsId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteEventsId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteEventsId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteEventsId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteEventsId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteEventsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteEventsId>>
>;

export type DeleteEventsIdMutationError = DeleteEventsId404 | DeleteEventsId500;

export const useDeleteEventsId = <
  TError = DeleteEventsId404 | DeleteEventsId500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteEventsId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteEventsId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteEventsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Atualiza o status de um participante no evento
 */
export const patchEventsEventIdParticipantsMemberIdStatus = (
  eventId: string,
  memberId: string,
  patchEventsEventIdParticipantsMemberIdStatusBody: PatchEventsEventIdParticipantsMemberIdStatusBody,
) => {
  return customInstance<PatchEventsEventIdParticipantsMemberIdStatus200>({
    url: `/events/${eventId}/participants/${memberId}/status`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchEventsEventIdParticipantsMemberIdStatusBody,
  });
};

export const getPatchEventsEventIdParticipantsMemberIdStatusMutationOptions = <
  TError =
    | PatchEventsEventIdParticipantsMemberIdStatus400
    | PatchEventsEventIdParticipantsMemberIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchEventsEventIdParticipantsMemberIdStatus>>,
    TError,
    {
      eventId: string;
      memberId: string;
      data: PatchEventsEventIdParticipantsMemberIdStatusBody;
    },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchEventsEventIdParticipantsMemberIdStatus>>,
  TError,
  {
    eventId: string;
    memberId: string;
    data: PatchEventsEventIdParticipantsMemberIdStatusBody;
  },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchEventsEventIdParticipantsMemberIdStatus>>,
    {
      eventId: string;
      memberId: string;
      data: PatchEventsEventIdParticipantsMemberIdStatusBody;
    }
  > = (props) => {
    const { eventId, memberId, data } = props ?? {};

    return patchEventsEventIdParticipantsMemberIdStatus(
      eventId,
      memberId,
      data,
    );
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchEventsEventIdParticipantsMemberIdStatusMutationResult =
  NonNullable<
    Awaited<ReturnType<typeof patchEventsEventIdParticipantsMemberIdStatus>>
  >;
export type PatchEventsEventIdParticipantsMemberIdStatusMutationBody =
  PatchEventsEventIdParticipantsMemberIdStatusBody;
export type PatchEventsEventIdParticipantsMemberIdStatusMutationError =
  | PatchEventsEventIdParticipantsMemberIdStatus400
  | PatchEventsEventIdParticipantsMemberIdStatus404;

export const usePatchEventsEventIdParticipantsMemberIdStatus = <
  TError =
    | PatchEventsEventIdParticipantsMemberIdStatus400
    | PatchEventsEventIdParticipantsMemberIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchEventsEventIdParticipantsMemberIdStatus>>,
    TError,
    {
      eventId: string;
      memberId: string;
      data: PatchEventsEventIdParticipantsMemberIdStatusBody;
    },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchEventsEventIdParticipantsMemberIdStatus>>,
  TError,
  {
    eventId: string;
    memberId: string;
    data: PatchEventsEventIdParticipantsMemberIdStatusBody;
  },
  TContext
> => {
  const mutationOptions =
    getPatchEventsEventIdParticipantsMemberIdStatusMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Adiciona um participante ao evento
 */
export const postEventsEventIdParticipants = (
  eventId: string,
  postEventsEventIdParticipantsBody: PostEventsEventIdParticipantsBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostEventsEventIdParticipants201>({
    url: `/events/${eventId}/participants`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postEventsEventIdParticipantsBody,
    signal,
  });
};

export const getPostEventsEventIdParticipantsMutationOptions = <
  TError = PostEventsEventIdParticipants400 | PostEventsEventIdParticipants404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEventsEventIdParticipants>>,
    TError,
    { eventId: string; data: PostEventsEventIdParticipantsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postEventsEventIdParticipants>>,
  TError,
  { eventId: string; data: PostEventsEventIdParticipantsBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postEventsEventIdParticipants>>,
    { eventId: string; data: PostEventsEventIdParticipantsBody }
  > = (props) => {
    const { eventId, data } = props ?? {};

    return postEventsEventIdParticipants(eventId, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostEventsEventIdParticipantsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postEventsEventIdParticipants>>
>;
export type PostEventsEventIdParticipantsMutationBody =
  PostEventsEventIdParticipantsBody;
export type PostEventsEventIdParticipantsMutationError =
  | PostEventsEventIdParticipants400
  | PostEventsEventIdParticipants404;

export const usePostEventsEventIdParticipants = <
  TError = PostEventsEventIdParticipants400 | PostEventsEventIdParticipants404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postEventsEventIdParticipants>>,
    TError,
    { eventId: string; data: PostEventsEventIdParticipantsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postEventsEventIdParticipants>>,
  TError,
  { eventId: string; data: PostEventsEventIdParticipantsBody },
  TContext
> => {
  const mutationOptions =
    getPostEventsEventIdParticipantsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove um participante do evento
 */
export const deleteEventsEventIdParticipantsMemberId = (
  eventId: string,
  memberId: string,
) => {
  return customInstance<DeleteEventsEventIdParticipantsMemberId204>({
    url: `/events/${eventId}/participants/${memberId}`,
    method: "DELETE",
  });
};

export const getDeleteEventsEventIdParticipantsMemberIdMutationOptions = <
  TError =
    | DeleteEventsEventIdParticipantsMemberId400
    | DeleteEventsEventIdParticipantsMemberId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteEventsEventIdParticipantsMemberId>>,
    TError,
    { eventId: string; memberId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteEventsEventIdParticipantsMemberId>>,
  TError,
  { eventId: string; memberId: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteEventsEventIdParticipantsMemberId>>,
    { eventId: string; memberId: string }
  > = (props) => {
    const { eventId, memberId } = props ?? {};

    return deleteEventsEventIdParticipantsMemberId(eventId, memberId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteEventsEventIdParticipantsMemberIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteEventsEventIdParticipantsMemberId>>
>;

export type DeleteEventsEventIdParticipantsMemberIdMutationError =
  | DeleteEventsEventIdParticipantsMemberId400
  | DeleteEventsEventIdParticipantsMemberId404;

export const useDeleteEventsEventIdParticipantsMemberId = <
  TError =
    | DeleteEventsEventIdParticipantsMemberId400
    | DeleteEventsEventIdParticipantsMemberId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteEventsEventIdParticipantsMemberId>>,
    TError,
    { eventId: string; memberId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteEventsEventIdParticipantsMemberId>>,
  TError,
  { eventId: string; memberId: string },
  TContext
> => {
  const mutationOptions =
    getDeleteEventsEventIdParticipantsMemberIdMutationOptions(options);

  return useMutation(mutationOptions);
};
