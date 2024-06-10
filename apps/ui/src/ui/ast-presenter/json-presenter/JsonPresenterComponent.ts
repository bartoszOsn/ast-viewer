import { Component, computed, inject, input } from '@angular/core';
import { JsonPresenterService } from './JsonPresenterService';
import { KeyPath } from './KeyPath';
import { TreeModule } from 'primeng/tree';
import { NgStyle } from '@angular/common';

@Component({
	selector: 'app-json-presenter',
	templateUrl: './JsonPresenterComponent.html',
	standalone: true,
	imports: [
		TreeModule,
		NgStyle
	],
	providers: [JsonPresenterService]
})
export class JsonPresenterComponent {
	private readonly jsonPresenterService = inject(JsonPresenterService);

	json = input.required<unknown>();
	highlightedKeys = input.required<Array<KeyPath>>();

	readonly treeNodes = computed(() => this.jsonPresenterService.objectToTreeNodes(this.json() as any, this.highlightedKeys()))
}