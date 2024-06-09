import { Observable } from 'rxjs';
import { ParseDTOFailure } from '@ast-viewer/shared';
import { ParseResult } from './ParseResult';

export abstract class Store {
	abstract readonly availableParserNames$: Observable<string[]>;
	abstract readonly selectedParserName$: Observable<string>;
	abstract readonly code$: Observable<string>;
	abstract readonly parseResult$: Observable<ParseResult>;

	abstract setParser(parserName: string): void;
	abstract setCode(code: string): void;
}
