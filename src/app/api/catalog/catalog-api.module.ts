import { NgModule } from '@angular/core';
import { CatalogApiService } from './catalog-api.service';
import { PublishedItemMapperService } from './mappers/published-item-mapper.service';
import { ImageMapperService } from './mappers/image-mapper.service';

@NgModule({
  providers: [CatalogApiService, PublishedItemMapperService, ImageMapperService],
})
export class CatalogApiModule {}
