import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardImageDirective,
  CardContentDirective,
  CardFooterDirective,
} from './card.directive';
import { CardComponent } from './card.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    CardImageDirective,
    CardContentDirective,
    CardFooterDirective,
    CardComponent,
  ],
  declarations: [
    CardContentDirective,
    CardImageDirective,
    CardFooterDirective,
    CardComponent,
  ],
})
export class CardModule {}
