/**
 * type AxiosResponse<T> = T
 */

/**
 * @nullable
 */
export type GetEvents200DataItemRecurrenceRule =
  | (typeof GetEvents200DataItemRecurrenceRule)[keyof typeof GetEvents200DataItemRecurrenceRule]
  | null;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const GetEvents200DataItemRecurrenceRule = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
} as const;
