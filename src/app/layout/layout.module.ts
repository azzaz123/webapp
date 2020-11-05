import { NgModule } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import {
  NgbDropdownModule,
  NgbToastModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserModule } from '../core/user/user.module';
import { SuggesterComponent } from './topbar/suggester/suggester.component';
import { CategoryService } from '../core/category/category.service';
import { GeolocationService } from '../core/geolocation/geolocation.service';
import { SuggesterService } from './topbar/suggester/suggester.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { TrackingModule } from '../core/tracking/tracking.module';
import { SharedModule } from '../shared/shared.module';
import { TabbarComponent } from './tabbar/tabbar.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    NgbDropdownModule,
    FormsModule,
    UserModule,
    GeolocationModule,
    TrackingModule,
    NgbTypeaheadModule,
    NgbToastModule,
  ],
  exports: [TopbarComponent, SidebarComponent, TabbarComponent, ToastComponent],
  declarations: [
    TopbarComponent,
    SuggesterComponent,
    SidebarComponent,
    TabbarComponent,
    ToastComponent,
  ],
  providers: [GeolocationService, CategoryService, SuggesterService],
})
export class LayoutModule {}
