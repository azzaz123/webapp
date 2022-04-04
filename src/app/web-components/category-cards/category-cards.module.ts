import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryCardsComponent } from './category-cards.component';

@NgModule({
  imports: [CommonModule],
  declarations: [CategoryCardsComponent],
  exports: [CategoryCardsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryCardsModule {}
