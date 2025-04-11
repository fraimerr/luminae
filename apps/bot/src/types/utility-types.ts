export type Nullable<T> = { [K in keyof T]: T[K] | null };

export enum RequiredRoleType {
	AnyOneOf,
	All,
	None,
}

/**
 * An object that is non nullable, to bypass TypeScript not easily working with {@link Record<PropertyKey, unknown>} in various instances.
 */

export type NonNullObject = object & {};
