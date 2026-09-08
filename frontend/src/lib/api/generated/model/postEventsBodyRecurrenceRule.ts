/**
 * type AxiosResponse<T> = T
 */

/**
 * @nullable
 */
export type PostEventsBodyRecurrenceRule =
  | (typeof PostEventsBodyRecurrenceRule)[keyof typeof PostEventsBodyRecurrenceRule]
  | null;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PostEventsBodyRecurrenceRule = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;
