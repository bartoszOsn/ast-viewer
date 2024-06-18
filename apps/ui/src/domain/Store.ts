import { Observable } from 'rxjs';
import { ParseResult } from './ParseResult';
import { KeyPath } from '../generic-ui/ast-tree/KeyPath';
import { ParserPackage } from './ParserPackage';
import { ParserVersion } from './ParserVersion';

export abstract class Store {
	abstract readonly availableParsers$: Observable<Array<ParserPackage>>;
	abstract readonly selectedParserVersion$: Observable<ParserVersion>;
	abstract readonly code$: Observable<string>;
	abstract readonly parseResult$: Observable<ParseResult>;
	abstract readonly query$: Observable<string>;
	abstract readonly foundNodePaths$: Observable<Array<KeyPath>>;
	abstract readonly focusedFoundNodeIndex$: Observable<number>;

	abstract setParser(parser: ParserVersion): void;
	abstract setCode(code: string): void;
	abstract setQuery(query: string): void;
	abstract setFocusedFoundNodeIndex(index: number): void;
}
