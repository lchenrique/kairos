/**
 * type AxiosResponse<T> = T
 */
import type { GetEventsType } from "./getEventsType";
import type { GetEventsStatus } from "./getEventsStatus";
import type { GetEventsSortBy } from "./getEventsSortBy";
import type { GetEventsOrder } from "./getEventsOrder";

export type GetEventsParams = {
  /**
   * Número da página
   */
  page?: number;
  /**
   * Quantidade de itens por página
   */
  limit?: number;
  /**
   * Termo de busca
   */
  search?: string;
  /**
   * Filtrar por tipo
   */
  type?: GetEventsType;
  /**
   * Filtrar por status
   */
  status?: GetEventsStatus;
  /**
   * Filtrar por data de início
   */
  startDate?: string;
  /**
   * Filtrar por data de término
   */
  endDate?: string;
  /**
   * Campo para ordenação
   */
  sortBy?: GetEventsSortBy;
  /**
   * Direção da ordenação
   */
  order?: GetEventsOrder;
};
