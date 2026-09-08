/**
 * type AxiosResponse<T> = T
 */
import type { PostEvents201ParticipantsItemMember } from "./postEvents201ParticipantsItemMember";
import type { PostEvents201ParticipantsItemStatus } from "./postEvents201ParticipantsItemStatus";

/**
 * Participante do evento
 */
export type PostEvents201ParticipantsItem = {
  /** Data de criação */
  createdAt: string;
  /** ID do evento */
  eventId: string;
  /** ID do participante */
  id: string;
  /** Dados do membro */
  member: PostEvents201ParticipantsItemMember;
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status: PostEvents201ParticipantsItemStatus;
};
