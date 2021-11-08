import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { AccountRoutedComponents, AccountRoutingModule } from './account.routing.module';

@NgModule({
  imports: [SharedModule, FormsModule, ReactiveFormsModule, NgbButtonsModule, AccountRoutingModule],
  declarations: [AccountRoutedComponents],
})
export class AccountModule {}
