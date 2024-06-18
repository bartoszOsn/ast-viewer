import { Component, input, output } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { Button } from 'primeng/button';

@Component({
	selector: 'app-search-toolbar',
	templateUrl: './SearchToolbarComponent.html',
	imports: [
		ToolbarModule,
		InputTextModule,
		ButtonGroupModule,
		Button
	],
	styleUrl: './SearchToolbarComponent.scss',
	standalone: true
})
export class SearchToolbarComponent {
	query = input.required<string>();
	found = input.required<number>();
	focused = input.required<number>();

	queryChange = output<string>();
	focusedChange = output<number>();

	onInput(event: Event): void {
		if (event instanceof InputEvent) {
			this.queryChange.emit((event.target as HTMLInputElement).value)
		}
	}

	onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			this.onNext();
		}
	}

	onPrev(): void {
		const newFocused = this.focused() - 1;
		this.focusedChange.emit(newFocused < 0 ? this.found() - 1 : newFocused);
	}

	onNext(): void {
		if (this.found() > 0) {
			this.focusedChange.emit((this.focused() + 1) % this.found());
		}
	}

	protected readonly onkeydown = onkeydown;
}
