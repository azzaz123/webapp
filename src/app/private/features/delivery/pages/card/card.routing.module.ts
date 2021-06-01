import { Route, RouterModule } from '@angular/router';
import { CardComponent } from './card.component';
import { NgModule } from '@angular/core';

const routes: Route[] = [
  {
    path: '',
    component: CardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {}

export const cardRoutedComponents = [CardComponent];
