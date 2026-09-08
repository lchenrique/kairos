/**
 * type AxiosResponse<T> = T
 */
import type { PutEventsId200ParticipantsItemMember } from "./putEventsId200ParticipantsItemMember";
import type { PutEventsId200ParticipantsItemStatus } from "./putEventsId200ParticipantsItemStatus";

/**
 * Participante do evento
 */
export type PutEventsId200ParticipantsItem = {
  /** Data de criação */
  createdAt: string;
  /** ID do evento */
  eventId: string;
  /** ID do participante */
  id: string;
  /** Dados do membro */
  member: PutEventsId200ParticipantsItemMember;
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status: PutEventsId200ParticipantsItemStatus;
};
