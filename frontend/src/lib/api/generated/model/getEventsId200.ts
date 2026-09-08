/**
 * type AxiosResponse<T> = T
 */
import type { GetEventsId200ParticipantsItem } from "./getEventsId200ParticipantsItem";
import type { GetEventsId200RecurrenceRule } from "./getEventsId200RecurrenceRule";
import type { GetEventsId200Status } from "./getEventsId200Status";
import type { GetEventsId200Type } from "./getEventsId200Type";

/**
 * Evento
 */
export type GetEventsId200 = {
  /** Data de criação */
  createdAt: string;
  /**
   * Descrição do evento
   * @nullable
   */
  description: string | null;
  /**
   * Data de término
   * @nullable
   */
  endDate: string | null;
  /** ID do evento */
  id: string;
  /**
   * Local do evento
   * @nullable
   */
  location: string | null;
  /** Lista de participantes */
  participants: GetEventsId200ParticipantsItem[];
  /** @nullable */
  recurrenceEndDate: string | null;
  recurrenceExceptions: string[];
  /** @nullable */
  recurrenceRule: GetEventsId200RecurrenceRule;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  reminderMinutes: number | null;
  /** Data de início */
  startDate: string;
  /** Status do evento */
  status: GetEventsId200Status;
  /** Título do evento */
  title: string;
  /** Tipo do evento */
  type: GetEventsId200Type;
  /** Data de atualização */
  updatedAt: string;
};
