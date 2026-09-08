/**
 * type AxiosResponse<T> = T
 */

/**
 * @nullable
 */
export type GetEventsId200RecurrenceRule =
  | (typeof GetEventsId200RecurrenceRule)[keyof typeof GetEventsId200RecurrenceRule]
  | null;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEventsId200RecurrenceRule = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;
