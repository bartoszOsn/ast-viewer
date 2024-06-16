import { inject, Injectable } from '@angular/core';
import { Store } from './Store';
import { BehaviorSubject, combineLatest, concat, debounceTime, first, map, Observable, of, share, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { Resource } from '../infrastructure/Resource';
import { ParseResult } from './ParseResult';
import { KeyPath } from '../generic-ui/ast-tree/KeyPath';
import esquery from 'esquery';

@Injectable()
export class StoreImpl extends Store {
	private readonly resource = inject(Resource);

	private readonly setParser$ = new Subject<string>();
	private readonly setCode$ = new BehaviorSubject<string>('');
	private readonly setQuery$ = new BehaviorSubject<string>('');
	private readonly setFocusedFoundNodeIndex$ = new Subject<number>();

    override availableParserNames$: Observable<string[]> = this.resource.getAvailableParsers()
		.pipe(
			shareReplay(1)
		);

    override selectedParserName$: Observable<string> = concat(
		this.availableParserNames$.pipe(map(names => names[0]), first()),
		this.setParser$
	)
		.pipe(
			shareReplay(1)
		);

    override code$: Observable<string> = this.setCode$.asObservable();

	override readonly parseResult$ = combineLatest([
		this.selectedParserName$,
		this.setCode$
	])
		.pipe(
			debounceTime(500),
			switchMap(
				([parser, code]) => {
					if (code.length <= 0) {
						return of(ParseResult.empty())
					}

					return this.resource.getParserOutput(parser, code)
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

	override focusedFoundNodeIndex$: Observable<number> = this.setFocusedFoundNodeIndex$.asObservable();

    override setParser(parserName: string): void {
		this.setParser$.next(parserName);
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