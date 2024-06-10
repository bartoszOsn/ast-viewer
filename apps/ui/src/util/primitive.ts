export type Primitive = string | boolean | number | symbol | null | undefined;

export function isPrimitive(value: unknown): value is Primitive {
	const type = typeof value;

	return [
		'string',
		'number',
		'boolean',
		'symbol',
		'undefined'
	].includes(type);
}