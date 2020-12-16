import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserModule } from '../core/user/user.module';
import { CategoryService } from '../core/category/category.service';
import { GeolocationService } from '../core/geolocation/geolocation.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { TrackingModule } from '../core/tracking/tracking.module';
import { SharedModule } from '../shared/shared.module';
import { TabbarComponent } from './tabbar/tabbar.component';
import { ToastComponent } from './toast/toast.component';
import { TopbarModule } from './topbar/topbar.module';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    FormsModule,
    UserModule,
    NgbModule,
    GeolocationModule,
    TrackingModule,
    TopbarModule,
  ],
  exports: [TopbarModule, SidebarComponent, TabbarComponent, ToastComponent],
  declarations: [SidebarComponent, TabbarComponent, ToastComponent],
  providers: [GeolocationService, CategoryService],
})
export class LayoutModule {}
