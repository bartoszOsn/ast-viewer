import { join, dirname } from 'path';
import { writeFile, mkdir } from 'fs/promises';

export const createCreatePackageJson = (modulesPath: string) => {
	const packageJsonPath = join(modulesPath, 'package.json');

	return async (): Promise<void> => {
		const packageJson = {
			name: 'dynamic-package',
			version: '1.0.0'
		};
		const packageJsonContent = JSON.stringify(packageJson, null, 2);
		await writeFileRecursive(packageJsonPath, packageJsonContent);
	}
}

async function writeFileRecursive(path: string, data: string): Promise<void> {
	try {
		await writeFile(path, data, 'utf8');
	} catch (err: unknown) {
		if (err instanceof Error && err.message.includes('ENOENT')) {
			const dir = dirname(path);
			await mkdir(dir, {recursive: true});
			await writeFile(path, data, 'utf8');
		}
	}
}