import { of } from 'rxjs';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe, UserProfileRoutePipe } from '@shared/pipes';
import { DecimalPipe } from '@angular/common';
import { ProfileCardFavoriteComponent } from './profile-card-favorite.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { ProfileService } from '@core/profile/profile.service';
import { MOCK_PROFILE } from '@fixtures/profile.fixtures.spec';
import { I18nService } from '@core/i18n/i18n.service';

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
      userId: USER_ID,
    }),
    componentInstance: {},
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ProfileCardFavoriteComponent, CustomCurrencyPipe, UserProfileRoutePipe],
        providers: [
          DecimalPipe,
          I18nService,
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

    it('should call removeFavorite method ', fakeAsync(() => {
      tick();
      expect(component.removeFavorite).toHaveBeenCalled();
    }));
  });
});
