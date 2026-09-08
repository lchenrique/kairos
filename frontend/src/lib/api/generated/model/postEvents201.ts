/**
 * type AxiosResponse<T> = T
 */
import type { PostEvents201ParticipantsItem } from "./postEvents201ParticipantsItem";
import type { PostEvents201RecurrenceRule } from "./postEvents201RecurrenceRule";
import type { PostEvents201Status } from "./postEvents201Status";
import type { PostEvents201Type } from "./postEvents201Type";

/**
 * Evento
 */
export type PostEvents201 = {
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
  participants: PostEvents201ParticipantsItem[];
  /** @nullable */
  recurrenceEndDate: string | null;
  recurrenceExceptions: string[];
  /** @nullable */
  recurrenceRule: PostEvents201RecurrenceRule;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  reminderMinutes: number | null;
  /** Data de início */
  startDate: string;
  /** Status do evento */
  status: PostEvents201Status;
  /** Título do evento */
  title: string;
  /** Tipo do evento */
  type: PostEvents201Type;
  /** Data de atualização */
  updatedAt: string;
};
