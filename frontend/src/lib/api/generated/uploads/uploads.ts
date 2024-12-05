/**
 * type AxiosResponse<T> = T
 */
import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type {
  DeleteUploadsPublicId204,
  PostUploads200,
  PostUploadsBody,
} from ".././model";
import { customInstance } from "../../axios-instance";

/**
 * Faz upload de uma imagem
 */
export const postUploads = (
  postUploadsBody: PostUploadsBody,
  signal?: AbortSignal,
) => {
  const formData = new FormData();
  if (postUploadsBody.file !== undefined) {
    formData.append("file", postUploadsBody.file);
  }

  return customInstance<PostUploads200>({
    url: `/uploads`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
    signal,
  });
};

export const getPostUploadsMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUploads>>,
    TError,
    { data: PostUploadsBody },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postUploads>>,
  TError,
  { data: PostUploadsBody },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postUploads>>,
    { data: PostUploadsBody }
  > = (props) => {
    const { data } = props ?? {};

    return postUploads(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostUploadsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postUploads>>
>;
export type PostUploadsMutationBody = PostUploadsBody;
export type PostUploadsMutationError = unknown;

export const usePostUploads = <TError = unknown, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postUploads>>,
    TError,
    { data: PostUploadsBody },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof postUploads>>,
  TError,
  { data: PostUploadsBody },
  TContext
> => {
  const mutationOptions = getPostUploadsMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * Remove uma imagem do Cloudinary
 */
export const deleteUploadsPublicId = (publicId: string) => {
  return customInstance<DeleteUploadsPublicId204>({
    url: `/uploads/${publicId}`,
    method: "DELETE",
  });
};

export const getDeleteUploadsPublicIdMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUploadsPublicId>>,
    TError,
    { publicId: string },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteUploadsPublicId>>,
  TError,
  { publicId: string },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteUploadsPublicId>>,
    { publicId: string }
  > = (props) => {
    const { publicId } = props ?? {};

    return deleteUploadsPublicId(publicId);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteUploadsPublicIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteUploadsPublicId>>
>;

export type DeleteUploadsPublicIdMutationError = unknown;

export const useDeleteUploadsPublicId = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteUploadsPublicId>>,
    TError,
    { publicId: string },
    TContext
  >;
}): UseMutationResult<
  Awaited<ReturnType<typeof deleteUploadsPublicId>>,
  TError,
  { publicId: string },
  TContext
> => {
  const mutationOptions = getDeleteUploadsPublicIdMutationOptions(options);

  return useMutation(mutationOptions);
};
