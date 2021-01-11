import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { SvgIconModule } from 'app/core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [DropdownComponent, DropdownListComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [DropdownComponent],
})
export class DropdownModule {}
