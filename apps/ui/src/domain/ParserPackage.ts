import { ParserVersion } from './ParserVersion';
import { AvailableParserDTO } from '@ast-viewer/shared';

export class ParserPackage {
	readonly latestVersion: ParserVersion;

	private constructor(
		public readonly name: string,
		public readonly language: string,
		public readonly availableVersions: Array<ParserVersion>
	) {
		const latest = availableVersions.find(version => version.isLatest);
		if (!latest) {
			throw new Error('No latest version found');
		}
		this.latestVersion = latest;
	}

	static fromDTO(dto: AvailableParserDTO): ParserPackage {
		return new ParserPackage(
			dto.name,
			dto.language,
			dto.versions.map(version => new ParserVersion(dto.name, version, version === dto.latestVersion))
		);
	}
}