export function memoize<T extends (...args: any[]) => any>(fn: T, invalidateTime: number): T {
	const cache = new Map<string, { value: ReturnType<T>, expiration: number }>();

	return ((...args: Parameters<T>) => {
		const key = JSON.stringify(args);
		const cachedValue = cache.get(key);

		if (cachedValue && cachedValue.expiration > Date.now()) {
			return cachedValue.value;
		}

		const value = fn(...args);
		cache.set(key, { value, expiration: Date.now() + invalidateTime });

		return value;
	}) as T;
}