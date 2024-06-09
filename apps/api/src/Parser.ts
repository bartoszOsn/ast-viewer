import { ParseDTO } from '@ast-viewer/shared';

export abstract class Parser {
	abstract readonly name: string;
	abstract parse(code: string): Promise<ParseDTO>;
}