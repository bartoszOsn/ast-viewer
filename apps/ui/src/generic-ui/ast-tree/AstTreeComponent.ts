import { Component, computed, inject, input } from '@angular/core';
import { AstTreeService } from './AstTreeService';
import { KeyPath } from './KeyPath';
import { TreeModule } from 'primeng/tree';
import { NgStyle } from '@angular/common';

@Component({
	selector: 'app-ast-tree',
	templateUrl: './AstTreeComponent.html',
	styleUrl: './AstTreeComponent.scss',
	standalone: true,
	imports: [
		TreeModule,
		NgStyle
	],
	providers: [AstTreeService]
})
export class AstTreeComponent {
	private readonly jsonPresenterService = inject(AstTreeService);

	json = input.required<unknown>();
	highlightedKeys = input.required<Array<KeyPath>>();

	readonly treeNodes = computed(() => this.jsonPresenterService.objectToTreeNodes(this.json() as any, this.highlightedKeys()))
}