import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_PROFILE } from '../../../tests/profile.fixtures.spec';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { ProfileService } from '../../core/profile/profile.service';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { CustomCurrencyPipe } from '../../shared/pipes';
import { ProfileCardFavoriteComponent } from './profile-card-favorite.component';

describe('ProfileCardFavoriteComponent', () => {
  let component: ProfileCardFavoriteComponent;
  let fixture: ComponentFixture<ProfileCardFavoriteComponent>;
  let element: HTMLElement;
  let modalService: NgbModal;
  let profileService: ProfileService;
  let subdomain: string;

  const modalRef: any = {
    result: Promise.resolve({
      score: 4,
      comments: 'comment',
      userId: USER_ID,
    }),
    componentInstance: {},
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ProfileCardFavoriteComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: NgbModal,
            useValue: {
              open() {
                return modalRef;
              },
            },
          },
          {
            provide: ProfileService,
            useValue: {
              favoriteItem() {
                return of({});
              },
            },
          },
          { provide: TrackingService, useClass: MockTrackingService },
          { provide: 'SUBDOMAIN', useValue: 'www' },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardFavoriteComponent);
    component = fixture.componentInstance;
    component.profile = MOCK_PROFILE;
    profileService = TestBed.inject(ProfileService);
    element = fixture.nativeElement;
    modalService = TestBed.inject(NgbModal);
    subdomain = TestBed.inject(<any>'SUBDOMAIN');

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
      expect(component.onFavoriteProfileChange.emit).toHaveBeenCalledWith(
        MOCK_PROFILE
      );
    });
  });

  describe('removeFavoriteModal', () => {
    let removeFavoriteButton;
    beforeEach(fakeAsync(() => {
      spyOn(component, 'removeFavoriteModal').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component, 'removeFavorite').and.callThrough();
      removeFavoriteButton = fixture.debugElement.nativeElement.querySelector(
        'tsl-card-footer'
      );
      removeFavoriteButton.click();
    }));

    it('when click tsl-cardFooter should call removeFavoriteModal method', () => {
      expect(component.removeFavoriteModal).toHaveBeenCalled();
    });

    it('should open accept modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        { windowClass: 'modal-prompt' }
      );
    });

    it('should set modal type "5" if profile is featured', () => {
      expect(modalRef.componentInstance.type).toEqual(5);
    });

    it('should call removeFavorite method ', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
    }));
  });

  describe('goToProfileDetail', () => {
    it('should change window url', () => {
      spyOn(window, 'open');
      const MOCK_PROFILE_URL: string =
        environment.siteUrl.replace('es', subdomain) +
        'user/' +
        MOCK_PROFILE.screen_name;
      component.goToProfileDetail();
      expect(window.open).toHaveBeenCalledWith(MOCK_PROFILE_URL);
    });
  });
});
