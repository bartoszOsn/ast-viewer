import { Component, computed, inject } from '@angular/core';
import { Store } from '../../domain/Store';
import { toSignal } from '@angular/core/rxjs-interop';
import { ParseResult } from '../../domain/ParseResult';
import { AstTreeComponent } from '../../generic-ui/ast-tree/AstTreeComponent';
import { SearchToolbarComponent } from '../../generic-ui/search-toolbar/SearchToolbarComponent';

@Component({
	selector: 'app-ast-presenter',
	templateUrl: './ASTPresenterComponent.html',
	styleUrl: './ASTPresenterComponent.scss',
	imports: [
		AstTreeComponent,
		SearchToolbarComponent
	],
	standalone: true
})
export class ASTPresenterComponent {
	readonly store = inject(Store);

	readonly parseResult = toSignal(this.store.parseResult$, { initialValue: ParseResult.empty() });
	readonly ast = computed(() => this.parseResult().asValid().getAst());
	readonly query = toSignal(this.store.query$, { initialValue: '' });
	readonly foundNodePaths = toSignal(this.store.foundNodePaths$, { initialValue: [] });
	readonly focusedFoundNodeIndex = toSignal(this.store.focusedFoundNodeIndex$, { initialValue: 0 });

	readonly parseError = computed(() => this.parseResult().asInvalid());
}