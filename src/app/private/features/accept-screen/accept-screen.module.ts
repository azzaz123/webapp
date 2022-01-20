import { NgModule } from '@angular/core';
import { acceptScreenRoutedComponents, AcceptScreenRoutingModule } from './accept-screen.routing.module';
import { CommonModule } from '@angular/common';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { AcceptScreenStoreModule } from './services/accept-screen-store/accept-screen-store.module';

@NgModule({
  imports: [AcceptScreenRoutingModule, CommonModule, AcceptScreenStoreModule],
  declarations: [acceptScreenRoutedComponents, AcceptScreenModalComponent],
})
export class AcceptScreenModule {}
