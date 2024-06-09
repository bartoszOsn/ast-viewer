import { parse } from '@typescript-eslint/parser';
import { Parser } from '../Parser';
import { ParseDTO } from '@ast-viewer/shared';

export class TypescriptEslintParserService extends Parser {
	override name = '@typescript-eslint/parser';

	override async parse(code: string): Promise<ParseDTO> {
		try {
			const ast = parse(code, {
				errorOnTypeScriptSyntacticAndSemanticIssues: false,
				allowInvalidAST: true,
			});
			return {
				status: 'success',
				ast: ast
			};
		} catch (e) {
			if (e instanceof Error && hasLocation(e)) {
				return {
					status: 'failure',
					error: e.message,
					location: {
						start: { line: e.location.start.line, column: e.location.start.column },
						end: { line: e.location.end.line, column: e.location.end.column }
					}
				}
			}
			return {
				status: 'failure',
				error: 'Unknown error.',
				location: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 0 }
				}
			}
		}
	}

}

function hasLocation(e: Error): e is Error & { location: { start: { line: number, column: number }, end: { line: number, column: number } } } {
	return 'location' in e;
}