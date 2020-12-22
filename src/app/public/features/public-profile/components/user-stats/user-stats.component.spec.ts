import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RouterTestingModule } from '@angular/router/testing';
import { UserStatsComponent } from './user-stats.component';
import { By } from '@angular/platform-browser';
import {
  MOCK_FULL_USER_FEATURED,
  MOCK_USER_STATS,
} from '@fixtures/user.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

describe('UserStatsComponent', () => {
  const profileUserClass = '.ProfileUser';
  let component: UserStatsComponent;
  let fixture: ComponentFixture<UserStatsComponent>;
  let deviceDetectorService: DeviceDetectorService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [UserStatsComponent],
      providers: [
        {
          provide: DeviceDetectorService,
          useValue: {
            isMobile() {
              return false;
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
            url: 'environment/public/user/1234/published',
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStatsComponent);
    component = fixture.componentInstance;
    component.userInfo = MOCK_FULL_USER_FEATURED;
    component.userStats = MOCK_USER_STATS;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we have the necessary data...', () => {
    it('should show the content', () => {
      const containerPage = fixture.debugElement.query(
        By.css(profileUserClass)
      );

      expect(containerPage).toBeTruthy();
    });

    describe('when we click on the location anchor...', () => {
      const expectedURL = 'environment/public/user/1234/info';

      describe('and when our device is NOT a phone', () => {
        it('should redirect to info path...', () => {
          locationSpyAndClick();

          expect(component.showLocation).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([expectedURL]);
        });

        describe('and when our device is a phone', () => {
          it('should redirect to info path with fragment...', () => {
            spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);
            locationSpyAndClick();

            expect(component.showLocation).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledTimes(1);
            expect(router.navigate).toHaveBeenCalledWith([expectedURL], {
              fragment: 'map',
            });
          });
        });
      });
    });

    describe('when the user is pro...', () => {
      describe('when have the extra info...', () => {
        it('should show three anchors if it have the extra info', () => {
          const errorMessages = fixture.debugElement.queryAll(By.css('a'));

          expect(errorMessages.length).toBe(3);
        });

        it('should toggle the phone when click on the anchor...', () => {
          spyOn(component, 'togglePhone').and.callThrough();
          const phoneAnchor = fixture.debugElement
            .queryAll(By.css('a'))
            .find(
              (anchors) =>
                anchors.nativeElement.innerHTML === 'Show phone number'
            ).nativeElement;

          phoneAnchor.click();

          expect(component.togglePhone).toHaveBeenCalledTimes(1);
          expect(component.isPhone).toBe(true);
        });
      });
      describe('when NOT have the extra info', () => {
        it('should show one anchor if it have NOT the extra info', () => {
          component.userInfo.extraInfo.phone_number = null;
          component.userInfo.extraInfo.link = null;

          fixture.detectChanges();
          const errorMessages = fixture.debugElement.queryAll(By.css('a'));

          expect(errorMessages.length).toBe(1);
        });
      });
    });

    describe('when the user is NOT pro...', () => {
      it('should show only one anchor', () => {
        component.userInfo.featured = false;

        fixture.detectChanges();
        const errorMessages = fixture.debugElement.queryAll(By.css('a'));

        expect(errorMessages.length).toBe(1);
      });
    });
  });

  describe('when we NOT have the necessary data...', () => {
    it('should NOT show the content', () => {
      component.userStats = null;

      fixture.detectChanges();
      const containerPage = fixture.debugElement.query(
        By.css(profileUserClass)
      );

      expect(containerPage).toBeFalsy();
    });
  });

  function locationSpyAndClick() {
    spyOn(router, 'navigate');
    spyOn(component, 'showLocation').and.callThrough();
    const locationAnchor = fixture.debugElement
      .queryAll(By.css('a'))
      .find((anchors) => anchors.nativeElement.innerHTML === 'View location')
      .nativeElement;

    locationAnchor.click();
  }
});
