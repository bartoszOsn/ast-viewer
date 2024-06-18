import { Component, computed, inject, input, signal } from '@angular/core';
import { AstTreeService } from './AstTreeService';
import { KeyPath } from './KeyPath';
import { TreeModule, TreeNodeCollapseEvent, TreeNodeExpandEvent } from 'primeng/tree';
import { NgStyle } from '@angular/common';
import { keyPathArraySignal } from './keyPathArraySignal';
import { AstTreeNodeData } from './AstTreeNodeData';

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
	focusedKey = input<KeyPath>();

	expandedKeys = keyPathArraySignal();
	readonly treeNodes = computed(() => this.jsonPresenterService.objectToTreeNodes(
		this.json() as any,
		this.highlightedKeys(),
		this.expandedKeys.signal(),
		this.focusedKey()
	));

	onNodeExpand(event: TreeNodeExpandEvent) {
		this.expandedKeys.addRecursive((event.node.data as AstTreeNodeData).keyPath);
	}

	onNodeCollapse(event: TreeNodeCollapseEvent) {
		this.expandedKeys.removeRecursive((event.node.data as AstTreeNodeData).keyPath);
	}
}