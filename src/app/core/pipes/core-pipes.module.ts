import { NgModule } from '@angular/core';
import { WebSlugConverterPipe } from './web-slug-converter/web-slug-converter.pipe';

@NgModule({
  declarations: [WebSlugConverterPipe],
  exports: [WebSlugConverterPipe],
})
export class CorePipesModule {}
