import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { YouRoutingModule } from './you-routing.module';
import { YouComponent } from './pages/you.component';
import { DrawerNavigationModule } from '@layout/drawer-navigation/drawer-navigation.module';

@NgModule({
  declarations: [YouComponent],
  imports: [CommonModule, YouRoutingModule, DrawerNavigationModule],
})
export class YouModule {}
