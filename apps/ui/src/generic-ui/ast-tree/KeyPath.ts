export type KeyPath = Array<string>;

export function keyPathArrayContains(array: Array<KeyPath>, keyPath: KeyPath): boolean {
	return array.some(item => keyPathEquals(item, keyPath));
}

export function keyPathEquals(a: KeyPath, b: KeyPath): boolean {
	if (a.length !== b.length) {
		return false;
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}

	return true;
}