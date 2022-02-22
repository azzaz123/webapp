import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchableMovableMapComponent } from './searchable-movable-map.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { MovableMapModule } from '../movable-map/movable-map.module';

@NgModule({
  declarations: [SearchableMovableMapComponent],
  imports: [CommonModule, ReactiveFormsModule, SvgIconModule, NgbTypeaheadModule, MovableMapModule],
  exports: [SearchableMovableMapComponent],
})
export class SearchableMovableMapModule {}
