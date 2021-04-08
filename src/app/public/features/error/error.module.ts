import { NgModule } from '@angular/core';
import { ErrorBoxModule } from '@shared/error-box/error-box.module';
import { ErrorRoutingModule, errorRoutedComponents } from './error.routing.module';

@NgModule({
  imports: [ErrorRoutingModule, ErrorBoxModule],
  declarations: [errorRoutedComponents],
})
export class ErrorModule {}
