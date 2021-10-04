import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HistoricElementComponent } from './components/historic-element/historic-element.component';
import { HistoricListComponent } from './components/historic-list/historic-list.component';

@NgModule({
  declarations: [HistoricElementComponent, HistoricListComponent],
  imports: [CommonModule, InfiniteScrollModule, TabsBarModule, SvgIconModule],
})
export class HistoricListModule {}
