import { Component, computed, inject, signal } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { Store } from '../../domain/Store';
import { DropdownModule } from 'primeng/dropdown';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ParserVersion } from '../../domain/ParserVersion';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
	selector: 'app-header',
	templateUrl: './HeaderComponent.html',
	styleUrl: './HeaderComponent.scss',
	standalone: true,
	imports: [
		MenubarModule,
		DropdownModule,
		FormsModule,
		TreeSelectModule
	]
})
export class HeaderComponent {
	readonly store = inject(Store);

	readonly parsers = toSignal(this.store.availableParsers$, { initialValue: []});
	readonly selectedParserVersion = toSignal(this.store.selectedParserVersion$);
	readonly unselectCount = signal(1);

	readonly parserNodes = computed<Array<TreeNode<ParserVersion>>>(() => {
		return this.parsers().map(parser => ({
			label: parser.name,
			data: parser.latestVersion,
			key: `${parser.name}@${parser.latestVersion.version}`,
			children: parser.availableVersions.map(version => ({
				label: version.version,
				data: version,
				key: `${parser.name}@${version.version}`
			}))
		}))
	});

	readonly selectedParserNode = computed<TreeNode<ParserVersion> | null>(() => {
		this.unselectCount();
		const parserNodes = this.parserNodes();
		const selectedParserVersion = this.selectedParserVersion();

		if (!selectedParserVersion) {
			return null;
		}

		for (const parserNode of parserNodes) {
			if (parserNode.data === selectedParserVersion) {
				return { ...parserNode };
			}
			for (const versionNode of (parserNode.children ?? [])) {
				if (versionNode.data === selectedParserVersion) {
					return { ...versionNode };
				}
			}
		}

		return null;
	});

	onUnselect(): void {
		this.unselectCount.update((v) => v + 1);
	}
}