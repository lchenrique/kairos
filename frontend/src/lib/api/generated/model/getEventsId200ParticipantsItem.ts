/**
 * type AxiosResponse<T> = T
 */
import type { GetEventsId200ParticipantsItemMember } from "./getEventsId200ParticipantsItemMember";
import type { GetEventsId200ParticipantsItemStatus } from "./getEventsId200ParticipantsItemStatus";

/**
 * Participante do evento
 */
export type GetEventsId200ParticipantsItem = {
  /** Data de criação */
  createdAt: string;
  /** ID do evento */
  eventId: string;
  /** ID do participante */
  id: string;
  /** Dados do membro */
  member: GetEventsId200ParticipantsItemMember;
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status: GetEventsId200ParticipantsItemStatus;
};
