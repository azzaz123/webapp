import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  registerRoutedComponents,
  registerNonroutedComponents,
  RegisterRoutingModule,
} from './register.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from './core/services/register.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule,
  ],
  providers: [RegisterService],
  declarations: [registerRoutedComponents, registerNonroutedComponents],
})
export class RegisterModule {}
