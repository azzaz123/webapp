import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { MdIconModule } from '@angular/material';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriesListComponent } from './topbar/categories-list/categories-list.component';
import { UserModule } from '../core/user/user.module';
import { SuggesterComponent } from './topbar/suggester/suggester.component';
import { CategoryService } from '../core/category/category.service';
import { GeolocationService } from '../core/geolocation/geolocation.service';
import { SuggesterService } from '../core/suggester/suggester.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileModalComponent } from './sidebar/profile-modal/profile-modal.component';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { TrackingModule } from '../core/tracking/tracking.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    MdIconModule,
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
  declarations: [TopbarComponent, CategoriesListComponent, SuggesterComponent, SidebarComponent, ProfileModalComponent],
  entryComponents: [ProfileModalComponent],
  providers: [GeolocationService, CategoryService, SuggesterService]
})
export class LayoutModule {
}
