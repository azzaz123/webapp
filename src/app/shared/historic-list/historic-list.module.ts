import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';
import { HistoricElementComponent } from './components/historic-element/historic-element.component';
import { HistoricListComponent } from './components/historic-list/historic-list.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, InfiniteScrollModule, SvgIconModule],
  declarations: [HistoricElementComponent, HistoricListComponent],
  exports: [HistoricListComponent],
})
export class HistoricListModule {}
