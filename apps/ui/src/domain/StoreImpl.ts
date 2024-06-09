import { inject, Injectable } from '@angular/core';
import { Store } from './Store';
import { BehaviorSubject, combineLatest, concat, filter, first, map, Observable, share, shareReplay, Subject, switchMap } from 'rxjs';
import { Resource } from '../infrastructure/Resource';
import { ParseDTOFailure } from '@ast-viewer/shared';

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

	private readonly parseResult$ = combineLatest([
		this.selectedParserName$,
		this.setCode$.pipe(filter(code => code.length > 0))
	])
		.pipe(
			switchMap(
				([parser, code]) => this.resource.getParserOutput(parser, code)
			),
			share()
		);

    override ast$: Observable<unknown | null> = this.parseResult$
		.pipe(
			map(result => result.status === 'success' ? result.ast : null)
		);

	override parseError$: Observable<ParseDTOFailure | null> = this.parseResult$
		.pipe(
			map(result => result.status === 'failure' ? result : null)
		);

    override setParser(parserName: string): void {
		this.setParser$.next(parserName);
    }

    override setCode(code: string): void {
		this.setCode$.next(code);
    }
}