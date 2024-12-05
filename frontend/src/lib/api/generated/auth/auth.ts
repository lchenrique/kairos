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
  GetAuthProfile200,
  GetAuthProfile401,
  GetAuthProfile500,
  PostAuthLogin200,
  PostAuthLogin401,
  PostAuthLogin500,
  PostAuthLoginBody,
  PostAuthPasswordReset204,
  PostAuthPasswordReset400,
  PostAuthPasswordReset500,
  PostAuthPasswordResetBody,
  PostAuthPasswordResetRequest204,
  PostAuthPasswordResetRequest500,
  PostAuthPasswordResetRequestBody,
  PostAuthRegister201,
  PostAuthRegister400,
  PostAuthRegisterBody,
  PutAuthPasswordChange204,
  PutAuthPasswordChange401,
  PutAuthPasswordChange500,
  PutAuthPasswordChangeBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Registra um novo usuário
 */
export const postAuthRegister = (
  postAuthRegisterBody: PostAuthRegisterBody,
  signal?: AbortSignal,
) => {
  return customInstance<PostAuthRegister201>({
    url: `/auth/register`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: postAuthRegisterBody,
    signal,
  });
};

export const getPostAuthRegisterMutationOptions = <
  TError = PostAuthRegister400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRegister>>,
    TError,
    { data: PostAuthRegisterBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAuthRegister>>,
  TError,
  { data: PostAuthRegisterBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAuthRegister>>,
    { data: PostAuthRegisterBody }
  > = (props) => {
    const { data } = props ?? {};

    return postAuthRegister(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAuthRegisterMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAuthRegister>>
>;
export type PostAuthRegisterMutationBody = PostAuthRegisterBody;
export type PostAuthRegisterMutationError = PostAuthRegister400;

export const usePostAuthRegister = <
  TError = PostAuthRegister400,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAuthRegister>>,
    TError,
    { data: PostAuthRegisterBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postAuthRegister>>,
  TError,
  { data: PostAuthRegisterBody },
  TContext
> => {
  const mutationOptions = getPostAuthRegisterMutationOptions(options);

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
  TError = PutAuthPasswordChange401 | PutAuthPasswordChange500,
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
export type PutAuthPasswordChangeMutationError =
  | PutAuthPasswordChange401
  | PutAuthPasswordChange500;

export const usePutAuthPasswordChange = <
  TError = PutAuthPasswordChange401 | PutAuthPasswordChange500,
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
 * Solicita redefinição de senha
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
  TError = PostAuthPasswordResetRequest500,
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
export type PostAuthPasswordResetRequestMutationError =
  PostAuthPasswordResetRequest500;

export const usePostAuthPasswordResetRequest = <
  TError = PostAuthPasswordResetRequest500,
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
 * Redefine a senha usando o token de redefinição
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
  TError = PostAuthPasswordReset400 | PostAuthPasswordReset500,
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
export type PostAuthPasswordResetMutationError =
  | PostAuthPasswordReset400
  | PostAuthPasswordReset500;

export const usePostAuthPasswordReset = <
  TError = PostAuthPasswordReset400 | PostAuthPasswordReset500,
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
