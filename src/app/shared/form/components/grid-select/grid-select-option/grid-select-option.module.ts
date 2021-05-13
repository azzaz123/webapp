import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridSelectOptionComponent } from './grid-select-option.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { IsComplexIconPipe } from '@shared/form/components/grid-select/grid-select-option/pipes/is-complex-icon.pipe';
import { ShouldHideIconPipe } from '@shared/form/components/grid-select/grid-select-option/pipes/should-hide-icon.pipe';

@NgModule({
  declarations: [GridSelectOptionComponent, IsComplexIconPipe, ShouldHideIconPipe],
  exports: [GridSelectOptionComponent],
  imports: [CommonModule, SvgIconModule],
})
export class GridSelectOptionModule {}
