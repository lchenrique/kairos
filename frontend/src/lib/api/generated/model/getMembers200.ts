/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Kairos API
 * API do sistema Kairos para gestão de membros, grupos e eventos
 * OpenAPI spec version: 1.0.0
 */
import type { GetMembers200MembersItem } from "./getMembers200MembersItem";
import type { GetMembers200Pagination } from "./getMembers200Pagination";

export type GetMembers200 = {
	members: GetMembers200MembersItem[];
	pagination: GetMembers200Pagination;
};
