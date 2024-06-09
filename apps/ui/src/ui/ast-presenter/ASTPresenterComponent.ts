import { Component, computed, inject } from '@angular/core';
import { Store } from '../../domain/Store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ParseResult } from '../../domain/ParseResult';

@Component({
	selector: 'app-ast-presenter',
	templateUrl: './ASTPresenterComponent.html',
	styleUrl: './ASTPresenterComponent.scss',
	standalone: true
})
export class ASTPresenterComponent {
	readonly store = inject(Store);

	readonly parseResult = toSignal(this.store.parseResult$, { initialValue: ParseResult.empty() });
	readonly astString = computed(() => {
		const parseResult = this.parseResult();
		if (parseResult.isValid()) {
			return JSON.stringify(parseResult.getAst(), null, '\t');
		}
		return '';
	});

	readonly parseError = computed(() => {
		const parseResult = this.parseResult();
		if (parseResult.isInvalid()) {
			return parseResult;
		}

		return null;
	});
}