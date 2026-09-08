/**
 * type AxiosResponse<T> = T
 */
import type { GetEvents200DataItem } from "./getEvents200DataItem";
import type { GetEvents200Meta } from "./getEvents200Meta";

/**
 * Resposta paginada de eventos
 */
export type GetEvents200 = {
  data: GetEvents200DataItem[];
  /** Metadados de paginação */
  meta: GetEvents200Meta;
};
