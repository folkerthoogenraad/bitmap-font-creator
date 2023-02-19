import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { initPWA } from './ts/pwa/PWA';

initPWA();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
