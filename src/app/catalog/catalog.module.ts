import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { CatalogItemComponent } from './list/catalog-item/catalog-item.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { MdIconModule } from '@angular/material';
import { DeleteItemComponent } from './list/modals/delete-item/delete-item.component';

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
    DeleteItemComponent
  ],
  entryComponents: [
    DeleteItemComponent
  ]
})
export class CatalogModule {
}
