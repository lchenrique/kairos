/**
 * type AxiosResponse<T> = T
 */

/**
 * @nullable
 */
export type PutEventsIdBodyRecurrenceRule =
  | (typeof PutEventsIdBodyRecurrenceRule)[keyof typeof PutEventsIdBodyRecurrenceRule]
  | null;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const PutEventsIdBodyRecurrenceRule = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;
