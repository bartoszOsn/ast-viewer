export abstract class ParserService {
	abstract readonly parserName: string;

	abstract parse(code: string): unknown;
}