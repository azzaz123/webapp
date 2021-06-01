import { NgModule } from '@angular/core';
import { cardRoutedComponents, CardRoutingModule } from './card.routing.module';

@NgModule({
  imports: [CardRoutingModule],
  declarations: [cardRoutedComponents],
})
export class CardModule {}
