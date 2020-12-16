import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from './topbar.component';
import { SuggesterComponent } from './suggester/suggester.component';
import { SuggesterService } from './suggester/suggester.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule,
    NgbTypeaheadModule,
  ],
  exports: [TopbarComponent, SuggesterComponent],
  declarations: [TopbarComponent, SuggesterComponent],
  providers: [SuggesterService],
})
export class TopbarModule {}
