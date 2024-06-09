import { Component } from '@angular/core';
import { HeaderComponent } from '../ui/header/HeaderComponent';
import { SplitterModule } from 'primeng/splitter';
import { CodeEditorComponent } from '../ui/code-editor/CodeEditorComponent';
import { ASTPresenterComponent } from '../ui/ast-presenter/ASTPresenterComponent';

@Component({
	selector: 'app-root',
	standalone: true,
	templateUrl: './AppComponent.html',
	styleUrl: './AppComponent.scss',
	imports: [
		HeaderComponent,
		SplitterModule,
		CodeEditorComponent,
		ASTPresenterComponent
	]
})
export class AppComponent {
	title = 'ast-viewer';
}
