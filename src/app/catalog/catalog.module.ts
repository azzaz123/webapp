import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MdIconModule } from '@angular/material';
import { ConfirmationModalComponent } from './list/modals/confirmation-modal/confirmation-modal.component';
import { SoldModalComponent } from './list/modals/sold-modal/sold-modal.component';
import { FormsModule } from '@angular/forms';
import { UtilsModule } from 'shield';
import { SelectedItemsComponent } from './list/selected-items/selected-items.component';
import { BumpConfirmationModalComponent } from './list/modals/bump-confirmation-modal/bump-confirmation-modal.component';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    CoreModule,
    CatalogRoutingModule,
    MdIconModule,
    InfiniteScrollModule,
    UtilsModule
  ],
  declarations: [
    catalogRoutedComponents,
    CatalogItemComponent,
    ConfirmationModalComponent,
    SoldModalComponent,
    SelectedItemsComponent,
    BumpConfirmationModalComponent
  ],
  entryComponents: [
    BumpConfirmationModalComponent,
    ConfirmationModalComponent,
    SoldModalComponent
  ]
})
export class CatalogModule {
}
