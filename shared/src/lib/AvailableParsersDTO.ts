export interface AvailableParsersDTO {
	parsers: Array<AvailableParserDTO>;
}

export interface AvailableParserDTO {
	name: string;
	language: string;
	versions: Array<string>;
	latestVersion: string;
}