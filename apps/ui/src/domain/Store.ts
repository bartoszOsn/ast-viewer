import { Observable } from 'rxjs';
import { ParseDTOFailure } from '@ast-viewer/shared';
import { ParseResult } from './ParseResult';
import { KeyPath } from '../generic-ui/ast-tree/KeyPath';

export abstract class Store {
	abstract readonly availableParserNames$: Observable<string[]>;
	abstract readonly selectedParserName$: Observable<string>;
	abstract readonly code$: Observable<string>;
	abstract readonly parseResult$: Observable<ParseResult>;
	abstract readonly query$: Observable<string>;
	abstract readonly foundNodePaths$: Observable<Array<KeyPath>>;
	abstract readonly focusedFoundNodeIndex$: Observable<number>;

	abstract setParser(parserName: string): void;
	abstract setCode(code: string): void;
	abstract setQuery(query: string): void;
	abstract setFocusedFoundNodeIndex(index: number): void;
}
