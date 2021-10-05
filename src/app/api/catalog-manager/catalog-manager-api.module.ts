import { NgModule } from '@angular/core';
import { CatalogManagerApiService } from './catalog-manager-api.service';
import { CatalogManagerHttpService } from './http/catalog-manager-http.service';

@NgModule({
  providers: [CatalogManagerApiService, CatalogManagerHttpService],
})
export class CatalogManagerApiModule {}
