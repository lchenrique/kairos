/**
 * Generated by orval v7.3.0 🍺
 * Do not edit manually.
 * Kairos API
 * API do sistema Kairos para gestão de membros, grupos e eventos
 * OpenAPI spec version: 1.0.0
 */
import type { PutMembersId200Status } from "./putMembersId200Status";

export type PutMembersId200 = {
	/** @nullable */
	address: string | null;
	/** @nullable */
	baptismDate: string | null;
	/** @nullable */
	birthDate: string | null;
	createdAt: string;
	/** @nullable */
	email: string | null;
	/** @pattern ^[cC][^\s-]{8,}$ */
	id: string;
	/** @nullable */
	image: string | null;
	/** @minLength 3 */
	name: string;
	/** @nullable */
	notes: string | null;
	/** @nullable */
	phone: string | null;
	status: PutMembersId200Status;
	updatedAt: string;
};