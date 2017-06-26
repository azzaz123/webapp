import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent]
})
export class LayoutModule {
}
