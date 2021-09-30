import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, InfiniteScrollModule, TabsBarModule, SvgIconModule],
})
export class HistoricListModule {}
