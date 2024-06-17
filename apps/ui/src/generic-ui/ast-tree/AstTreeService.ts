import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AstTreeNodeData } from './AstTreeNodeData';
import { KeyPath } from './KeyPath';
import { isPrimitive, Primitive } from '../../util/primitive';

@Injectable()
export class AstTreeService {
	private readonly typeToColorMap: Record<string, string> = {
		'number': 'var(--indigo-700)',
		'string': 'var(--green-700)',
		'boolean': 'var(--indigo-700)',
	};

	objectToTreeNodes(object: Record<any, any>, highlight: Array<KeyPath>): Array<TreeNode<AstTreeNodeData>> {
		const result: Array<TreeNode<AstTreeNodeData>> = [];
		for (const key in object) {
			const value = object[key];
			const keyPath: KeyPath = [key];
			const treeNode = this.valueToTreeNode(value, keyPath, highlight);
			result.push(treeNode);
		}
		return result;
	}

	private valueToTreeNode(value: unknown, keyPath: KeyPath, highlight: Array<KeyPath>): TreeNode<AstTreeNodeData> {

		let basicData: TreeNodeBasicData = {
			valueLabel: '',
			valueLabelColor: '',
			childrenValues: [],
		}

		if (isPrimitive(value)) {
			basicData = this.primitiveValueToTreeNodeBasicData(value);
		} else if (Array.isArray(value)) {
			basicData = this.arrayValueToTreeNodeBasicData(value);
		} else if (typeof value === 'object') {
			basicData = this.objectValueToTreeNodeBasicData(value as Record<any, any>);
		}

		return {
			key: keyPath.join('.'),
			label: keyPath[keyPath.length - 1],
			data: {
				valueLabel: basicData.valueLabel,
				valueLabelColor: basicData.valueLabelColor,
				highlight: this.isInHighlights(keyPath, highlight),
			},
			style: this.getStyle(keyPath, highlight),
			children: basicData.childrenValues.map(({ key, value }) => this.valueToTreeNode(value, [...keyPath, key], highlight))
		}
	}

	private primitiveValueToTreeNodeBasicData(value: Primitive): TreeNodeBasicData {
		return {
			valueLabel: JSON.stringify(value),
			valueLabelColor: this.typeToColorMap[typeof value] ?? 'var(--text-color-secondary)',
			childrenValues: [],
		}
	}

	private arrayValueToTreeNodeBasicData(value: Array<unknown>): TreeNodeBasicData {
		return {
			valueLabel: `Array(${value.length})`,
			valueLabelColor: 'var(--text-color-secondary)',
			childrenValues: value.map((item, index) => ({ key: index.toString(), value: item }))
		}
	}

	private objectValueToTreeNodeBasicData(value: Record<any, any>): TreeNodeBasicData {
		return {
			valueLabel: value['type']  ?? `Object {}`,
			valueLabelColor: 'var(--text-color-secondary)',
			childrenValues: [...Object.entries(value)].map(([key, value]) => ({ key, value }))
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

	private getStyle(path: KeyPath, highlights: Array<KeyPath>): any {
		if (!this.isInHighlights(path, highlights)) {
			return {};
		}

		return {
			'background-color': 'var(--highlight-bg)',
			'color': 'var(--highlight-text-color)',
		};
	}
}

interface TreeNodeBasicData {
	valueLabel: string;
	valueLabelColor: string;
	childrenValues: Array<{ key: string, value: unknown }>
}