import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsBarComponent } from './components/tabs-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TabsBarComponent],
  exports: [TabsBarComponent],
})
export class TabsBarModule {}
