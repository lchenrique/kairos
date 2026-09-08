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
  DeleteAuthInvitesId204,
  DeleteAuthInvitesId401,
  DeleteAuthInvitesId403,
  DeleteAuthInvitesId404,
  DeleteAuthUsersId204,
  DeleteAuthUsersId400,
  DeleteAuthUsersId401,
  DeleteAuthUsersId403,
  DeleteAuthUsersId404,
  GetAuthInvites200Item,
  GetAuthInvites401,
  GetAuthInvites403,
  GetAuthProfile200,
  GetAuthProfile401,
  GetAuthProfile500,
  GetAuthSetupStatus200,
  GetAuthUsers200Item,
  GetAuthUsers401,
  GetAuthUsers403,
  PatchAuthUsersIdRole200,
  PatchAuthUsersIdRole400,
  PatchAuthUsersIdRole401,
  PatchAuthUsersIdRole403,
  PatchAuthUsersIdRole404,
  PatchAuthUsersIdRoleBody,
  PatchAuthUsersIdStatus200,
  PatchAuthUsersIdStatus400,
  PatchAuthUsersIdStatus401,
  PatchAuthUsersIdStatus403,
  PatchAuthUsersIdStatus404,
  PatchAuthUsersIdStatusBody,
  PostAuthInvites201,
  PostAuthInvites400,
  PostAuthInvites401,
  PostAuthInvites403,
  PostAuthInvites503,
  PostAuthInvitesAccept201,
  PostAuthInvitesAccept400,
  PostAuthInvitesAcceptBody,
  PostAuthInvitesBody,
  PostAuthLogin200,
  PostAuthLogin401,
  PostAuthLogin500,
  PostAuthLoginBody,
  PostAuthLogout204,
  PostAuthLogout401,
  PostAuthPasswordReset204,
  PostAuthPasswordReset400,
  PostAuthPasswordResetBody,
  PostAuthPasswordResetRequest204,
  PostAuthPasswordResetRequestBody,
  PostAuthSetup201,
  PostAuthSetup409,
  PostAuthSetupBody,
  PutAuthPasswordChange204,
  PutAuthPasswordChange401,
  PutAuthPasswordChangeBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Informa se a configuração inicial está disponível
 */
export const getAuthSetupStatus = (signal?: AbortSignal) => {
  return customInstance<GetAuthSetupStatus200>({
    url: `/auth/setup/status`,
    method: "GET",
    signal,
  });
};

export const getGetAuthSetupStatusQueryKey = () => {
  return [`/auth/setup/status`] as const;
};

export const getGetAuthSetupStatusInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthSetupStatus>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthSetupStatusQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAuthSetupStatus>>
  > = ({ signal }) => getAuthSetupStatus(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getAuthSetupStatus>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthSetupStatusInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthSetupStatus>>
>;
export type GetAuthSetupStatusInfiniteQueryError = unknown;

export function useGetAuthSetupStatusInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthSetupStatus>>>,
  TError = unknown,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthSetupStatus>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthSetupStatusInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthSetupStatus>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthSetupStatus>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthSetupStatusInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthSetupStatus>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetAuthSetupStatusInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthSetupStatus>>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetAuthSetupStatusInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetAuthSetupStatusQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthSetupStatus>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthSetupStatusQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getAuthSetupStatus>>
  > = ({ signal }) => getAuthSetupStatus(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAuthSetupStatus>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthSetupStatusQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthSetupStatus>>
>;
export type GetAuthSetupStatusQueryError = unknown;

export function useGetAuthSetupStatus<
  TData = Awaited<ReturnType<typeof getAuthSetupStatus>>,
  TError = unknown,
>(options: {
  query: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthSetupStatus>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthSetupStatus<
  TData = Awaited<ReturnType<typeof getAuthSetupStatus>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthSetupStatus>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetAuthSetupStatus<
  TData = Awaited<ReturnType<typeof getAuthSetupStatus>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetAuthSetupStatus<
  TData = Awaited<ReturnType<typeof getAuthSetupStatus>>,
  TError = unknown,
>(options?: {
  query?: Partial<
    UseQueryOptions<
      Awaited<ReturnType<typeof getAuthSetupStatus>>,
      TError,
      TData
    >
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetAuthSetupStatusQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Cria a primeira Rede, igreja sede e conta administradora
 */
export const postAuthSetup = (
  postAuthSetupBody: PostAuthSetupBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthSetup201>({
    url: `/auth/setup`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthSetupBody,
    signal,
  });
};

export const getPostAuthSetupMutationOptions = <
  TError = PostAuthSetup409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthSetup>>,
    TError,
    { data: PostAuthSetupBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthSetup>>,
  TError,
  { data: PostAuthSetupBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthSetup>>,
    { data: PostAuthSetupBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthSetup(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthSetupMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthSetup>>
>;
export type PostAuthSetupMutationBody = PostAuthSetupBody;
export type PostAuthSetupMutationError = PostAuthSetup409;

export const usePostAuthSetup = <
  TError = PostAuthSetup409,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthSetup>>,
    TError,
    { data: PostAuthSetupBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthSetup>>,
  TError,
  { data: PostAuthSetupBody },
  TContext
> => {
  const mutationOptions = getPostAuthSetupMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Lista o histórico de convites da Rede
 */
export const getAuthInvites = (signal?: AbortSignal) => {
  return customInstance<GetAuthInvites200Item[]>({
    url: `/auth/invites`,
    method: "GET",
    signal,
  });
};

export const getGetAuthInvitesQueryKey = () => {
  return [`/auth/invites`] as const;
};

export const getGetAuthInvitesInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthInvites>>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthInvites>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthInvitesQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthInvites>>> = ({
    signal,
  }) => getAuthInvites(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getAuthInvites>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthInvitesInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthInvites>>
>;
export type GetAuthInvitesInfiniteQueryError =
  | GetAuthInvites401
  | GetAuthInvites403;

export function useGetAuthInvitesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthInvites>>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthInvites>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthInvites>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthInvitesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthInvites>>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthInvites>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthInvites>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthInvitesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthInvites>>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthInvites>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetAuthInvitesInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthInvites>>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthInvites>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetAuthInvitesInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetAuthInvitesQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthInvites>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthInvites>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthInvitesQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthInvites>>> = ({
    signal,
  }) => getAuthInvites(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAuthInvites>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthInvitesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthInvites>>
>;
export type GetAuthInvitesQueryError = GetAuthInvites401 | GetAuthInvites403;

export function useGetAuthInvites<
  TData = Awaited<ReturnType<typeof getAuthInvites>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthInvites>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthInvites>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthInvites<
  TData = Awaited<ReturnType<typeof getAuthInvites>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthInvites>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthInvites>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetAuthInvites<
  TData = Awaited<ReturnType<typeof getAuthInvites>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthInvites>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetAuthInvites<
  TData = Awaited<ReturnType<typeof getAuthInvites>>,
  TError = GetAuthInvites401 | GetAuthInvites403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthInvites>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetAuthInvitesQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Convida uma pessoa para definir a própria senha e entrar na equipe
 */
export const postAuthInvites = (
  postAuthInvitesBody: PostAuthInvitesBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthInvites201>({
    url: `/auth/invites`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthInvitesBody,
    signal,
  });
};

export const getPostAuthInvitesMutationOptions = <
  TError =
    | PostAuthInvites400
    | PostAuthInvites401
    | PostAuthInvites403
    | PostAuthInvites503,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthInvites>>,
    TError,
    { data: PostAuthInvitesBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthInvites>>,
  TError,
  { data: PostAuthInvitesBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthInvites>>,
    { data: PostAuthInvitesBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthInvites(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthInvitesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthInvites>>
>;
export type PostAuthInvitesMutationBody = PostAuthInvitesBody;
export type PostAuthInvitesMutationError =
  | PostAuthInvites400
  | PostAuthInvites401
  | PostAuthInvites403
  | PostAuthInvites503;

export const usePostAuthInvites = <
  TError =
    | PostAuthInvites400
    | PostAuthInvites401
    | PostAuthInvites403
    | PostAuthInvites503,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthInvites>>,
    TError,
    { data: PostAuthInvitesBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthInvites>>,
  TError,
  { data: PostAuthInvitesBody },
  TContext
> => {
  const mutationOptions = getPostAuthInvitesMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Aceita um convite válido e define a senha da nova conta
 */
export const postAuthInvitesAccept = (
  postAuthInvitesAcceptBody: PostAuthInvitesAcceptBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthInvitesAccept201>({
    url: `/auth/invites/accept`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthInvitesAcceptBody,
    signal,
  });
};

export const getPostAuthInvitesAcceptMutationOptions = <
  TError = PostAuthInvitesAccept400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthInvitesAccept>>,
    TError,
    { data: PostAuthInvitesAcceptBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthInvitesAccept>>,
  TError,
  { data: PostAuthInvitesAcceptBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthInvitesAccept>>,
    { data: PostAuthInvitesAcceptBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthInvitesAccept(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthInvitesAcceptMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthInvitesAccept>>
>;
export type PostAuthInvitesAcceptMutationBody = PostAuthInvitesAcceptBody;
export type PostAuthInvitesAcceptMutationError = PostAuthInvitesAccept400;

export const usePostAuthInvitesAccept = <
  TError = PostAuthInvitesAccept400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthInvitesAccept>>,
    TError,
    { data: PostAuthInvitesAcceptBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthInvitesAccept>>,
  TError,
  { data: PostAuthInvitesAcceptBody },
  TContext
> => {
  const mutationOptions = getPostAuthInvitesAcceptMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Revoga um convite pendente
 */
export const deleteAuthInvitesId = (id: string) => {
  return customInstance<DeleteAuthInvitesId204>({
    url: `/auth/invites/${id}`,
    method: "DELETE",
  });
};

export const getDeleteAuthInvitesIdMutationOptions = <
  TError =
    | DeleteAuthInvitesId401
    | DeleteAuthInvitesId403
    | DeleteAuthInvitesId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAuthInvitesId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteAuthInvitesId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteAuthInvitesId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteAuthInvitesId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteAuthInvitesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteAuthInvitesId>>
>;

export type DeleteAuthInvitesIdMutationError =
  | DeleteAuthInvitesId401
  | DeleteAuthInvitesId403
  | DeleteAuthInvitesId404;

export const useDeleteAuthInvitesId = <
  TError =
    | DeleteAuthInvitesId401
    | DeleteAuthInvitesId403
    | DeleteAuthInvitesId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAuthInvitesId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteAuthInvitesId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteAuthInvitesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Autentica um usuário
 */
export const postAuthLogin = (
  postAuthLoginBody: PostAuthLoginBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthLogin200>({
    url: `/auth/login`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthLoginBody,
    signal,
  });
};

export const getPostAuthLoginMutationOptions = <
  TError = PostAuthLogin401 | PostAuthLogin500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogin>>,
    TError,
    { data: PostAuthLoginBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthLogin>>,
  TError,
  { data: PostAuthLoginBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthLogin>>,
    { data: PostAuthLoginBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthLogin(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthLoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthLogin>>
>;
export type PostAuthLoginMutationBody = PostAuthLoginBody;
export type PostAuthLoginMutationError = PostAuthLogin401 | PostAuthLogin500;

export const usePostAuthLogin = <
  TError = PostAuthLogin401 | PostAuthLogin500,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogin>>,
    TError,
    { data: PostAuthLoginBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthLogin>>,
  TError,
  { data: PostAuthLoginBody },
  TContext
> => {
  const mutationOptions = getPostAuthLoginMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Encerra todas as sessões atuais do usuário
 */
export const postAuthLogout = (signal?: AbortSignal) => {
  return customInstance<PostAuthLogout204>({
    url: `/auth/logout`,
    method: "POST",
    signal,
  });
};

export const getPostAuthLogoutMutationOptions = <
  TError = PostAuthLogout401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogout>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthLogout>>,
  TError,
  void,
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthLogout>>,
    void
  > = () => {
    return postAuthLogout();
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthLogoutMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthLogout>>
>;

export type PostAuthLogoutMutationError = PostAuthLogout401;

export const usePostAuthLogout = <
  TError = PostAuthLogout401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthLogout>>,
    TError,
    void,
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthLogout>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getPostAuthLogoutMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Obtém o perfil do usuário autenticado
 */
export const getAuthProfile = (signal?: AbortSignal) => {
  return customInstance<GetAuthProfile200>({
    url: `/auth/profile`,
    method: "GET",
    signal,
  });
};

export const getGetAuthProfileQueryKey = () => {
  return [`/auth/profile`] as const;
};

export const getGetAuthProfileInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthProfile>>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthProfile>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthProfileQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthProfile>>> = ({
    signal,
  }) => getAuthProfile(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getAuthProfile>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthProfileInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthProfile>>
>;
export type GetAuthProfileInfiniteQueryError =
  | GetAuthProfile401
  | GetAuthProfile500;

export function useGetAuthProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthProfile>>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthProfile>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthProfile>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthProfile>>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthProfile>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthProfile>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthProfile>>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthProfile>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetAuthProfileInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthProfile>>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthProfile>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetAuthProfileInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetAuthProfileQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthProfile>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthProfile>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthProfileQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthProfile>>> = ({
    signal,
  }) => getAuthProfile(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAuthProfile>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthProfileQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthProfile>>
>;
export type GetAuthProfileQueryError = GetAuthProfile401 | GetAuthProfile500;

export function useGetAuthProfile<
  TData = Awaited<ReturnType<typeof getAuthProfile>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthProfile>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthProfile>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthProfile<
  TData = Awaited<ReturnType<typeof getAuthProfile>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthProfile>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthProfile>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetAuthProfile<
  TData = Awaited<ReturnType<typeof getAuthProfile>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthProfile>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetAuthProfile<
  TData = Awaited<ReturnType<typeof getAuthProfile>>,
  TError = GetAuthProfile401 | GetAuthProfile500,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthProfile>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetAuthProfileQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Altera a senha do usuário autenticado
 */
export const putAuthPasswordChange = (
  putAuthPasswordChangeBody: PutAuthPasswordChangeBody,
) => {
  return customInstance<PutAuthPasswordChange204>({
    url: `/auth/password/change`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data: putAuthPasswordChangeBody,
  });
};

export const getPutAuthPasswordChangeMutationOptions = <
  TError = PutAuthPasswordChange401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putAuthPasswordChange>>,
    TError,
    { data: PutAuthPasswordChangeBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putAuthPasswordChange>>,
  TError,
  { data: PutAuthPasswordChangeBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putAuthPasswordChange>>,
    { data: PutAuthPasswordChangeBody }
  > = (props) => {
    const { data } = props ?? {};

    return putAuthPasswordChange(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutAuthPasswordChangeMutationResult = NonNullable<
  Awaited<ReturnType<typeof putAuthPasswordChange>>
>;
export type PutAuthPasswordChangeMutationBody = PutAuthPasswordChangeBody;
export type PutAuthPasswordChangeMutationError = PutAuthPasswordChange401;

export const usePutAuthPasswordChange = <
  TError = PutAuthPasswordChange401,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putAuthPasswordChange>>,
    TError,
    { data: PutAuthPasswordChangeBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof putAuthPasswordChange>>,
  TError,
  { data: PutAuthPasswordChangeBody },
  TContext
> => {
  const mutationOptions = getPutAuthPasswordChangeMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Solicita uma redefinição de senha sem revelar se a conta existe
 */
export const postAuthPasswordResetRequest = (
  postAuthPasswordResetRequestBody: PostAuthPasswordResetRequestBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthPasswordResetRequest204>({
    url: `/auth/password/reset-request`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthPasswordResetRequestBody,
    signal,
  });
};

export const getPostAuthPasswordResetRequestMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthPasswordResetRequest>>,
    TError,
    { data: PostAuthPasswordResetRequestBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthPasswordResetRequest>>,
  TError,
  { data: PostAuthPasswordResetRequestBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthPasswordResetRequest>>,
    { data: PostAuthPasswordResetRequestBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthPasswordResetRequest(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthPasswordResetRequestMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthPasswordResetRequest>>
>;
export type PostAuthPasswordResetRequestMutationBody =
  PostAuthPasswordResetRequestBody;
export type PostAuthPasswordResetRequestMutationError = unknown;

export const usePostAuthPasswordResetRequest = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthPasswordResetRequest>>,
    TError,
    { data: PostAuthPasswordResetRequestBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthPasswordResetRequest>>,
  TError,
  { data: PostAuthPasswordResetRequestBody },
  TContext
> => {
  const mutationOptions =
    getPostAuthPasswordResetRequestMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Redefine a senha com um token de uso único e expirável
 */
export const postAuthPasswordReset = (
  postAuthPasswordResetBody: PostAuthPasswordResetBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthPasswordReset204>({
    url: `/auth/password/reset`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthPasswordResetBody,
    signal,
  });
};

export const getPostAuthPasswordResetMutationOptions = <
  TError = PostAuthPasswordReset400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthPasswordReset>>,
    TError,
    { data: PostAuthPasswordResetBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthPasswordReset>>,
  TError,
  { data: PostAuthPasswordResetBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthPasswordReset>>,
    { data: PostAuthPasswordResetBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthPasswordReset(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthPasswordResetMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthPasswordReset>>
>;
export type PostAuthPasswordResetMutationBody = PostAuthPasswordResetBody;
export type PostAuthPasswordResetMutationError = PostAuthPasswordReset400;

export const usePostAuthPasswordReset = <
  TError = PostAuthPasswordReset400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthPasswordReset>>,
    TError,
    { data: PostAuthPasswordResetBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthPasswordReset>>,
  TError,
  { data: PostAuthPasswordResetBody },
  TContext
> => {
  const mutationOptions = getPostAuthPasswordResetMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Lista usuários da equipe
 */
export const getAuthUsers = (signal?: AbortSignal) => {
  return customInstance<GetAuthUsers200Item[]>({
    url: `/auth/users`,
    method: "GET",
    signal,
  });
};

export const getGetAuthUsersQueryKey = () => {
  return [`/auth/users`] as const;
};

export const getGetAuthUsersInfiniteQueryOptions = <
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthUsers>>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthUsers>>,
      TError,
      TData
    >
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthUsersQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthUsers>>> = ({
    signal,
  }) => getAuthUsers(signal);

  return { queryKey, queryFn, ...queryOptions } as UseInfiniteQueryOptions<
    Awaited<ReturnType<typeof getAuthUsers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthUsersInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthUsers>>
>;
export type GetAuthUsersInfiniteQueryError = GetAuthUsers401 | GetAuthUsers403;

export function useGetAuthUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthUsers>>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options: {
  query: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthUsers>>,
      TError,
      TData
    >
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthUsers>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthUsers>>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthUsers>>,
      TError,
      TData
    >
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthUsers>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthUsers>>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthUsers>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};

export function useGetAuthUsersInfinite<
  TData = InfiniteData<Awaited<ReturnType<typeof getAuthUsers>>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseInfiniteQueryOptions<
      Awaited<ReturnType<typeof getAuthUsers>>,
      TError,
      TData
    >
  >;
}): UseInfiniteQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
} {
  const queryOptions = getGetAuthUsersInfiniteQueryOptions(options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<
    TData,
    TError
  > & { queryKey: DataTag<QueryKey, TData> };

  query.queryKey = queryOptions.queryKey;

  return query;
}

export const getGetAuthUsersQueryOptions = <
  TData = Awaited<ReturnType<typeof getAuthUsers>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthUsers>>, TError, TData>
  >;
}) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAuthUsersQueryKey();

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAuthUsers>>> = ({
    signal,
  }) => getAuthUsers(signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getAuthUsers>>,
    TError,
    TData
  > & { queryKey: DataTag<QueryKey, TData> };
};

export type GetAuthUsersQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAuthUsers>>
>;
export type GetAuthUsersQueryError = GetAuthUsers401 | GetAuthUsers403;

export function useGetAuthUsers<
  TData = Awaited<ReturnType<typeof getAuthUsers>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options: {
  query: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthUsers>>, TError, TData>
  > &
    Pick<
      DefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthUsers>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): DefinedUseQueryResult<TData, TError> & {
  queryKey: DataTag<QueryKey, TData>;
};
export function useGetAuthUsers<
  TData = Awaited<ReturnType<typeof getAuthUsers>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthUsers>>, TError, TData>
  > &
    Pick<
      UndefinedInitialDataOptions<
        Awaited<ReturnType<typeof getAuthUsers>>,
        TError,
        TData
      >,
      "initialData"
    >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };
export function useGetAuthUsers<
  TData = Awaited<ReturnType<typeof getAuthUsers>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthUsers>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> };

export function useGetAuthUsers<
  TData = Awaited<ReturnType<typeof getAuthUsers>>,
  TError = GetAuthUsers401 | GetAuthUsers403,
>(options?: {
  query?: Partial<
    UseQueryOptions<Awaited<ReturnType<typeof getAuthUsers>>, TError, TData>
  >;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData> } {
  const queryOptions = getGetAuthUsersQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData>;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
}

/**
 * Atualiza o perfil de acesso de um usuário
 */
export const patchAuthUsersIdRole = (
  id: string,
  patchAuthUsersIdRoleBody: PatchAuthUsersIdRoleBody,
) => {
  return customInstance<PatchAuthUsersIdRole200>({
    url: `/auth/users/${id}/role`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchAuthUsersIdRoleBody,
  });
};

export const getPatchAuthUsersIdRoleMutationOptions = <
  TError =
    | PatchAuthUsersIdRole400
    | PatchAuthUsersIdRole401
    | PatchAuthUsersIdRole403
    | PatchAuthUsersIdRole404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchAuthUsersIdRole>>,
    TError,
    { id: string; data: PatchAuthUsersIdRoleBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchAuthUsersIdRole>>,
  TError,
  { id: string; data: PatchAuthUsersIdRoleBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchAuthUsersIdRole>>,
    { id: string; data: PatchAuthUsersIdRoleBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchAuthUsersIdRole(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchAuthUsersIdRoleMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchAuthUsersIdRole>>
>;
export type PatchAuthUsersIdRoleMutationBody = PatchAuthUsersIdRoleBody;
export type PatchAuthUsersIdRoleMutationError =
  | PatchAuthUsersIdRole400
  | PatchAuthUsersIdRole401
  | PatchAuthUsersIdRole403
  | PatchAuthUsersIdRole404;

export const usePatchAuthUsersIdRole = <
  TError =
    | PatchAuthUsersIdRole400
    | PatchAuthUsersIdRole401
    | PatchAuthUsersIdRole403
    | PatchAuthUsersIdRole404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchAuthUsersIdRole>>,
    TError,
    { id: string; data: PatchAuthUsersIdRoleBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchAuthUsersIdRole>>,
  TError,
  { id: string; data: PatchAuthUsersIdRoleBody },
  TContext
> => {
  const mutationOptions = getPatchAuthUsersIdRoleMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Suspende ou reativa o acesso de uma pessoa à Rede
 */
export const patchAuthUsersIdStatus = (
  id: string,
  patchAuthUsersIdStatusBody: PatchAuthUsersIdStatusBody,
) => {
  return customInstance<PatchAuthUsersIdStatus200>({
    url: `/auth/users/${id}/status`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    data: patchAuthUsersIdStatusBody,
  });
};

export const getPatchAuthUsersIdStatusMutationOptions = <
  TError =
    | PatchAuthUsersIdStatus400
    | PatchAuthUsersIdStatus401
    | PatchAuthUsersIdStatus403
    | PatchAuthUsersIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchAuthUsersIdStatus>>,
    TError,
    { id: string; data: PatchAuthUsersIdStatusBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof patchAuthUsersIdStatus>>,
  TError,
  { id: string; data: PatchAuthUsersIdStatusBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof patchAuthUsersIdStatus>>,
    { id: string; data: PatchAuthUsersIdStatusBody }
  > = (props) => {
    const { id, data } = props ?? {};

    return patchAuthUsersIdStatus(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PatchAuthUsersIdStatusMutationResult = NonNullable<
  Awaited<ReturnType<typeof patchAuthUsersIdStatus>>
>;
export type PatchAuthUsersIdStatusMutationBody = PatchAuthUsersIdStatusBody;
export type PatchAuthUsersIdStatusMutationError =
  | PatchAuthUsersIdStatus400
  | PatchAuthUsersIdStatus401
  | PatchAuthUsersIdStatus403
  | PatchAuthUsersIdStatus404;

export const usePatchAuthUsersIdStatus = <
  TError =
    | PatchAuthUsersIdStatus400
    | PatchAuthUsersIdStatus401
    | PatchAuthUsersIdStatus403
    | PatchAuthUsersIdStatus404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof patchAuthUsersIdStatus>>,
    TError,
    { id: string; data: PatchAuthUsersIdStatusBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof patchAuthUsersIdStatus>>,
  TError,
  { id: string; data: PatchAuthUsersIdStatusBody },
  TContext
> => {
  const mutationOptions = getPatchAuthUsersIdStatusMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Revoga permanentemente o acesso de uma pessoa à Rede
 */
export const deleteAuthUsersId = (id: string) => {
  return customInstance<DeleteAuthUsersId204>({
    url: `/auth/users/${id}`,
    method: "DELETE",
  });
};

export const getDeleteAuthUsersIdMutationOptions = <
  TError =
    | DeleteAuthUsersId400
    | DeleteAuthUsersId401
    | DeleteAuthUsersId403
    | DeleteAuthUsersId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAuthUsersId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteAuthUsersId>>,
  TError,
  { id: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteAuthUsersId>>,
    { id: string }
  > = (props) => {
    const { id } = props ?? {};

    return deleteAuthUsersId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteAuthUsersIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteAuthUsersId>>
>;

export type DeleteAuthUsersIdMutationError =
  | DeleteAuthUsersId400
  | DeleteAuthUsersId401
  | DeleteAuthUsersId403
  | DeleteAuthUsersId404;

export const useDeleteAuthUsersId = <
  TError =
    | DeleteAuthUsersId400
    | DeleteAuthUsersId401
    | DeleteAuthUsersId403
    | DeleteAuthUsersId404,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAuthUsersId>>,
    TError,
    { id: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteAuthUsersId>>,
  TError,
  { id: string },
  TContext
> => {
  const mutationOptions = getDeleteAuthUsersIdMutationOptions(options);

  return useMutation(mutationOptions);
};
