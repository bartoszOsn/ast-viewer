import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AstTreeNodeData } from './AstTreeNodeData';
import { KeyPath, keyPathArrayContains, keyPathEquals } from './KeyPath';
import { isPrimitive, Primitive } from '../../util/primitive';

@Injectable()
export class AstTreeService {
	private readonly typeToColorMap: Record<string, string> = {
		'number': 'var(--indigo-700)',
		'string': 'var(--green-700)',
		'boolean': 'var(--indigo-700)',
	};

	objectToTreeNodes(object: Record<any, any>, highlight: Array<KeyPath>, expanded: Array<KeyPath>, focused: KeyPath | undefined): Array<TreeNode<AstTreeNodeData>> {
		const result: Array<TreeNode<AstTreeNodeData>> = [];
		for (const key in object) {
			const value = object[key];
			const keyPath: KeyPath = [key];
			const treeNode = this.valueToTreeNode(value, keyPath, highlight, expanded, focused);
			result.push(treeNode);
		}
		return result;
	}

	private valueToTreeNode(value: unknown, keyPath: KeyPath, highlight: Array<KeyPath>, expanded: Array<KeyPath>, focused: KeyPath | undefined): TreeNode<AstTreeNodeData> {

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

		const isFocused = !!focused && keyPathEquals(focused, keyPath);
		return {
			key: keyPath.join('.'),
			label: keyPath[keyPath.length - 1],
			data: {
				keyPath: keyPath,
				valueLabel: basicData.valueLabel,
				valueLabelColor: basicData.valueLabelColor,
				highlight: this.isInHighlights(keyPath, highlight),
			},
			icon: isFocused ? 'pi pi-star-fill' : undefined,
			expanded: keyPathArrayContains(expanded, keyPath),
			style: this.getStyle(keyPath, highlight, isFocused),
			children: basicData.childrenValues.map(({ key, value }) => this.valueToTreeNode(value, [...keyPath, key], highlight, expanded, focused))
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
		return keyPathArrayContains(highlights, path);
	}

	private getStyle(path: KeyPath, highlights: Array<KeyPath>, isFocused: boolean): any {
		if (!this.isInHighlights(path, highlights)) {
			return {};
		}

		return {
			'background-color': 'var(--highlight-bg)',
			'color': 'var(--highlight-text-color)',
			// 'animation': isFocused ? 'pulse 0.3s 1' : 'none',
			'animation-name': isFocused ? 'pulse' : 'none',
			'animation-duration': '0.1s',
			'animation-iteration-count': '1',
			'animation-timing-function': 'ease-out'
		};
	}
}

interface TreeNodeBasicData {
	valueLabel: string;
	valueLabelColor: string;
	childrenValues: Array<{ key: string, value: unknown }>
}