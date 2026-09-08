/**
 * type AxiosResponse<T> = T
 */
import type { GetEvents200DataItemParticipantsItem } from "./getEvents200DataItemParticipantsItem";
import type { GetEvents200DataItemRecurrenceRule } from "./getEvents200DataItemRecurrenceRule";
import type { GetEvents200DataItemStatus } from "./getEvents200DataItemStatus";
import type { GetEvents200DataItemType } from "./getEvents200DataItemType";

/**
 * Evento
 */
export type GetEvents200DataItem = {
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
  participants: GetEvents200DataItemParticipantsItem[];
  /** @nullable */
  recurrenceEndDate: string | null;
  recurrenceExceptions: string[];
  /** @nullable */
  recurrenceRule: GetEvents200DataItemRecurrenceRule;
  /**
   * @minimum 0
   * @exclusiveMinimum
   * @nullable
   */
  reminderMinutes: number | null;
  /** Data de início */
  startDate: string;
  /** Status do evento */
  status: GetEvents200DataItemStatus;
  /** Título do evento */
  title: string;
  /** Tipo do evento */
  type: GetEvents200DataItemType;
  /** Data de atualização */
  updatedAt: string;
};
