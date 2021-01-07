import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabbarComponent } from './components/tabbar.component';
import { TabbarService } from './core/services/tabbar.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [TabbarComponent],
  providers: [TabbarService],
  exports: [TabbarComponent],
})
export class TabbarModule {}
