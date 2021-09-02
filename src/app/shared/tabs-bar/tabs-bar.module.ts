import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsBarComponent } from './components/tabs-bar.component';
import { TabComponent } from './components/tab/tab.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TabsBarComponent, TabComponent],
  exports: [TabsBarComponent, TabComponent],
})
export class TabsBarModule {}
