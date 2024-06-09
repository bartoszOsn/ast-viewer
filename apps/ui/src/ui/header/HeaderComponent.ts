import { Component, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Store } from '../../domain/Store';
import { DropdownModule } from 'primeng/dropdown';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-header',
	templateUrl: './HeaderComponent.html',
	styleUrl: './HeaderComponent.scss',
	standalone: true,
	imports: [
		MenubarModule,
		DropdownModule,
		FormsModule
	]
})
export class HeaderComponent {
	readonly store = inject(Store);

	readonly availableParserNames = toSignal(this.store.availableParserNames$);
	readonly selectedParserName = toSignal(this.store.selectedParserName$);
}