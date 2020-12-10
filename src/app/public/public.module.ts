import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRoutingModule } from './public.routing.module';
import { PublicCoreModule } from './core/public-core.module';

@NgModule({
  imports: [CommonModule, PublicCoreModule, PublicRoutingModule],
})
export class PublicModule {}
