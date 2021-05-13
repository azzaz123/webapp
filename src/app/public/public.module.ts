import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PublicRouterOutletModule } from './core/directives/public-router-outlet/public-router-outlet.module';
import { PublicCoreModule } from './core/public-core.module';
import { PublicLayoutModule } from './layout/public-layout.module';
import { PublicComponent } from './public.component';
import { PublicRoutingModule } from './public.routing.module';
@NgModule({
  imports: [CommonModule, PublicCoreModule, PublicLayoutModule, PublicRoutingModule, PublicRouterOutletModule],
  declarations: [PublicComponent],
})
export class PublicModule {}
