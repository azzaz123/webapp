import { NgModule } from '@angular/core';
import { CategoriesHttpService } from './http/categories-http.service';
import { CategoriesApiService } from './categories-api.service';

@NgModule({
  providers: [CategoriesApiService, CategoriesHttpService],
})
export class CategoriesApiModule {}
