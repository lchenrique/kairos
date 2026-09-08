/**
 * type AxiosResponse<T> = T
 */
import type { PatchEventsEventIdParticipantsMemberIdStatus200Member } from "./patchEventsEventIdParticipantsMemberIdStatus200Member";
import type { PatchEventsEventIdParticipantsMemberIdStatus200Status } from "./patchEventsEventIdParticipantsMemberIdStatus200Status";

/**
 * Participante do evento
 */
export type PatchEventsEventIdParticipantsMemberIdStatus200 = {
  /** Data de criação */
  createdAt: string;
  /** ID do evento */
  eventId: string;
  /** ID do participante */
  id: string;
  /** Dados do membro */
  member: PatchEventsEventIdParticipantsMemberIdStatus200Member;
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status: PatchEventsEventIdParticipantsMemberIdStatus200Status;
};
