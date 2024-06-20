import { createPackageJsonExists } from './createPackageJsonExists';
import { Mutex } from 'async-mutex';
import { createCreatePackageJson } from './createCreatePackageJson';
import { createPackageJsonContainsDependency } from './createPackageJsonContainsDependency';
import { createAddDependencyToPackageJson } from './createAddDependencyToPackageJson';
import { createImportDynamicModule } from './createImportDynamicModule';

export const createResolveDynamicPackage =
	(modulesPath: string) => {
		const packageJsonExists = createPackageJsonExists(modulesPath);
		const createPackageJson = createCreatePackageJson(modulesPath);
		const packageJsonContainsDependency = createPackageJsonContainsDependency(modulesPath);
		const addDependencyToPackageJson = createAddDependencyToPackageJson(modulesPath);
		const importDynamicModule = createImportDynamicModule(modulesPath);

		// To avoid race condition only one dynamic package can be resolved at a time.
		// It might introduce a bottleneck, but it's a trade-off for simplicity.
		const mutex = new Mutex();

		return async <TModule>(packageName: string, packageVersion: string): Promise<TModule> => {
			const release = await mutex.acquire();
			try {
				if (!await packageJsonExists()) {
					await createPackageJson();
				}

				if (!await packageJsonContainsDependency(packageName, packageVersion)) {
					await addDependencyToPackageJson(packageName, packageVersion);
				}

				return importDynamicModule<TModule>(packageName, packageVersion);
			} finally {
				release();
			}
		};
	}