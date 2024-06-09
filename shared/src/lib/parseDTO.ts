export type ParseDTO = ParseDTOSuccess | ParseDTOFailure;

export interface ParseDTOSuccess {
	status: 'success';
	ast: unknown;
}

export interface ParseDTOFailure {
	status: 'failure';
	error: string;
	location: {
		start: ParseDTOLocation;
		end: ParseDTOLocation;
	}
}

export interface ParseDTOLocation {
	line: number;
	column: number;
}