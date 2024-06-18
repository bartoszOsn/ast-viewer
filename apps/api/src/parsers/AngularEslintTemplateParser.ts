import { Parser } from '../Parser';
import { ParseDTO } from '@ast-viewer/shared';

export class AngularEslintTemplateParser extends Parser {
	override name = '@angular-eslint/template-parser';
	override language = 'HTML';

	override parse(code: string): Promise<ParseDTO> {
		return Promise.resolve({
			status: 'success',
			ast: { markup: code }
		});
	}

}