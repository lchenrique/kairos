/**
 * type AxiosResponse<T> = T
 */

/**
 * @nullable
 */
export type PostEvents201RecurrenceRule =
  | (typeof PostEvents201RecurrenceRule)[keyof typeof PostEvents201RecurrenceRule]
  | null;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEvents201RecurrenceRule = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;
