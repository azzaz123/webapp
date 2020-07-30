import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerRoutedComponents, registerNonroutedComponents, RegisterRoutingModule} from './register.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ],
  declarations: [
    registerRoutedComponents,
    registerNonroutedComponents,
  ],
})
export class RegisterModule { }
