import { TypescriptEslintParserService } from './parsers/TypescriptEslintParserService';
import { AngularEslintTemplateParser } from './parsers/AngularEslintTemplateParser';

export const parsers = [
	new TypescriptEslintParserService(),
	new AngularEslintTemplateParser()
];
