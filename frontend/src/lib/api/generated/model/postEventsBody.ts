/**
 * type AxiosResponse<T> = T
 */
import type { PostEventsBodyRecurrenceRule } from "./postEventsBodyRecurrenceRule";
import type { PostEventsBodyStatus } from "./postEventsBodyStatus";
import type { PostEventsBodyType } from "./postEventsBodyType";

/**
 * Dados para criação de evento
 */
export type PostEventsBody = {
  /**
   * Descrição do evento
   * @nullable
   */
  description?: string | null;
  /**
   * Data de término
   * @nullable
   */
  endDate?: string | null;
  /**
   * Local do evento
   * @nullable
   */
  location?: string | null;
  /** IDs dos participantes */
  participants?: string[];
  /** @nullable */
  recurrenceEndDate?: string | null;
  recurrenceExceptions?: string[];
  /** @nullable */
  recurrenceRule?: PostEventsBodyRecurrenceRule;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  reminderMinutes?: number | null;
  /** Data de início */
  startDate: string;
  /** Status do evento */
  status?: PostEventsBodyStatus;
  /**
   * Título do evento
   * @minLength 3
   */
  title: string;
  /** Tipo do evento */
  type: PostEventsBodyType;
};
