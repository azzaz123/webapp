import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDropDirective } from './file-drop.directive';
import { FileSelectDirective } from './file-select.directive';
import { UploaderService } from './uploader.service';

@NgModule({
  imports: [CommonModule],
  declarations: [FileDropDirective, FileSelectDirective],
  exports: [FileDropDirective, FileSelectDirective],
  providers: [UploaderService],
})
export class UploaderModule {}
