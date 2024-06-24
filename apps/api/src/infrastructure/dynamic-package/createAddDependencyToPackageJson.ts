import { getAliasForPackage } from './getAliasForPackage';
import { npmInstall } from '../npm';

export const createAddDependencyToPackageJson = (modulesPath: string) => {
	return async (packageName: string, packageVersion: string): Promise<void> => {
		const alias = getAliasForPackage(packageName, packageVersion);
		await npmInstall(modulesPath, packageName, packageVersion, alias);
	};
}