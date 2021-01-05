import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserModule } from '../core/user/user.module';
import { CategoryService } from '../core/category/category.service';
import { GeolocationService } from '../core/geolocation/geolocation.service';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { TrackingModule } from '../core/tracking/tracking.module';
import { SharedModule } from '../shared/shared.module';
import { TopbarModule } from './topbar/topbar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { TabbarModule } from './tabbar/tabbar.module';
import { ToastModule } from './toast/toast.module';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    FormsModule,
    UserModule,
    NgbModule,
    GeolocationModule,
    TrackingModule,
    SidebarModule,
    TopbarModule,
    ToastModule,
    TabbarModule,
  ],
  exports: [SidebarModule, TopbarModule, TabbarModule, ToastModule],
  providers: [GeolocationService, CategoryService],
})
export class LayoutModule {}
