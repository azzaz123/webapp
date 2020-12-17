import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public.routing.module';
import { PublicCoreModule } from './core/public-core.module';
import { PublicLayoutModule } from './layout/public-layout.module';
import { PublicComponent } from './public.component';

@NgModule({
  imports: [PublicCoreModule, PublicLayoutModule, PublicRoutingModule],
  declarations: [PublicComponent],
})
export class PublicModule {}
