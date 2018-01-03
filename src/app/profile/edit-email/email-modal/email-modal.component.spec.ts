import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailModalComponent } from './email-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from 'shield';

describe('EmailModalComponent', () => {
  let component: EmailModalComponent;
  let fixture: ComponentFixture<EmailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: UserService, useValue: {
          updateEmail() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
          close() {
          }
        }
        },
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          }
        }
        }
      ],
      declarations: [EmailModalComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
