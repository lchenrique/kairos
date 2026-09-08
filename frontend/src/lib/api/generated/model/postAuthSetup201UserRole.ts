/**
 * type AxiosResponse<T> = T
 */

export type PostAuthSetup201UserRole =
  (typeof PostAuthSetup201UserRole)[keyof typeof PostAuthSetup201UserRole];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostAuthSetup201UserRole = {
  ADMIN: "ADMIN",
  PASTOR: "PASTOR",
  LEADER: "LEADER",
  SECRETARY: "SECRETARY",
  USER: "USER",
} as const;
