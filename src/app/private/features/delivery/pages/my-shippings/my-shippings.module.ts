import { NgModule } from '@angular/core';
import { myShippingsRoutedComponents, MyShippingsTrackingRoutingModule } from './my-shippings.routing.module';

@NgModule({
  imports: [MyShippingsTrackingRoutingModule],
  declarations: [myShippingsRoutedComponents],
})
export class MyShippingsModule {}
