import { InjectionToken, Provider, Type } from '@angular/core';
import { ParserService } from './ParserService';

export const PARSER_SERVICE_TOKEN = new InjectionToken<Array<ParserService>>('PARSER_SERVICE_TOKEN');

export function provideParser(parserService: Type<ParserService>): Provider {
	return {
		provide: PARSER_SERVICE_TOKEN,
		useClass: parserService,
		multi: true,
	};
}
