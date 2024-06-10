import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { JsonPresenterTreeNodeData } from './JsonPresenterTreeNodeData';
import { KeyPath } from './KeyPath';
import { isPrimitive, Primitive } from '../../../util/primitive';

@Injectable()
export class JsonPresenterService {
	objectToTreeNodes(object: Record<any, any>, highlight: Array<KeyPath>): Array<TreeNode<JsonPresenterTreeNodeData>> {
		const result: Array<TreeNode<JsonPresenterTreeNodeData>> = [];
		for (const key in object) {
			const value = object[key];
			const keyPath: KeyPath = [key];
			const treeNode = this.valueToTreeNode(value, keyPath, highlight);
			result.push(treeNode);
		}
		return result;
	}

	private valueToTreeNode(value: unknown, keyPath: KeyPath, highlight: Array<KeyPath>): TreeNode<JsonPresenterTreeNodeData> {
		if (isPrimitive(value)) {
			return this.primitiveValueToNode(value, keyPath, highlight);
		}

		if (Array.isArray(value)) {
			return this.arrayValueToNode(value, keyPath, highlight);
		}

		if (typeof value === 'object') {
			return this.objectValueToTreeNode(value as any, keyPath, highlight);
		}

		return null as any; // TODO
	}

	private primitiveValueToNode(value: Primitive, keyPath: KeyPath, highlight: Array<KeyPath>): TreeNode<JsonPresenterTreeNodeData> {
		const key = keyPath[keyPath.length - 1];

		return {
			key: keyPath.join('.'),
			label: key,
			data: {
				valueLabel: JSON.stringify(value),
				valueLabelColor: 'var(--text-color-secondary)',
				highlight: this.isInHighlights(keyPath, highlight),
			}
		}
	}

	private arrayValueToNode(value: Array<unknown>, keyPath: KeyPath, highlight: Array<KeyPath>): TreeNode<JsonPresenterTreeNodeData> {
		const key = keyPath[keyPath.length - 1];

		return {
			key: keyPath.join('.'),
			label: key,
			data: {
				valueLabel: `Array(${value.length})`,
				valueLabelColor: 'var(--text-color-secondary)',
				highlight: this.isInHighlights(keyPath, highlight),
			},
			children: value.map((item, index) => this.valueToTreeNode(item, [...keyPath, index.toString()], highlight))
		}
	}

	private objectValueToTreeNode(value: Record<any, any>, keyPath: KeyPath, highlight: Array<KeyPath>): TreeNode<JsonPresenterTreeNodeData> {
		const key = keyPath[keyPath.length - 1];

		return {
			key: keyPath.join('.'),
			label: key,
			data: {
				valueLabel: value['type']  ?? `Object {}`,
				valueLabelColor: 'var(--text-color-secondary)',
				highlight: this.isInHighlights(keyPath, highlight),
			},
			children: [...Object.entries(value)].map(([childKey, childValue]) => this.valueToTreeNode(childValue, [...keyPath, childKey], highlight))
		}
	}

	private isInHighlights(path: KeyPath, highlights: Array<KeyPath>): boolean {
		return highlights.some(highlight => {
			if (highlight.length !== path.length) {
				return false;
			}

			for (let i = 0; i < path.length; i++) {
				if (path[i] !== highlight[i]) {
					return false;
				}
			}

			return true;
		});
	}
}