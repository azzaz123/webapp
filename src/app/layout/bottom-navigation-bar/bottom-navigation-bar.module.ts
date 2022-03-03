import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BottomNavigationBarComponent } from './components/bottom-navigation-bar.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { BottomNavigationBarService } from './services/bottom-navigation-bar.service';

@NgModule({
  declarations: [BottomNavigationBarComponent],
  imports: [CommonModule, RouterModule, SvgIconModule],
  exports: [BottomNavigationBarComponent],
  providers: [BottomNavigationBarService],
})
export class BottomNavigationBarModule {}
