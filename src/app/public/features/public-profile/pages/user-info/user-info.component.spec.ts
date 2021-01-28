import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ScrollIntoViewService } from '@core/scroll-into-view/scroll-into-view';
import { UserValidations } from '@core/user/user-response.interface';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { MAP_REDIRECTION } from '../../public-profile-routing-constants';

import { UserInfoComponent } from './user-info.component';

describe('UserInfoComponent', () => {
  let deviceDetectorService: DeviceDetectorService;
  let scrollIntoViewService: ScrollIntoViewService;

  const mapTag = 'tsl-here-maps';
  const containerClass = '.UserInfo';
  const fakeMapClass = '.UserInfo__fake-map';
  const mediaClass = '.UserInfo__containerMedia__media';

  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ScrollIntoViewService,
          useValue: {
            scrollToElement: () => {},
          },
        },
        {
          provide: PublicProfileService,
          useValue: {
            user: MOCK_USER,
            getExtraInfo() {
              return of(MOCK_USER.extraInfo);
            },
          },
        },
        {
          provide: DeviceDetectorService,
          useValue: {
            isMobile() {
              return false;
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            fragment: of(MAP_REDIRECTION),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    scrollIntoViewService = TestBed.inject(ScrollIntoViewService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is not defined...', () => {
    it('should NOT show the user info', () => {
      component.user = null;

      fixture.detectChanges();
      const containerDiv = fixture.debugElement.query(By.css(containerClass));

      expect(containerDiv).toBeFalsy();
    });
  });

  describe('when the user is defined...', () => {
    it('should show the user info', () => {
      const containerDiv = fixture.debugElement.query(By.css(containerClass));

      expect(containerDiv).toBeTruthy();
    });

    describe('when the user NOT have coordinates', () => {
      it('should NOT show the map', () => {
        component.coordinates = null;

        fixture.detectChanges();
        const mapComponent = fixture.debugElement.query(By.css(mapTag));
        const fakeMapComponent = fixture.debugElement.query(
          By.css(fakeMapClass)
        );

        expect(mapComponent).toBeFalsy();
        expect(fakeMapComponent).toBeTruthy();
      });
    });

    describe('when the user have coordinates', () => {
      it('should show the map', () => {
        const mapComponent = fixture.debugElement.query(By.css(mapTag))
          .nativeElement;
        const fakeMapComponent = fixture.debugElement.query(
          By.css(fakeMapClass)
        );

        expect(mapComponent).toBeTruthy();
        expect(fakeMapComponent).toBeFalsy();
      });
    });

    describe('when the information is verified...', () => {
      beforeEach(() => {
        component.userValidations = {
          email: true,
          facebook: true,
          mobile: true,
        } as any;
      });

      it('should NOT apply the disabled style', () => {
        fixture.detectChanges();
        const mediaDivs = fixture.debugElement.queryAll(By.css(mediaClass));

        expect(mediaDivs.length).toBe(3);
        mediaDivs.forEach((x) => {
          expect(x.nativeElement.classList).not.toContain('disabled');
        });
      });
    });

    describe('when the information is NOT verified...', () => {
      beforeEach(() => {
        component.userValidations = {
          email: false,
          facebook: false,
          mobile: false,
        } as any;
      });

      it('should apply the disabled style', () => {
        fixture.detectChanges();
        const mediaDivs = fixture.debugElement.queryAll(By.css(mediaClass));

        expect(mediaDivs.length).toBe(3);
        mediaDivs.forEach((x) => {
          expect(x.nativeElement.classList).toContain('disabled');
        });
      });
    });

    describe('when we access from the header', () => {
      it('should scroll if the device is a mobile', () => {
        spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);
        spyOn(scrollIntoViewService, 'scrollToElement');

        fixture.detectChanges();
        component.ngAfterViewInit();

        expect(scrollIntoViewService.scrollToElement).toHaveBeenCalledWith(
          component.mapView.nativeElement
        );
      });

      it('should NOT scroll if the device is NOT a mobile', () => {
        spyOn(scrollIntoViewService, 'scrollToElement');

        expect(scrollIntoViewService.scrollToElement).not.toHaveBeenCalled();
      });
    });
  });
});
