import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from '@dubai-design-system/components-js/loader';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

defineCustomElements();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
