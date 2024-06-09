import { Injectable } from '@angular/core';
import { ParserService } from '../ParserService';

@Injectable()
export class TypescriptEslintParserService extends ParserService {
    override parserName: string = '@typescript-eslint/parser';

    override parse(code: string): unknown {
		return { code };
    }

}