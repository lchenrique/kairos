/**
 * type AxiosResponse<T> = T
 */
import type { PostEventsEventIdParticipantsBodyStatus } from "./postEventsEventIdParticipantsBodyStatus";

/**
 * Dados do participante
 */
export type PostEventsEventIdParticipantsBody = {
  /** ID do membro */
  memberId: string;
  /** Status do participante */
  status?: PostEventsEventIdParticipantsBodyStatus;
};
