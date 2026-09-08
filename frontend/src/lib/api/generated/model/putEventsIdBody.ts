/**
 * type AxiosResponse<T> = T
 */
import type { PutEventsIdBodyRecurrenceRule } from "./putEventsIdBodyRecurrenceRule";
import type { PutEventsIdBodyStatus } from "./putEventsIdBodyStatus";
import type { PutEventsIdBodyType } from "./putEventsIdBodyType";

/**
 * Dados para atualização de evento
 */
export type PutEventsIdBody = {
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
  recurrenceRule?: PutEventsIdBodyRecurrenceRule;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  reminderMinutes?: number | null;
  /** Data de início */
  startDate?: string;
  /** Status do evento */
  status?: PutEventsIdBodyStatus;
  /**
   * Título do evento
   * @minLength 3
   */
  title?: string;
  /** Tipo do evento */
  type?: PutEventsIdBodyType;
};
