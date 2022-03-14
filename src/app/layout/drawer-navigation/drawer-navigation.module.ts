import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerNavigationComponent } from './components/drawer-navigation.component';
import { DrawerNavigationService } from './services/drawer-navigation.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DrawerNavigationComponent],
  exports: [DrawerNavigationComponent],
  imports: [CommonModule, SvgIconModule, RouterModule],
  providers: [DrawerNavigationService],
})
export class DrawerNavigationModule {}
