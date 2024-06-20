import { readFile } from 'fs/promises';
import { join } from 'path';
import { getAliasForPackage } from './getAliasForPackage';

export const createPackageJsonContainsDependency = (modulesPath: string) => {
	const packageJsonPath = join(modulesPath, 'package.json');

	return async (packageName: string, packageVersion: string): Promise<boolean> => {
		const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
		const alias = getAliasForPackage(packageName, packageVersion);
		return packageJson.dependencies?.[alias] !== undefined;
	};
}