import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './components/tab/tab.component';
import { TabsBarComponent } from './components/tabs-bar/tabs-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [TabsBarComponent, TabComponent],
  exports: [TabsBarComponent, TabComponent],
})
export class TabsBarModule {}
