import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { deliveryRoutedComponents, DeliveryRoutingModule } from './delivery.routing.module';
import { NavLinksModule } from '@shared/nav-links/nav-links.module';
import { HeaderModule } from '@shared/header/header.module';

@NgModule({
  declarations: [deliveryRoutedComponents],
  imports: [CommonModule, DeliveryRoutingModule, NavLinksModule, HeaderModule],
})
export class DeliveryModule {}
