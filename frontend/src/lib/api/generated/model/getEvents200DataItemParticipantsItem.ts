/**
 * type AxiosResponse<T> = T
 */
import type { GetEvents200DataItemParticipantsItemMember } from "./getEvents200DataItemParticipantsItemMember";
import type { GetEvents200DataItemParticipantsItemStatus } from "./getEvents200DataItemParticipantsItemStatus";

/**
 * Participante do evento
 */
export type GetEvents200DataItemParticipantsItem = {
  /** Data de criação */
  createdAt: string;
  /** ID do evento */
  eventId: string;
  /** ID do participante */
  id: string;
  /** Dados do membro */
  member: GetEvents200DataItemParticipantsItemMember;
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status: GetEvents200DataItemParticipantsItemStatus;
};
