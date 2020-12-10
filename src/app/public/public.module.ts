import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public.routing.module';
import { PublicCoreModule } from './core/public-core.module';
import { PublicLayoutModule } from './layout/public-layout.module';

@NgModule({
  imports: [
    CommonModule,
    PublicCoreModule,
    PublicLayoutModule,
    PublicRoutingModule,
  ],
})
export class PublicModule {}
