import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deliveryRoutedComponents, DeliveryRoutingModule } from './delivery.routing.module';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';

@NgModule({
  declarations: [deliveryRoutedComponents],
  imports: [CommonModule, DeliveryRoutingModule, NavLinksModule, HeaderModule],
  providers: [ExitConfirmGuard],
})
export class DeliveryModule {}
