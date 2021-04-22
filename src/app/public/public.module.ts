import { ErrorHandler, NgModule } from '@angular/core';
import { PublicRoutingModule } from './public.routing.module';
import { PublicCoreModule } from './core/public-core.module';
import { PublicLayoutModule } from './layout/public-layout.module';
import { PublicComponent } from './public.component';
import * as Sentry from '@sentry/angular';
import { CommonModule } from '@angular/common';

const SENTRY_DSN = 'https://adc218616a9041d5aab6f5857f99fb47@o391386.ingest.sentry.io/5722534';

//TODO: This implementation is temporary and will be moved to a new place after finishing the migration
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 0.7,
});

@NgModule({
  imports: [CommonModule, PublicCoreModule, PublicLayoutModule, PublicRoutingModule],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
  ],
  declarations: [PublicComponent],
})
export class PublicModule {}
