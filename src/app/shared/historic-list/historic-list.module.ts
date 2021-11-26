import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';
import { HistoricElementComponent } from './components/historic-element/historic-element.component';
import { HistoricListComponent } from './components/historic-list/historic-list.component';

@NgModule({
  imports: [CommonModule, InfiniteScrollModule],
  declarations: [HistoricElementComponent, HistoricListComponent],
  exports: [HistoricListComponent],
})
export class HistoricListModule {}
