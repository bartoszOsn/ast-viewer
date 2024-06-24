export function getAliasForPackage(packageName: string, packageVersion: string): string {
	const packageNameWithoutScope = packageName.replace('@', 'at-').replace('/', '-');
	const versionWithoutDots = packageVersion.replace(/\./g, '-');

	return `${packageNameWithoutScope}--${versionWithoutDots}`;
}