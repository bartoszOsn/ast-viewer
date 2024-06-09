import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { Store } from '../domain/Store';
import { StoreImpl } from '../domain/StoreImpl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { CodeEditorModule } from '@ngstack/code-editor';

export const appConfig: ApplicationConfig = {
  providers: [
	  { provide: Store, useClass: StoreImpl },
	  provideAnimations(),
	  provideHttpClient(),
	  importProvidersFrom(CodeEditorModule.forRoot())
  ]
};
