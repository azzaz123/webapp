import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchableMovableMapComponent } from './searchable-movable-map.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [SearchableMovableMapComponent],
  imports: [CommonModule, ReactiveFormsModule, SvgIconModule],
  exports: [SearchableMovableMapComponent],
})
export class SearchableMovableMapModule {}
