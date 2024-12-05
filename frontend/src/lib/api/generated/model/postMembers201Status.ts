/**
 * type AxiosResponse<T> = T
 */

export type PostMembers201Status =
  (typeof PostMembers201Status)[keyof typeof PostMembers201Status];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostMembers201Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;
