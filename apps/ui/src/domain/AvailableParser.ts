import { AvailableParserDTO } from '@ast-viewer/shared';

export class AvailableParser {
	private constructor(
		public readonly name: string,
		public readonly language: string,
		public readonly availableVersions: Array<string>,
		public readonly latestVersion: string
	) {}

	fromDTO(dto: AvailableParserDTO): AvailableParser {
		return new AvailableParser(
			dto.name,
			dto.language,
			dto.versions,
			dto.latestVersion
		);
	}
}