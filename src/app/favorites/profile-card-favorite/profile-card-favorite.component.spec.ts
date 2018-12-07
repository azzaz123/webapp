import {async, ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { ProfileCardFavoriteComponent } from './profile-card-favorite.component';
import { MatIconModule } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../core/tracking/tracking.service';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { ProfileService } from '../../core/profile/profile.service';
import { MOCK_PROFILE } from '../../../tests/profile.fixtures.spec';

describe('ProfileCardFavoriteComponent', () => {
  let component: ProfileCardFavoriteComponent;
  let fixture: ComponentFixture<ProfileCardFavoriteComponent>;
  let element: HTMLElement;
  
  let modalService: NgbModal;
  let profileService: ProfileService;

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
        { provide: NgbModal, useValue: {
            open() {
              return modalRef;
            }
          }
        },
        { provide: ProfileService, useValue: {
            favoriteItem () {
              return Observable.of({});
            }
          }
        },
        {provide: TrackingService, useClass: MockTrackingService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardFavoriteComponent);
    component = fixture.componentInstance;
    component.profile = MOCK_PROFILE;
    profileService = TestBed.get(ProfileService);
    element = fixture.nativeElement;
    modalService = TestBed.get(NgbModal);

    fixture.detectChanges();
  });

  describe('removeFavorite', () => {
    beforeEach(() => {
      spyOn(component.onFavoriteProfileChange, 'emit');
    });
    it('should set favorited property to false', () => {
      component.profile.favorited = true;
      component.removeFavorite();
      expect(component.profile.favorited).toBe(false);
    });
    it('should call onFavoriteChange emit method', () => {
      component.removeFavorite();
      expect(component.onFavoriteProfileChange.emit).toHaveBeenCalledWith(MOCK_PROFILE);
    });
  });

  describe('removeFavoriteModal', () => {
    let removeFavoriteButton;
    beforeEach(fakeAsync(() => {
      spyOn(component, 'removeFavoriteModal').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'removeFavorite').and.callThrough();
      removeFavoriteButton = fixture.debugElement.nativeElement.querySelector('tsl-card-footer');
      removeFavoriteButton.click();
    }));

    it('when click tsl-cardFooter should call removeFavoriteModal method', () => {
      expect(component.removeFavoriteModal).toHaveBeenCalled();
    });

    it('should open accept modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent);
    });

    it('should set modal type "5" if profile is featured', () => {
      expect(modalRef.componentInstance.type).toEqual(5);
    });

    it('should call removeFavorite method ', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
    }));
  });

});
