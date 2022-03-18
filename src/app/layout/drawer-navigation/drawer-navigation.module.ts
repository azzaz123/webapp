import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerNavigationComponent } from './components/drawer-navigation.component';
import { DrawerNavigationSecondaryPageComponent } from './components/drawer-navigation-secondary-page/drawer-navigation-secondary-page.component';
import { DrawerNavigationService } from './services/drawer-navigation.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DrawerNavigationComponent, DrawerNavigationSecondaryPageComponent],
  exports: [DrawerNavigationComponent, DrawerNavigationSecondaryPageComponent],
  imports: [CommonModule, SvgIconModule, RouterModule],
  providers: [DrawerNavigationService],
})
export class DrawerNavigationModule {}
