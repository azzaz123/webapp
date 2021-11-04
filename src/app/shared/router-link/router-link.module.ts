import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkDirectiveStub } from './router-link-directive-stub';

@NgModule({
  declarations: [RouterLinkDirectiveStub],
  exports: [RouterLinkDirectiveStub],
  imports: [CommonModule],
})
export class RouterLinkModule {}
