import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchableMovableMapComponent } from './searchable-movable-map.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SearchableMovableMapComponent],
  imports: [CommonModule, ReactiveFormsModule, SvgIconModule, NgbTypeaheadModule],
  exports: [SearchableMovableMapComponent],
})
export class SearchableMovableMapModule {}
