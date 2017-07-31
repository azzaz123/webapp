import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { MdIconModule } from '@angular/material';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { GeolocationComponent } from "../geolocation/geolocation.component";
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesListComponent } from "../categories-list/categories-list.component";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    MdIconModule,
    FormsModule,
    NgbModule.forRoot(),
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent, GeolocationComponent, CategoriesListComponent]
})
export class LayoutModule {
}
