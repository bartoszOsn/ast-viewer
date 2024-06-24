import { createResolveDynamicPackage } from '../infrastructure/dynamic-package';

export const createParseFromPackage = (modulesPath: string) => {
	const resolveDynamicPackage = createResolveDynamicPackage(modulesPath)

	return async (code: string, packageName: string, packageVersion: string) => {
		const { parse} = await resolveDynamicPackage<any>(packageName, packageVersion); // TODO any

		const ast = parse(code, {
			filePath: 'file.ts',
		});
		return ast;
	}
}
