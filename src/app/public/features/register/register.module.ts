import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  registerRoutedComponents,
  registerNonroutedComponents,
  RegisterRoutingModule,
} from './register.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from './core/services/register.service';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
    SharedModule,
  ],
  providers: [RegisterService],
  declarations: [registerRoutedComponents, registerNonroutedComponents],
})
export class RegisterModule {}
