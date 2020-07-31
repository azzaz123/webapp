import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerRoutedComponents, registerNonroutedComponents, RegisterRoutingModule} from './register.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from './register.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RegisterRoutingModule
  ],
  providers: [
    RegisterService
  ],
  declarations: [
    registerRoutedComponents,
    registerNonroutedComponents,
  ],
})
export class RegisterModule { }
