import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { AcceptScreenComponent } from './accept-screen.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [AcceptScreenRoutingModule, CommonModule],
  declarations: [acceptScreenRoutedComponents, AcceptScreenComponent],
})
export class AcceptScreenModule {}
