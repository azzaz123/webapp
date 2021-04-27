import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrivateComponent } from './private.component';
import { PrivateCoreModule } from './core/private-core.module';
import { PrivateLayoutModule } from './layout/private-layout.module';
import { PrivateRoutingModule } from './private-routing.module';
import { DeliveryDevelopmentGuard } from './features/delivery/guards/delivery-development.guard';

@NgModule({
  imports: [CommonModule, PrivateCoreModule, PrivateLayoutModule, PrivateRoutingModule],
  declarations: [PrivateComponent],
  providers: [DeliveryDevelopmentGuard],
})
export class PrivateModule {}
