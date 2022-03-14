import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerNavigationComponent } from './components/drawer-navigation.component';
import { DrawerNavigationService } from './services/drawer-navigation.service';

@NgModule({
  declarations: [DrawerNavigationComponent],
  exports: [DrawerNavigationComponent],
  imports: [CommonModule],
  providers: [DrawerNavigationService],
})
export class DrawerNavigationModule {}
