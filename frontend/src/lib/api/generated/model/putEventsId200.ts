/**
 * type AxiosResponse<T> = T
 */
import type { PutEventsId200ParticipantsItem } from "./putEventsId200ParticipantsItem";
import type { PutEventsId200RecurrenceRule } from "./putEventsId200RecurrenceRule";
import type { PutEventsId200Status } from "./putEventsId200Status";
import type { PutEventsId200Type } from "./putEventsId200Type";

/**
 * Evento
 */
export type PutEventsId200 = {
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
  participants: PutEventsId200ParticipantsItem[];
  /** @nullable */
  recurrenceEndDate: string | null;
  recurrenceExceptions: string[];
  /** @nullable */
  recurrenceRule: PutEventsId200RecurrenceRule;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  reminderMinutes: number | null;
  /** Data de início */
  startDate: string;
  /** Status do evento */
  status: PutEventsId200Status;
  /** Título do evento */
  title: string;
  /** Tipo do evento */
  type: PutEventsId200Type;
  /** Data de atualização */
  updatedAt: string;
};
