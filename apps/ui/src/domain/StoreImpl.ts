import { inject, Injectable } from '@angular/core';
import { Store } from './Store';
import { BehaviorSubject, combineLatest, concat, debounceTime, first, map, Observable, of, share, shareReplay, Subject, switchMap } from 'rxjs';
import { Resource } from '../infrastructure/Resource';
import { ParseResult } from './ParseResult';

@Injectable()
export class StoreImpl extends Store {
	private readonly resource = inject(Resource);

	private readonly setParser$ = new Subject<string>();
	private readonly setCode$ = new BehaviorSubject<string>('');

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
							map(resultDTO => ParseResult.of(resultDTO))
						)
				}
			),
			share()
		);

    override setParser(parserName: string): void {
		this.setParser$.next(parserName);
    }

    override setCode(code: string): void {
		this.setCode$.next(code);
    }
}