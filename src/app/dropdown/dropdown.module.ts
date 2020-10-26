import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { MatIconModule } from '@angular/material';

@NgModule({
  declarations: [
    DropdownComponent,
    DropdownListComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    DropdownComponent
  ]
})
export class DropdownModule { }
