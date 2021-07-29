import { NgModule } from '@angular/core';
import { CatalogApiService } from './catalog-api.service';
import { CatalogHttpService } from '@api/catalog/http/catalog-http.service';

@NgModule({
  providers: [CatalogApiService, CatalogHttpService],
})
export class CatalogApiModule {}
