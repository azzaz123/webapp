import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@shared/button/button.module';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { SortFilterComponent } from './sort-filter.component';

@NgModule({
  imports: [SelectFormModule, ReactiveFormsModule, NgbDropdownModule, ButtonModule, SvgIconModule],
  declarations: [SortFilterComponent],
  exports: [SortFilterComponent],
})
export class SortFilterModule {}
