import { NgModule } from '@angular/core';
import { payviewRoutedComponents, PayviewRoutingModule } from './payview.routing.module';

@NgModule({
  imports: [PayviewRoutingModule],
  declarations: [payviewRoutedComponents],
})
export class PayviewModule {}
