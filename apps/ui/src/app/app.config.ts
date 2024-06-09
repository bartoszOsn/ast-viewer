import { ApplicationConfig } from '@angular/core';
import { Store } from '../domain/Store';
import { StoreImpl } from '../domain/StoreImpl';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
	  { provide: Store, useClass: StoreImpl },
	  provideAnimations(),
	  provideHttpClient()
  ]
};
