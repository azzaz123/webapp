import { NgModule } from '@angular/core';
import { TopbarComponent } from './topbar/topbar.component';
import { MatIconModule } from '@angular/material';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

@NgModule({
  imports: [
    RouterModule,
    SharedModule,
    NgbDropdownModule,
    MatIconModule,
    FormsModule,
    NgbModule,
    UserModule,
    GeolocationModule,
    TrackingModule
  ],
  exports: [
    TopbarComponent,
    SidebarComponent
  ],
  declarations: [TopbarComponent, SuggesterComponent, SidebarComponent],
  providers: [GeolocationService, CategoryService, SuggesterService]
})
export class LayoutModule {
}
