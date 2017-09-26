import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MdIconModule } from '@angular/material';
import { ConfirmationModalComponent } from './list/modals/confirmation-modal/confirmation-modal.component';
import { SoldModalComponent } from './list/modals/sold-modal/sold-modal.component';

@NgModule({
  imports: [
    SharedModule,
    CoreModule,
    CatalogRoutingModule,
    MdIconModule,
    InfiniteScrollModule
  ],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    ConfirmationModalComponent,
    SoldModalComponent
  ],
  entryComponents: [
    ConfirmationModalComponent,
    SoldModalComponent
  ]
})
export class CatalogModule {
}
