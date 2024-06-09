import { Parser } from '../Parser';
import { ParseDTO } from '@ast-viewer/shared';

export class AngularEslintTemplateParser extends Parser {
	override name: string = '@angular-eslint/template-parser';

	override parse(code: string): Promise<ParseDTO> {
		return Promise.resolve({
			status: 'success',
			ast: { markup: code }
		});
	}

}