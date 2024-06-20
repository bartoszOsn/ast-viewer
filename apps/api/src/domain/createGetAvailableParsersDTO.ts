import { AvailableParsersDTO } from '@ast-viewer/shared';
import { NpmView, npmView } from '../infrastructure/npm';
import { memoize } from '../util/memoize';
import { PackageContext } from './PackageContext';

export const createGetAvailableParsersDTO = (parserPackages: Array<PackageContext>) => {
	const npmViewMemo = memoize(npmView, 1000 * 60 * 60 * 24);

	return async (): Promise<AvailableParsersDTO> => {
		const views: Array<NpmView> = [];

		for (const parserPackage of parserPackages) {
			views.push(await npmViewMemo(parserPackage.name));
		}

		return npmViewsToAvailableParsersDTO(views, parserPackages);
	}
}

function npmViewsToAvailableParsersDTO(views: Array<NpmView>, parserPackages: Array<PackageContext>): AvailableParsersDTO {
	return {
		parsers: views.map(view => {
			const parserPackage = parserPackages.find(parserPackage => parserPackage.name === view.name)!;
			return {
				name: view.name,
				language: parserPackage.language,
				versions: view.versions,
				latestVersion: view.version
			};
		})
	};
}