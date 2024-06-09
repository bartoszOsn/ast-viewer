import { Component, computed, inject } from '@angular/core';
import { Store } from '../../domain/Store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-ast-presenter',
	templateUrl: './ASTPresenterComponent.html',
	styleUrl: './ASTPresenterComponent.scss',
	standalone: true
})
export class ASTPresenterComponent {
	readonly store = inject(Store);

	readonly ast = toSignal(this.store.ast$);
	readonly astString = computed(() => JSON.stringify(this.ast(), null, '\t'));
}