import { Observable } from 'rxjs';
import { ParseDTOFailure } from '@ast-viewer/shared';

export abstract class Store {
	abstract readonly availableParserNames$: Observable<string[]>;
	abstract readonly selectedParserName$: Observable<string>;
	abstract readonly code$: Observable<string>;
	abstract readonly ast$: Observable<unknown | null>; // TODO jakiś typ
	abstract readonly parseError$: Observable<ParseDTOFailure | null>;

	abstract setParser(parserName: string): void;
	abstract setCode(code: string): void;
}
