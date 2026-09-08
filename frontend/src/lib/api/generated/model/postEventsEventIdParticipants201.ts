/**
 * type AxiosResponse<T> = T
 */
import type { PostEventsEventIdParticipants201Member } from "./postEventsEventIdParticipants201Member";
import type { PostEventsEventIdParticipants201Status } from "./postEventsEventIdParticipants201Status";

/**
 * Participante do evento
 */
export type PostEventsEventIdParticipants201 = {
  /** Data de criação */
  createdAt: string;
  /** ID do evento */
  eventId: string;
  /** ID do participante */
  id: string;
  /** Dados do membro */
  member: PostEventsEventIdParticipants201Member;
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status: PostEventsEventIdParticipants201Status;
};
