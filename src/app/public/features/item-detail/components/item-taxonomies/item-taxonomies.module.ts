import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemTaxonomiesComponent } from './item-taxonomies.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [ItemTaxonomiesComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [ItemTaxonomiesComponent],
})
export class ItemTaxonomiesModule {}
