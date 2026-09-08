/**
 * type AxiosResponse<T> = T
 */

export type PostAuthLogin200UserRole =
  (typeof PostAuthLogin200UserRole)[keyof typeof PostAuthLogin200UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthLogin200UserRole = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
