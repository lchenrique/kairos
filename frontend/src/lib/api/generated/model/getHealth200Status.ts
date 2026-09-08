/**
 * type AxiosResponse<T> = T
 */

export type GetHealth200Status =
  (typeof GetHealth200Status)[keyof typeof GetHealth200Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetHealth200Status = {
  ok: "ok",
} as const;
