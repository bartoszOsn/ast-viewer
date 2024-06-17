import { KeyPath, keyPathArrayContains, keyPathEquals } from './KeyPath';
import { signal } from '@angular/core';

export function keyPathArraySignal() {
	const keyPathSignal = signal<Array<KeyPath>>([]);

	const contains = (keyPath: KeyPath): boolean => keyPathArrayContains(keyPathSignal(), keyPath);

	const add = (keyPath: KeyPath): void => {
		if (!contains(keyPath)) {
			keyPathSignal.update(keyPaths => [...keyPaths, keyPath]);
		}
	}

	const remove = (keyPath: KeyPath): void => {
		keyPathSignal.update(keyPaths => keyPaths.filter(kp => !keyPathEquals(kp, keyPath)));
	}

	return {
		signal: keyPathSignal.asReadonly(),
		contains,
		add,
		remove
	}
}