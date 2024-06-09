import { AfterViewInit, Component, computed, inject, Signal, ViewChild } from '@angular/core';
import { Store } from '../../domain/Store';
import { toSignal } from '@angular/core/rxjs-interop';
import { CodeEditorModule, CodeEditorComponent as NgStackCodeEditorComponent } from '@ngstack/code-editor';
import { filter, map } from 'rxjs';

@Component({
	selector: 'app-code-editor',
	templateUrl: './CodeEditorComponent.html',
	styleUrl: './CodeEditorComponent.scss',
	standalone: true,
	imports: [
		CodeEditorModule
	]
})
export class CodeEditorComponent implements AfterViewInit {
	@ViewChild('codeEditor', { static: true })
	codeEditor!: NgStackCodeEditorComponent;

	readonly store = inject(Store);

	readonly code = toSignal(this.store.code$, { initialValue: ''});

	readonly codeModel: Signal<NgStackCodeEditorComponent['codeModel']> = toSignal(
		this.store.code$
			.pipe(
				filter(() => !!this.codeEditor?.editor),
				filter(code => code != this.codeEditor.editor.getValue()),
				map(code => ({
					language: 'typescript',
					value: code,
					uri: 'main.ts'
				}))
			),
		{ initialValue: { language: 'typescript', value: '', uri: 'main.ts' } }
	)

	readonly options: NgStackCodeEditorComponent['options'] = {}

	ngAfterViewInit(): void {
		setInterval(() => this.codeEditor.onResize());
	}

	onCodeChanged(newCode: string) {
		this.store.setCode(newCode);
	}
}