import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BottomNavigationBarComponent } from './components/bottom-navigation-bar.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [BottomNavigationBarComponent],
  imports: [CommonModule, RouterModule, SvgIconModule],
  exports: [BottomNavigationBarComponent],
})
export class BottomNavigationBarModule {}
