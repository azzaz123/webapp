import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { PublicProfileService } from '../../core/services/public-profile.service';
import { MAP_REDIRECTION } from '../../public-profile-routing-constants';

import { UserInfoComponent } from './user-info.component';

describe('UserInfoComponent', () => {
  let deviceDetectorService: DeviceDetectorService;

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
          provide: PublicProfileService,
          useValue: {
            user: MOCK_USER,
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
        component.user.validations.email = true;
        component.user.validations.facebook = true;
        component.user.validations.mobile = true;
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
        component.user.validations.email = false;
        component.user.validations.facebook = false;
        component.user.validations.mobile = false;
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
        spyOn(component.mapView.nativeElement, 'scrollIntoView');

        fixture.detectChanges();
        component.ngAfterViewInit();

        expect(
          component.mapView.nativeElement.scrollIntoView
        ).toHaveBeenCalledWith({ behavior: 'smooth' });
      });

      it('should NOT scroll if the device is NOT a mobile', () => {
        spyOn(component.mapView.nativeElement, 'scrollIntoView');

        expect(
          component.mapView.nativeElement.scrollIntoView
        ).not.toHaveBeenCalled();
      });
    });
  });
});
