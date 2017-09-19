import { NgModule } from '@angular/core';
import { catalogRoutedComponents, CatalogRoutingModule } from './catalog.routes';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    SharedModule,
    CoreModule,
    CatalogRoutingModule
  ],
  declarations: [
    catalogRoutedComponents
  ],
})
export class CatalogModule {
}
