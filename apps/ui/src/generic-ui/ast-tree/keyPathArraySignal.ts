import { KeyPath, keyPathArrayContains, keyPathEquals, keyPathStartsWith } from './KeyPath';
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

	const addRecursive = (keyPath: KeyPath): void => {
		if (!contains(keyPath)) {
			const parentKeyPath = keyPath.slice(0, keyPath.length - 1);

			if (parentKeyPath.length > 0) {
				addRecursive(parentKeyPath);
			}
			add(keyPath);
		}
	}

	const removeRecursive = (keyPath: KeyPath): void => {
		keyPathSignal.update(keyPaths => keyPaths.filter(kp => !keyPathStartsWith(kp, keyPath)));
	}

	return {
		signal: keyPathSignal.asReadonly(),
		contains,
		add,
		remove,
		addRecursive,
		removeRecursive
	}
}