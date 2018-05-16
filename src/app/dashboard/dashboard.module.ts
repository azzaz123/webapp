import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { dashboardRoutedComponents, DashboardRoutingModule } from './dashboard.routes';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule
  ],
  declarations: [dashboardRoutedComponents]
})
export class DashboardModule { }
