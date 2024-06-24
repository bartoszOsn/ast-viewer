import { readFile } from 'fs/promises';
import { join, resolve, relative } from 'path';
import { getAliasForPackage } from './getAliasForPackage';

declare const __non_webpack_require__: NodeRequire;

export const createImportDynamicModule = (modulesPath: string) => {
	return async <TModule>(packageName: string, packageVersion: string): Promise<TModule> => {
		const packageAlias = getAliasForPackage(packageName, packageVersion);
		const packagePath = join(modulesPath, 'node_modules', packageAlias);
		const packagePackageJsonPath = join(packagePath, 'package.json');

		const packageJson = JSON.parse(await readFile(packagePackageJsonPath, 'utf-8'));
		const main = packageJson.main ?? packageJson.exports?.['.']?.default ?? 'index.js';
		const modulePath = resolve(packagePath, main);
		const relativeModulePath =  '.\\' + relative(__dirname, modulePath);

		return await __non_webpack_require__(relativeModulePath);
	};
}