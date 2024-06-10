import { Component, computed, inject } from '@angular/core';
import { Store } from '../../domain/Store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ParseResult } from '../../domain/ParseResult';
import { JsonPresenterComponent } from './json-presenter/JsonPresenterComponent';

@Component({
	selector: 'app-ast-presenter',
	templateUrl: './ASTPresenterComponent.html',
	styleUrl: './ASTPresenterComponent.scss',
	imports: [
		JsonPresenterComponent
	],
	standalone: true
})
export class ASTPresenterComponent {
	readonly store = inject(Store);

	readonly parseResult = toSignal(this.store.parseResult$, { initialValue: ParseResult.empty() });
	readonly ast = computed(() => {
		const parseResult = this.parseResult();
		if (parseResult.isValid()) {
			return parseResult.getAst();
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