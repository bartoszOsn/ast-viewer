import { Component, inject } from '@angular/core';
import { Store } from '../../domain/Store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'app-code-editor',
	templateUrl: './CodeEditorComponent.html',
	styleUrl: './CodeEditorComponent.scss',
	standalone: true,
})
export class CodeEditorComponent {
	readonly store = inject(Store);

	readonly code = toSignal(this.store.code$);

	onInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		this.store.setCode(target.value);
	}
}