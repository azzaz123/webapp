import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PublicCoreModule } from './core/public-core.module';
import { PublicLayoutModule } from './layout/public-layout.module';
import { PublicComponent } from './public.component';
import { PublicRoutingModule } from './public.routing.module';
@NgModule({
  imports: [CommonModule, PublicCoreModule, PublicLayoutModule, PublicRoutingModule],
  declarations: [PublicComponent],
})
export class PublicModule {}
