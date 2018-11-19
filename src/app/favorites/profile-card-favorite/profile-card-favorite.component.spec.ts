import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { ProfileCardFavoriteComponent } from './profile-card-favorite.component.ts';
import { MatIconModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../core/tracking/tracking.service';
import { WindowRef } from '../../core/window/window.service';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';

describe('ProfileCardFavoriteComponent', () => {
  let component: ProfileCardFavoriteComponent;
  let fixture: ComponentFixture<ProfileCardFavoriteComponent>;
  let element: HTMLElement;

  let windowRef: WindowRef;
  let subdomain: string;
  let modalService: NgbModal;

  const modalRef: any = {
    result: Promise.resolve({
      score: 4,
      comments: 'comment',
      userId: USER_ID
    }),
    componentInstance: {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ ProfileCardFavoriteComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        { provide: WindowRef, useValue: {
            nativeWindow: {
              open: () => {}
            }
          }
        },
        { provide: NgbModal, useValue: {
            open() {
              return modalRef;
            }
          }
        },
        {provide: TrackingService, useClass: MockTrackingService},
        { provide: 'SUBDOMAIN', useValue: 'www'}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardFavoriteComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    windowRef = TestBed.get(WindowRef);
    modalService = TestBed.get(NgbModal);
    subdomain = TestBed.get('SUBDOMAIN');

    fixture.detectChanges();
  });

});
