/**
 * type AxiosResponse<T> = T
 */

export type GetHealth503Status =
  (typeof GetHealth503Status)[keyof typeof GetHealth503Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetHealth503Status = {
  degraded: "degraded",
} as const;
