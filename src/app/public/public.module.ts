import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public.routing.module';
import { PublicCoreModule } from './core/public-core.module';
import { PublicLayoutModule } from './layout/public-layout.module';
import { PublicComponent } from './public.component';
import { FooterModule } from '@shared/footer/footer.module';

@NgModule({
  imports: [
    PublicCoreModule,
    PublicLayoutModule,
    PublicRoutingModule,
    FooterModule,
  ],
  declarations: [PublicComponent],
  bootstrap: [PublicComponent],
})
export class PublicModule {}
