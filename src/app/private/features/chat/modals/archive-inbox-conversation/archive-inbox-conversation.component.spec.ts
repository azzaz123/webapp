import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArchiveInboxConversationComponent } from './archive-inbox-conversation.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { I18nService } from '@core/i18n/i18n.service';
import { MomentCalendarSpecService } from '@core/i18n/moment/moment-calendar-spec.service';

describe('ArchiveInboxConversationComponent', () => {
  let component: ArchiveInboxConversationComponent;
  let fixture: ComponentFixture<ArchiveInboxConversationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot()],
        providers: [NgbActiveModal, I18nService, MomentCalendarSpecService],
        declarations: [ArchiveInboxConversationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveInboxConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
