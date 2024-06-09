import { ApplicationConfig } from '@angular/core';
import { Store } from '../domain/Store';
import { StoreImpl } from '../domain/StoreImpl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideParser } from '../domain/provideParser';
import { TypescriptEslintParserService } from '../domain/parsers/TypescriptEslintParserService';
import { AngularEslintTemplateParser } from '../domain/parsers/AngularEslintTemplateParser';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
	  { provide: Store, useClass: StoreImpl },
	  provideAnimations(),
	  provideHttpClient(),
	  provideParser(TypescriptEslintParserService),
	  provideParser(AngularEslintTemplateParser)
  ]
};
