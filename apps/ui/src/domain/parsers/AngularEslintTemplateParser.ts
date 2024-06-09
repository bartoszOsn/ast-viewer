import { Injectable } from '@angular/core';
import { ParserService } from '../ParserService';

@Injectable()
export class AngularEslintTemplateParser extends ParserService {
	override parserName: string = '@angular-eslint/template-parser';

	override parse(code: string): unknown {
		return { markup: code };
	}

}