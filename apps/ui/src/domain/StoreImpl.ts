import { inject, Injectable } from '@angular/core';
import { Store } from './Store';
import {
	BehaviorSubject,
	combineLatest,
	concat,
	debounceTime,
	first,
	map,
	merge,
	Observable,
	of,
	share,
	shareReplay,
	startWith,
	Subject,
	switchMap
} from 'rxjs';
import { Resource } from '../infrastructure/Resource';
import { ParseResult } from './ParseResult';
import { KeyPath } from '../generic-ui/ast-tree/KeyPath';
import esquery from 'esquery';
import { ParserPackage } from './ParserPackage';
import { ParserVersion } from './ParserVersion';

@Injectable()
export class StoreImpl extends Store {
	private readonly resource = inject(Resource);

	private readonly setParser$ = new Subject<ParserVersion>();
	private readonly setCode$ = new BehaviorSubject<string>('');
	private readonly setQuery$ = new BehaviorSubject<string>('');
	private readonly setFocusedFoundNodeIndex$ = new Subject<number>();

	override availableParsers$: Observable<Array<ParserPackage>> = this.resource.getAvailableParsers()
		.pipe(
			map(dto => dto.parsers.map(parserDto => ParserPackage.fromDTO(parserDto))),
			shareReplay(1)
		);

	override selectedParserVersion$: Observable<ParserVersion> = concat(
		this.availableParsers$.pipe(map(parsers => parsers[0].latestVersion), first()),
		this.setParser$
	)
		.pipe(
			shareReplay(1)
		);

    override code$: Observable<string> = this.setCode$.asObservable();

	override readonly parseResult$ = combineLatest([
		this.selectedParserVersion$,
		this.setCode$
	])
		.pipe(
			debounceTime(500),
			switchMap(
				([parser, code]) => {
					if (code.length <= 0) {
						return of(ParseResult.empty())
					}

					return this.resource.getParserOutput(parser.name, parser.version, code)
						.pipe(
							map(resultDTO => ParseResult.of(resultDTO)),
							startWith(ParseResult.pending())
						)
				}
			),
			share()
		);

	override query$: Observable<string> = this.setQuery$.asObservable();

	override readonly foundNodePaths$: Observable<Array<KeyPath>> = combineLatest([
		this.parseResult$,
		this.query$
	])
		.pipe(
			map(([result, query]) => {
				if (query.length <= 0) {
					return [];
				}

				if (!result.isValid()) {
					return [];
				}

				let esqueryResult;
				try {
					esqueryResult = esquery.query(result.getAst() as any, query);
				} catch (e) {
					return [];
				}

				return this.nodesToKeyPaths(esqueryResult, result.getAst());
			}),
			share()
		);

	override focusedFoundNodeIndex$: Observable<number> = merge(
		this.setFocusedFoundNodeIndex$,
		this.foundNodePaths$
	)
		.pipe(
			map((indexOrPath) => {
				if (typeof indexOrPath === 'number') {
					return indexOrPath;
				}

				return -1;
			}),
			share()
	);

	override setParser(parser: ParserVersion) {
		this.setParser$.next(parser);
	}

	override setCode(code: string): void {
		this.setCode$.next(code);
    }

	override setQuery(query: string): void {
		this.setQuery$.next(query);
	}

	override setFocusedFoundNodeIndex(index: number): void {
		this.setFocusedFoundNodeIndex$.next(index);
	}

	private nodesToKeyPaths(nodes: any[], ast: any): Array<KeyPath> {
		const result: Array<KeyPath> = [];

		const queue: Array<{ ast: unknown, path: KeyPath }> = [{ ast, path: []}];

		while (queue.length > 0) {
			const { ast, path } = queue.shift()!;

			if (nodes.includes(ast)) {
				result.push(path);
			}

			if (typeof ast === 'object' && ast !== null) {
				for (const [key, value] of Object.entries(ast)) {
					queue.push({ ast: value, path: [...path, key] });
				}
			}
		}

		return result;
	}
}