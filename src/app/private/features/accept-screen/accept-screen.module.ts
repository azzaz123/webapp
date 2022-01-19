import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { CommonModule } from '@angular/common';
import { AcceptScreenModalComponent } from './components/accept-screen-modal/accept-screen-modal.component';

@NgModule({
  imports: [AcceptScreenRoutingModule, CommonModule],
  declarations: [acceptScreenRoutedComponents, AcceptScreenModalComponent],
})
export class AcceptScreenModule {}
