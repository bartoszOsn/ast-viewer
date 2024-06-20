import { access, constants } from 'fs/promises';
import { join } from 'path';

export const createPackageJsonExists = (modulesPath: string) => {
	const packageJsonPath = join(modulesPath, 'package.json');

	return async (): Promise<boolean> => {
		try {
			await access(packageJsonPath, constants.F_OK);
			return true;
		} catch {
			return false;
		}
	};
}