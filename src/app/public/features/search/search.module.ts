import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { SearchComponent } from './pages/search.component';
import { SearchRoutingModule } from './search.routing.module';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';

@NgModule({
  imports: [SharedModule, SearchRoutingModule],
  declarations: [SearchComponent, SearchLayoutComponent],
})
export class SearchModule {}
