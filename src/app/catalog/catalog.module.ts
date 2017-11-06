import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MdIconModule } from '@angular/material';
import { SoldModalComponent } from './list/modals/sold-modal/sold-modal.component';
import { FormsModule } from '@angular/forms';
import { UtilsModule } from 'shield';
import { SelectedItemsComponent } from './list/selected-items/selected-items.component';

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
    SoldModalComponent,
    SelectedItemsComponent
  ],
  entryComponents: [
    SoldModalComponent
  ]
})
export class CatalogModule {
}
