import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { MdIconModule } from '@angular/material';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { GeolocationComponent } from './topbar/geolocation/geolocation.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesListComponent } from './topbar/categories-list/categories-list.component';
import { UserModule } from '../core/user/user.module';
import { SuggesterComponent } from './topbar/suggester/suggester.component';
import { CategoryService } from '../core/category/category.service';
import { GeolocationService } from '../core/geolocation/geolocation.service';
import { SuggesterService } from '../core/suggester/suggester.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UploadModalComponent } from './topbar/upload-modal/upload-modal.component';
import { ProfileModalComponent } from './sidebar/profile-modal/profile-modal.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    MdIconModule,
    FormsModule,
    NgbModule,
    UserModule
  ],
  exports: [
    TopbarComponent,
    SidebarComponent
  ],
  declarations: [TopbarComponent, GeolocationComponent, CategoriesListComponent, SuggesterComponent, SidebarComponent, UploadModalComponent, ProfileModalComponent],
  entryComponents: [UploadModalComponent, ProfileModalComponent],
  providers: [GeolocationService, CategoryService, SuggesterService]
})
export class LayoutModule {
}
