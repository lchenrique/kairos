/**
 * type AxiosResponse<T> = T
 */

/**
 * Metadados de paginação
 */
export type GetEvents200Meta = {
  /** Indica se há próxima página */
  hasNextPage: boolean;
  /** Indica se há página anterior */
  hasPreviousPage: boolean;
  /** Quantidade de itens por página */
  limit: number;
  /** Número da página atual */
  page: number;
  /** Total de itens */
  totalItems: number;
  /** Total de páginas */
  totalPages: number;
};
