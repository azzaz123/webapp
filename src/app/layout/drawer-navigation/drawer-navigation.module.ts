import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerNavigationComponent } from './components/drawer-navigation.component';

@NgModule({
  declarations: [DrawerNavigationComponent],
  exports: [DrawerNavigationComponent],
  imports: [CommonModule],
})
export class DrawerNavigationModule {}
