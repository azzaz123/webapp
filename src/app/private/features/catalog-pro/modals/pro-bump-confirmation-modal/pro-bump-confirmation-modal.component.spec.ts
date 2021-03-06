import { of } from 'rxjs';
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProBumpConfirmationModalComponent } from './pro-bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { environment } from 'environments/environment';

let component: ProBumpConfirmationModalComponent;
let fixture: ComponentFixture<ProBumpConfirmationModalComponent>;
let userService: UserService;

describe('BumpConfirmationModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProBumpConfirmationModalComponent],
      providers: [
        NgbActiveModal,
        {
          provide: UserService,
          useValue: {
            me() {
              return of(MOCK_USER);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ProBumpConfirmationModalComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
